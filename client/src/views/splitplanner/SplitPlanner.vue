<template>
  <div class="workspace flex min-h-screen bg-gray-100 dark:bg-gray-900">
    <plan-drawer
      :open="menuOpen"
      :plans="Plans"
      :selected-id="plan ? plan._id : null"
      :create="onAddNewPlan"
      @select="onSelectPlan"
      @close="menuOpen = false"
    />

    <div class="workspace-main flex-1 pt-16 pb-16 min-w-0">
      <div
        ref="toolbar"
        class="
          workspace-toolbar
          sticky
          top-16
          z-20
          flex
          items-center
          gap-2
          px-3
          py-2
          border-b border-gray-300
          dark:border-gray-800
          bg-gray-100
          dark:bg-gray-900
          lg:hidden
        "
      >
        <button
          type="button"
          class="btn workspace-menu-btn"
          aria-label="Open plan list"
          :aria-expanded="menuOpen ? 'true' : 'false'"
          @click="menuOpen = !menuOpen"
        >
          <i class="material-icons">menu</i>
          <span class="workspace-menu-label">Plans</span>
        </button>
      </div>

      <div class="pt-4 sm:pt-5 pb-4 min-h-full px-2 sm:px-0">
        <div v-if="!plan" class="plan-empty-state">
          <p class="plan-empty-copy">
            Select a plan from the left, or create a new one to get started.
          </p>
        </div>

        <div v-if="plan">
          <plan-header
            :plan="plan"
            :result="result"
            :editing="editHeader"
            @edit="editHeader = true"
            @save="onSaveHeader"
            @delete="onDeletePlan"
            @amount-input="onAmountInput"
            @amount-commit="flushSave"
          />

          <p
            v-if="message"
            class="plan-message px-3 sm:pl-5 sm:pr-5 mt-2 text-xs"
            :class="messageIsError ? 'text-red-700 dark:text-red-400' : 'text-gray-500'"
            role="status"
          >
            {{ message }}
          </p>

          <div
            class="
              strategy-card
              mx-2
              sm:mx-3
              my-3
              rounded-lg
              border
              drop-shadow-md
              border-gray-300
              dark:border-gray-700
              bg-gray-100
              dark:bg-gray-800
            "
          >
            <plan-tools
              :symbols="symbolInput"
              :plan="plan"
              :result="result"
              :sticky-top="stickyTop"
              :import-enabled="ImportCapabilities.enabled"
              @update:symbols="symbolInput = $event"
              @add="onAddSymbols"
              @import="importOpen = true"
              @ltp-action="onLTPAction"
              @settings-change="queueSave"
            />
            <plan-table
              :plan="plan"
              :result="result"
              :after-changes="afterChanges"
              @change="queueSave"
              @message="setMessage"
              @refresh="onRefreshOne"
              @remove="onRemoveItem"
            />
          </div>
        </div>
      </div>
    </div>

    <import-dialog
      :open="importOpen"
      title="Import holdings"
      hint="Upload the holdings export from your broker. Nothing is saved until you review and import."
      :confirm-label="importConfirmLabel"
      :can-confirm="importSelectedCount > 0"
      :extract="onImportExtract"
      :confirm="onImportConfirm"
      @close="onImportClose"
    >
      <template #preview="{ result: preview }">
        <import-holdings-preview :items="preview.items" :existing-symbols="planSymbols" />
      </template>
    </import-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  computeSplit,
  newPlanItem,
  parseSymbolList,
  toEditable,
} from "../../common/splitPlan";
import { confirmDelete } from "../../shared/confirmDialog";
import ImportDialog from "../../components/ui/ImportDialog.vue";
import PlanDrawer from "./PlanDrawer.vue";
import PlanHeader from "./PlanHeader.vue";
import PlanTools from "./PlanTools.vue";
import PlanTable from "./PlanTable.vue";
import ImportHoldingsPreview from "./ImportHoldingsPreview.vue";

const QUOTE_CHUNK = 50;
const SAVE_DELAY = 600;
const AMOUNT_ERROR = "Enter an amount of zero or more.";
const AFTER_HIGHLIGHT_MS = 2500;
const APP_HEADER_PX = 64;
const STICKY_OVERLAP_PX = 1;

export default {
  name: "SplitPlanner",
  components: {
    ImportDialog,
    PlanDrawer,
    PlanHeader,
    PlanTools,
    PlanTable,
    ImportHoldingsPreview,
  },
  data() {
    return {
      menuOpen: false,
      plan: null,
      editHeader: false,
      symbolInput: "",
      message: "",
      messageIsError: false,
      saveTimer: null,
      saving: false,
      saveAgain: false,
      importOpen: false,
      importResult: null,
      afterChanges: {},
      afterTimer: null,
      stickyTop: APP_HEADER_PX,
      toolbarObserver: null,
    };
  },
  computed: {
    ...mapGetters("splitPlanModule", ["Plans"]),
    ...mapGetters("docImportModule", { ImportCapabilities: "Capabilities" }),
    importSelectedCount() {
      return this.importResult ? this.importResult.items.filter((i) => i.include).length : 0;
    },
    importConfirmLabel() {
      const n = this.importSelectedCount;
      return `Import ${n} ${n === 1 ? "stock" : "stocks"}`;
    },
    planSymbols() {
      return this.plan ? this.plan.items.map((i) => i.symbol) : [];
    },
    result() {
      if (!this.plan) {
        return computeSplit(0, [], false);
      }
      return computeSplit(
        this.plan.amount,
        this.plan.items,
        this.plan.useleftover,
        this.plan.allocationmode
      );
    },
  },
  created() {
    this.$watch(
      () => [this.plan, this.plan ? this.plan.amount : 0],
      ([plan], [oldPlan, oldAmount]) => {
        if (!plan || plan !== oldPlan) {
          this.clearAfterChanges();
          return;
        }
        this.highlightAfterChanges(oldAmount);
      }
    );
  },
  async mounted() {
    window.addEventListener("pagehide", this.flushSave);
    window.addEventListener("resize", this.updateStickyTop);
    if (window.ResizeObserver) {
      this.toolbarObserver = new ResizeObserver(this.updateStickyTop);
      const nav = document.querySelector("#app > nav");
      if (nav) {
        this.toolbarObserver.observe(nav);
      }
      if (this.$refs.toolbar) {
        this.toolbarObserver.observe(this.$refs.toolbar);
      }
    }
    this.updateStickyTop();
    this.$store.dispatch("docImportModule/GetImportCapabilities");
    try {
      const plans = await this.$store.dispatch("splitPlanModule/GetPlans");
      if (plans && plans.length) {
        this.plan = toEditable(plans[0]);
      }
    } catch (err) {
      this.showError(err, "Could not load your plans.");
    }
  },
  beforeUnmount() {
    window.removeEventListener("pagehide", this.flushSave);
    window.removeEventListener("resize", this.updateStickyTop);
    if (this.toolbarObserver) {
      this.toolbarObserver.disconnect();
      this.toolbarObserver = null;
    }
    this.clearAfterChanges();
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
      this.persist();
    }
  },
  methods: {
    setMessage(text, isError = false) {
      this.message = text;
      this.messageIsError = isError;
    },
    showError(err, fallback) {
      const msg = err && err.response && err.response.data && err.response.data.message;
      this.setMessage(msg || fallback, true);
    },
    findItem(symbol) {
      return this.plan ? this.plan.items.find((i) => i.symbol === symbol) : null;
    },
    payload() {
      return {
        _id: this.plan._id,
        name: this.plan.name,
        amount: Number(this.plan.amount) || 0,
        useleftover: this.plan.useleftover,
        allocationmode: this.plan.allocationmode,
        items: this.plan.items.map((i) => ({
          symbol: i.symbol,
          price: i.price,
          lasttradedprice: i.lasttradedprice,
          holdqty: i.holdqty,
          avgprice: i.avgprice,
          included: i.included,
        })),
      };
    },
    cancelQueuedSave() {
      if (this.saveTimer) {
        clearTimeout(this.saveTimer);
        this.saveTimer = null;
      }
    },
    queueSave() {
      if (!this.plan || !this.plan._id) {
        return;
      }
      this.cancelQueuedSave();
      this.saveTimer = setTimeout(() => {
        this.saveTimer = null;
        this.persist();
      }, SAVE_DELAY);
    },
    async persist() {
      if (!this.plan || !this.plan._id) {
        return false;
      }
      if (this.saving) {
        this.saveAgain = true;
        return true;
      }
      this.saving = true;
      try {
        await this.$store.dispatch("splitPlanModule/SavePlan", this.payload());
        return true;
      } catch (err) {
        this.showError(err, "Could not save the plan.");
        return false;
      } finally {
        this.saving = false;
        if (this.saveAgain) {
          this.saveAgain = false;
          this.persist();
        }
      }
    },
    flushSave() {
      if (this.saveTimer) {
        this.cancelQueuedSave();
        this.persist();
      }
    },
    async onAddNewPlan(name) {
      this.flushSave();
      try {
        const saved = await this.$store.dispatch("splitPlanModule/SavePlan", {
          name,
          amount: 0,
          useleftover: true,
          allocationmode: "equal",
          items: [],
        });
        this.plan = toEditable(saved);
        this.editHeader = false;
        this.menuOpen = false;
        this.setMessage("");
        return true;
      } catch (err) {
        this.showError(err, "Could not create the plan.");
        return false;
      }
    },
    onSelectPlan(saved) {
      this.menuOpen = false;
      if (this.plan && saved._id === this.plan._id) {
        return;
      }
      this.flushSave();
      this.plan = toEditable(saved);
      this.editHeader = false;
      this.setMessage("");
    },
    updateStickyTop() {
      const nav = document.querySelector("#app > nav");
      const navBottom = nav ? nav.getBoundingClientRect().bottom : APP_HEADER_PX;
      const toolbar = this.$refs.toolbar;
      const toolbarBottom =
        toolbar && toolbar.offsetParent !== null
          ? APP_HEADER_PX + toolbar.getBoundingClientRect().height
          : 0;
      this.stickyTop = Math.max(navBottom, toolbarBottom) - STICKY_OVERLAP_PX;
    },
    highlightAfterChanges(oldAmount) {
      const before = computeSplit(
        oldAmount,
        this.plan.items,
        this.plan.useleftover,
        this.plan.allocationmode
      );
      const previous = {};
      before.rows.forEach((row) => {
        previous[row.symbol] = row;
      });
      const changes = {};
      this.result.rows.forEach((row) => {
        const old = previous[row.symbol];
        if (!old) {
          return;
        }
        const qty = row.finalQty - old.finalQty;
        const avg = Math.round((row.finalAvg - old.finalAvg) * 100) / 100;
        if (qty || avg) {
          changes[row.symbol] = { qty, avg };
        }
      });
      if (this.afterTimer) {
        clearTimeout(this.afterTimer);
      }
      this.afterChanges = changes;
      this.afterTimer = setTimeout(() => {
        this.afterTimer = null;
        this.afterChanges = {};
      }, AFTER_HIGHLIGHT_MS);
    },
    clearAfterChanges() {
      if (this.afterTimer) {
        clearTimeout(this.afterTimer);
        this.afterTimer = null;
      }
      this.afterChanges = {};
    },
    onAmountInput() {
      const amount = Number(this.plan.amount);
      if (!Number.isFinite(amount) || amount < 0) {
        this.setMessage(AMOUNT_ERROR, true);
        return;
      }
      if (this.message === AMOUNT_ERROR) {
        this.setMessage("");
      }
      this.queueSave();
    },
    async onSaveHeader() {
      const amount = Number(this.plan.amount);
      if (!Number.isFinite(amount) || amount < 0) {
        this.setMessage(AMOUNT_ERROR, true);
        return;
      }
      this.editHeader = false;
      this.cancelQueuedSave();
      await this.persist();
    },
    async onDeletePlan() {
      const ok = await confirmDelete(`Remove the plan "${this.plan.name}"?`, "Remove plan");
      if (!ok) {
        return;
      }
      this.cancelQueuedSave();
      try {
        await this.$store.dispatch("splitPlanModule/DeletePlan", this.plan);
        this.plan = this.Plans.length ? toEditable(this.Plans[0]) : null;
        this.editHeader = false;
        this.setMessage("");
      } catch (err) {
        this.showError(err, "Could not remove the plan.");
      }
    },
    async onAddSymbols() {
      const { valid, invalid } = parseSymbolList(this.symbolInput);
      const fresh = valid.filter((s) => !this.findItem(s));
      if (!fresh.length) {
        this.setMessage(
          invalid.length
            ? `Not a valid NSE symbol: ${invalid.join(", ")}`
            : valid.length
            ? "Those stocks are already in the plan."
            : "Type one or more NSE symbols first.",
          invalid.length > 0
        );
        return;
      }
      fresh.forEach((symbol) => {
        this.plan.items.push(newPlanItem({ symbol }));
      });
      this.cancelQueuedSave();
      const plan = this.plan;
      const input = this.symbolInput;
      this.symbolInput = "";
      if (!(await this.persist())) {
        plan.items = plan.items.filter((i) => !fresh.includes(i.symbol));
        this.symbolInput = input;
        return;
      }
      const added = `Added ${fresh.length} ${fresh.length === 1 ? "stock" : "stocks"}. Refresh prices from the rupee menu, or edit a price by hand.`;
      this.setMessage(
        invalid.length ? `${added} Skipped: ${invalid.join(", ")}` : added,
        invalid.length > 0
      );
    },
    async fetchQuotes(symbols) {
      symbols.forEach((s) => {
        const item = this.findItem(s);
        if (item) {
          item.loading = true;
          item.error = "";
        }
      });
      let failed = 0;
      try {
        for (let i = 0; i < symbols.length; i += QUOTE_CHUNK) {
          const quotes = await this.$store.dispatch(
            "splitPlanModule/GetQuotes",
            symbols.slice(i, i + QUOTE_CHUNK)
          );
          quotes.forEach((q) => {
            const item = this.findItem(q.symbol);
            if (!item) {
              return;
            }
            if (q.lastPrice) {
              item.lasttradedprice = q.lastPrice;
              if (!item.price) {
                item.price = q.lastPrice;
              }
            } else {
              failed += 1;
              item.error = q.error || "No NSE price found.";
            }
          });
        }
        this.setMessage(
          failed ? `${failed} of ${symbols.length} last prices could not be fetched from NSE.` : "",
          failed > 0
        );
        this.queueSave();
      } catch (err) {
        this.showError(err, "Could not fetch NSE prices. Try again or edit prices by hand.");
      } finally {
        symbols.forEach((s) => {
          const item = this.findItem(s);
          if (item) {
            item.loading = false;
          }
        });
      }
    },
    onLTPAction(id) {
      if (!this.plan || !this.plan.items.length) {
        return;
      }
      if (id === "refresh") {
        this.fetchQuotes(this.plan.items.map((i) => i.symbol));
      } else if (id === "copy") {
        this.plan.items.forEach((i) => {
          if (i.lasttradedprice > 0) {
            i.price = i.lasttradedprice;
          }
        });
        this.queueSave();
      }
    },
    onRefreshOne(symbol) {
      this.fetchQuotes([symbol]);
    },
    onRemoveItem(symbol) {
      this.plan.items = this.plan.items.filter((i) => i.symbol !== symbol);
      this.queueSave();
    },
    async onImportExtract(file) {
      const result = await this.$store.dispatch("splitPlanModule/ImportHoldings", file);
      result.items = (result.items || []).map((i) => ({ ...i, include: true }));
      this.importResult = result;
      return result;
    },
    async onImportConfirm(result) {
      const selected = result.items.filter((i) => i.include);
      const fresh = selected.filter((i) => !this.findItem(i.symbol));
      const plan = this.plan;
      const before = plan.items.map((i) => ({ ...i }));
      selected.forEach((row) => {
        const item = this.findItem(row.symbol);
        if (item) {
          item.holdqty = row.holdqty;
          item.avgprice = row.avgprice;
          if (!item.price && row.price) {
            item.price = row.price;
          }
          if (!item.lasttradedprice && row.lasttradedprice) {
            item.lasttradedprice = row.lasttradedprice;
          }
          return;
        }
        plan.items.push(
          newPlanItem({
            symbol: row.symbol,
            price: row.price || 0,
            lasttradedprice: row.lasttradedprice || 0,
            holdqty: row.holdqty,
            avgprice: row.avgprice,
          })
        );
      });
      this.cancelQueuedSave();
      if (!(await this.persist())) {
        plan.items = before;
        throw new Error(this.message || "Could not save the plan.");
      }
      const updated = selected.length - fresh.length;
      this.setMessage(
        `Imported ${selected.length} ${selected.length === 1 ? "stock" : "stocks"}: ${fresh.length} new, ${updated} updated.`
      );
    },
    onImportClose() {
      this.importOpen = false;
      this.importResult = null;
    },
  },
};
</script>

<style scoped>
.workspace-main {
  margin-left: 0;
}
.workspace-menu-btn {
  align-items: center;
  gap: 0.35rem;
  width: auto;
  min-width: auto;
  height: 2rem;
  min-height: 2rem;
  padding: 0 0.65rem;
}
.workspace-menu-label {
  font-size: 0.8125rem;
  line-height: 1;
}
.plan-empty-state {
  padding: 1.25rem 1rem;
}
.plan-empty-copy {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.4;
  color: #6b7280;
}
:global(.dark) .plan-empty-copy {
  color: #9ca3af;
}
.plan-message {
  margin-bottom: 0;
}
@media (min-width: 1024px) {
  .workspace-main {
    margin-left: 13rem;
  }
}
</style>
