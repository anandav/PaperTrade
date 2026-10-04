<template>
  <div class="workspace flex min-h-screen bg-gray-100 dark:bg-gray-900">
    <div
      v-if="menuOpen"
      class="workspace-backdrop fixed inset-0 z-30 bg-black bg-opacity-40 lg:hidden"
      @click="menuOpen = false"
    />
    <div
      class="
        plan-drawer
        border-r border-gray-300
        dark:border-gray-800
        flex flex-col
        bg-gray-100
        dark:bg-gray-900
        h-full
      "
      :class="{ 'is-open': menuOpen }"
      role="navigation"
      aria-label="Split plans"
    >
      <div class="flex items-center gap-2 mt-4 px-2">
        <input
          class="
            px-2
            py-2
            flex-1
            min-w-0
            bg-gray-100
            dark:bg-gray-600
            focus:outline-none
            focus:ring-2 focus:ring-gray-400
            rounded
            text-sm
          "
          placeholder="Search plans"
          aria-label="Search plans"
          v-model="planSearch"
        />
        <button
          class="btn tooltip shrink-0"
          type="button"
          aria-label="New plan"
          @click="onToggleNewPlan()"
        >
          <i class="material-icons" aria-hidden="true">{{
            showNewPlan ? "close" : "add"
          }}</i>
          <tooltip Value="New plan" />
        </button>
      </div>
      <div class="px-2 mt-2" v-if="showNewPlan">
        <input
          ref="newPlanInput"
          class="
            px-2
            py-2
            w-full
            bg-gray-100
            dark:bg-gray-600
            focus:outline-none
            focus:ring-2 focus:ring-gray-400
            rounded
            text-sm
          "
          placeholder="New plan"
          aria-label="New plan name"
          v-model="newPlanName"
          @keyup.enter="onAddNewPlan()"
          @keyup.esc="onToggleNewPlan(false)"
        />
      </div>
      <div class="flex-1 overflow-y-auto mt-4 pb-10">
        <div
          class="border-b border-gray-200 dark:border-gray-800"
          v-for="item in FilteredPlans"
          :key="item._id"
        >
          <div
            class="leading-10 rounded-sm cursor-pointer"
            role="button"
            tabindex="0"
            :class="{ 'border-l-2 border-yellow-500': plan && item._id == plan._id }"
            @click="onSelectPlan(item)"
            @keydown.enter="onSelectPlan(item)"
          >
            <div class="p-2">
              <div
                class="truncate"
                :class="{ 'font-black': plan && item._id == plan._id }"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
        <p v-if="!FilteredPlans.length" class="px-3 text-xs text-gray-500">
          {{ Plans.length ? "No plans match your search." : "No plans yet. Use + to create one." }}
        </p>
      </div>
    </div>

    <div class="workspace-main flex-1 pt-16 pb-16 min-w-0">
      <div
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
          <div
            class="
              plan-header
              border-b-2
              px-3
              sm:pl-5
              sm:pr-5
              pb-4
              border-gray-300
              dark:border-gray-800
            "
            :class="{ isPlanEdit: editHeader }"
          >
            <div class="plan-meta">
              <div class="plan-field">
                <label class="text-xs block text-gray-500" for="sp-name">Plan</label>
                <span class="view">{{ plan.name }}</span>
                <input
                  class="normal-edit edit"
                  id="sp-name"
                  placeholder="Plan name"
                  maxlength="80"
                  v-model="plan.name"
                  @keyup.enter="onSaveHeader()"
                />
              </div>
              <div class="plan-field">
                <label class="text-xs block text-gray-500" for="sp-amount">
                  Amount
                </label>
                <span class="view">{{ $filters.decimal2(plan.amount) }}</span>
                <input
                  class="normal-edit edit"
                  id="sp-amount"
                  type="number"
                  min="0"
                  placeholder="Amount"
                  v-model.number="plan.amount"
                  @keyup.enter="onSaveHeader()"
                />
              </div>
              <div class="plan-field">
                <span class="text-xs block text-gray-500" id="sp-target-label">
                  Target per Stock
                </span>
                <span aria-labelledby="sp-target-label">
                  {{ $filters.decimal2(result.target) }}
                </span>
              </div>
              <div class="plan-field">
                <span class="text-xs block text-gray-500" id="sp-spent-label">
                  Total to Spend
                </span>
                <span aria-labelledby="sp-spent-label">
                  {{ $filters.decimal2(result.spent) }}
                </span>
              </div>
              <div class="plan-field">
                <span class="text-xs block text-gray-500" id="sp-left-label">
                  Cash Left Over
                </span>
                <span aria-labelledby="sp-left-label">
                  {{ $filters.decimal2(result.leftover) }}
                </span>
              </div>
              <div class="plan-field">
                <span class="text-xs block text-gray-500" id="sp-zero-label">
                  Too Expensive
                </span>
                <span
                  :class="{ 'text-red-700 dark:text-red-400': result.zeroCount > 0 }"
                  aria-labelledby="sp-zero-label"
                >
                  {{ result.zeroCount }}
                  {{ result.zeroCount === 1 ? "stock" : "stocks" }}
                </span>
              </div>
            </div>

            <div class="plan-actions">
              <button
                class="btn tooltip view"
                type="button"
                aria-label="Edit plan"
                @click="onEditHeader()"
              >
                <i class="material-icons" aria-hidden="true">edit</i>
                <tooltip Value="Edit plan" />
              </button>
              <button
                class="btn edit tooltip"
                type="button"
                aria-label="Save plan"
                @click="onSaveHeader()"
              >
                <i class="material-icons" aria-hidden="true">save</i>
                <tooltip Value="Save plan" />
              </button>
              <button
                class="btn ml-1 tooltip text-red-700 dark:text-red-700 view"
                type="button"
                aria-label="Remove plan"
                @click.stop="onDeletePlan()"
              >
                <i class="material-icons" aria-hidden="true">delete_forever</i>
                <tooltip Value="Remove plan" Location="above end" />
              </button>
            </div>
          </div>

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
            <div class="p-3 border-b border-gray-300 dark:border-gray-700">
              <div class="strategy-header">
                <div class="strategy-meta">
                  <div class="strategy-field add-field">
                    <label class="text-xs block text-gray-500" for="sp-symbols">
                      Add Stocks
                    </label>
                    <input
                      class="normal-edit add-input"
                      id="sp-symbols"
                      placeholder="INFY, ITC or paste a list"
                      autocomplete="off"
                      v-model="symbolInput"
                      @paste="onPasteSymbols"
                      @keydown.enter.prevent="onAddSymbols()"
                    />
                  </div>
                  <div class="strategy-field">
                    <span class="text-xs block text-gray-500" id="sp-leftover-label">
                      Rounding
                    </span>
                    <label class="leftover-toggle tooltip">
                      <input
                        type="checkbox"
                        class="mini-checkbox"
                        aria-describedby="sp-leftover-label"
                        v-model="plan.useleftover"
                        @change="queueSave()"
                      />
                      <span>Use leftover cash</span>
                      <tooltip
                        Value="Buy 1 more share where leftover cash covers it"
                        Location="bottom start"
                      />
                    </label>
                  </div>
                  <div class="strategy-field">
                    <span class="text-xs block text-gray-500" id="sp-count-label">
                      Stocks
                    </span>
                    <span aria-labelledby="sp-count-label">
                      {{ result.activeCount }} of {{ plan.items.length }}
                    </span>
                  </div>
                  <div class="strategy-field">
                    <span class="text-xs block text-gray-500" id="sp-shares-label">
                      Total Shares
                    </span>
                    <span aria-labelledby="sp-shares-label">
                      {{ result.totalShares }}
                    </span>
                  </div>
                </div>
                <div class="strategy-actions">
                  <button
                    class="btn dark:text-orange-400 tooltip"
                    type="button"
                    aria-label="Add stocks"
                    @click="onAddSymbols()"
                  >
                    <i class="material-icons" aria-hidden="true">playlist_add</i>
                    <tooltip Value="Add stocks" Location="above end" />
                  </button>
                  <dropdown
                    class="text-red-600 inline-block tooltip"
                    Tooltip="Refresh prices (LTP)"
                    TooltipLocation="above end"
                    :Icon="`currency_rupee`"
                    :Items="LTPAction"
                    :Type="`Menu`"
                    :MinItem="2"
                    @itemclicked="onLTPAction"
                  >
                  </dropdown>
                </div>
              </div>
            </div>

            <div class="p-2 sm:p-3">
              <div class="trade-empty" v-if="!plan.items.length">
                <p class="trade-empty-copy">
                  No stocks yet. Add NSE symbols above, then refresh prices.
                </p>
              </div>

              <div class="trade-scroll" v-else>
                <div class="table trade-table w-full shadow border-collapse rounded-lg">
                  <div class="table-row-group">
                    <div class="table-row text-xs text-right text-gray-900 dark:text-white">
                      <div class="table-cell px-1 py-3 w-12">
                        <label class="block">
                          <input
                            type="checkbox"
                            class="mini-checkbox"
                            aria-label="Include all stocks"
                            :checked="allIncluded"
                            @change="onToggleAll($event.target.checked)"
                          />
                        </label>
                      </div>
                      <div class="table-cell px-1 py-4 text-left">Symbol</div>
                      <div class="table-cell px-1 py-4">Price</div>
                      <div class="table-cell px-1 py-4">LTP</div>
                      <div class="table-cell px-1 py-4">Shares</div>
                      <div class="table-cell px-1 py-4">Cost</div>
                      <div class="table-cell px-1 py-4">vs Target</div>
                      <div class="table-cell px-1 trade-actions-col"></div>
                    </div>
                  </div>
                  <div class="table-row-group">
                    <div
                      class="table-row text-right border-t border-gray-300 dark:border-gray-600"
                      v-for="row in result.rows"
                      :key="row.symbol"
                      :class="{
                        isTradeEdit: editSymbol === row.symbol,
                        'row-excluded': !row.included,
                      }"
                    >
                      <div class="table-cell px-1 py-2 trade-select-cell">
                        <label class="trade-check-label">
                          <input
                            type="checkbox"
                            class="mini-checkbox"
                            :aria-label="'Include ' + row.symbol"
                            :checked="row.included"
                            @change="onToggleItem(row.symbol, $event.target.checked)"
                          />
                        </label>
                      </div>
                      <div class="table-cell px-1 py-2 text-left">
                        <span class="view">{{ row.symbol }}</span>
                        <input
                          :ref="'sym-' + row.symbol"
                          v-model="editName"
                          type="text"
                          maxlength="20"
                          autocomplete="off"
                          :aria-label="'Symbol for ' + row.symbol"
                          class="trade-edit-input trade-edit-symbol edit"
                          @keydown.enter="onSaveRow(row.symbol)"
                          @keydown.esc="editSymbol = null"
                        />
                        <span v-if="row.error" class="block text-xs text-red-700 dark:text-red-400">
                          {{ row.error }}
                        </span>
                      </div>
                      <div class="table-cell px-1 py-2">
                        <span class="view">
                          {{ row.price ? $filters.decimal2(row.price) : "-" }}
                        </span>
                        <input
                          :ref="'price-' + row.symbol"
                          v-model.number="editPrice"
                          type="number"
                          min="0"
                          step="0.05"
                          :aria-label="'Price for ' + row.symbol"
                          class="trade-edit-input trade-edit-price edit text-right"
                          @keydown.enter="onSaveRow(row.symbol)"
                          @keydown.esc="editSymbol = null"
                        />
                      </div>
                      <div class="table-cell px-1 py-2">
                        <div v-if="row.loading" class="ltp-cell">...</div>
                        <div v-else-if="row.lasttradedprice > 0" class="ltp-cell">
                          <button
                            class="tooltip"
                            type="button"
                            :aria-label="'Use last price as price for ' + row.symbol"
                            @click="onUseLtp(row.symbol)"
                          >
                            <i class="font13px material-icons" aria-hidden="true">west</i>
                            <tooltip Value="Use last price as price" Location="above end" />
                          </button>
                          <span>{{ $filters.decimal2(row.lasttradedprice) }}</span>
                        </div>
                      </div>
                      <div class="table-cell px-1 py-2">
                        {{ row.counted ? row.qty : "-" }}
                      </div>
                      <div class="table-cell px-1 py-2">
                        {{ row.counted ? $filters.decimal2(row.cost) : "-" }}
                      </div>
                      <div class="table-cell px-1 py-2">
                        {{ row.counted ? $filters.decimal2(row.diff) : "-" }}
                      </div>
                      <div class="table-cell px-1">
                        <div class="trade-actions">
                          <button
                            class="btn tooltip view"
                            type="button"
                            :aria-label="'Edit price for ' + row.symbol"
                            @click="onEditRow(row)"
                          >
                            <i class="material-icons" aria-hidden="true">edit</i>
                            <tooltip Value="Edit price" Location="above end" />
                          </button>
                          <button
                            class="btn tooltip edit"
                            type="button"
                            :aria-label="'Save price for ' + row.symbol"
                            @click="onSaveRow(row.symbol)"
                          >
                            <i class="material-icons" aria-hidden="true">save</i>
                            <tooltip Value="Save price" Location="above end" />
                          </button>
                          <button
                            class="btn tooltip view"
                            type="button"
                            :aria-label="'Refresh last price for ' + row.symbol"
                            :disabled="row.loading"
                            @click="onRefreshOne(row.symbol)"
                          >
                            <i class="material-icons" aria-hidden="true">get_app</i>
                            <tooltip Value="Refresh last price" Location="above end" />
                          </button>
                          <button
                            class="btn tooltip text-red-600 dark:text-red-700"
                            type="button"
                            :aria-label="'Remove ' + row.symbol"
                            @click="onRemoveItem(row.symbol)"
                          >
                            <i class="material-icons" aria-hidden="true">delete_forever</i>
                            <tooltip Value="Remove stock" Location="above end" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="table-row-group">
                    <div class="table-row text-right border-t border-yellow-500">
                      <div class="table-cell"></div>
                      <div class="table-cell"></div>
                      <div class="table-cell"></div>
                      <div class="table-cell"></div>
                      <div class="table-cell px-1 py-2">{{ result.totalShares }}</div>
                      <div class="table-cell px-1 py-2 trade-pnl-cell">
                        <span class="trade-pnl-label">Total</span>
                        <span>{{ $filters.decimal2(result.spent) }}</span>
                      </div>
                      <div class="table-cell px-1 py-2 trade-pnl-cell">
                        <span class="trade-pnl-label">Left</span>
                        <span>{{ $filters.decimal2(result.leftover) }}</span>
                      </div>
                      <div class="table-cell trade-actions-col"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  SYMBOL_PATTERN,
  computeSplit,
  normalizeSymbol,
  parseSymbolList,
} from "../common/splitPlan";
import { confirmDelete } from "../shared/confirmDialog";

const QUOTE_CHUNK = 50;
const SAVE_DELAY = 600;

function toEditable(saved) {
  return {
    _id: saved._id,
    name: saved.name,
    amount: saved.amount,
    useleftover: saved.useleftover !== false,
    items: (saved.items || []).map((item) => ({
      symbol: item.symbol,
      price: item.price || 0,
      lasttradedprice: item.lasttradedprice || 0,
      included: item.included !== false,
      error: "",
      loading: false,
    })),
  };
}

export default {
  name: "SplitPlanner",
  data() {
    return {
      menuOpen: false,
      planSearch: "",
      showNewPlan: false,
      newPlanName: "",
      plan: null,
      editHeader: false,
      editSymbol: null,
      editPrice: 0,
      editName: "",
      symbolInput: "",
      message: "",
      messageIsError: false,
      saveTimer: null,
      saving: false,
      saveAgain: false,
      LTPAction: [
        { _id: "refresh", name: "Refresh last prices", icon: "get_app" },
        { _id: "copy", name: "Use last prices as price", icon: "west" },
      ],
    };
  },
  computed: {
    ...mapGetters("splitPlanModule", ["Plans"]),
    FilteredPlans() {
      const q = this.planSearch.trim().toLowerCase();
      return q
        ? this.Plans.filter((p) => String(p.name || "").toLowerCase().includes(q))
        : this.Plans;
    },
    result() {
      if (!this.plan) {
        return computeSplit(0, [], false);
      }
      return computeSplit(this.plan.amount, this.plan.items, this.plan.useleftover);
    },
    allIncluded() {
      return !!this.plan && this.plan.items.length > 0 && this.plan.items.every((i) => i.included);
    },
  },
  async mounted() {
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
        items: this.plan.items.map((i) => ({
          symbol: i.symbol,
          price: i.price,
          lasttradedprice: i.lasttradedprice,
          included: i.included,
        })),
      };
    },
    queueSave() {
      if (!this.plan || !this.plan._id) {
        return;
      }
      if (this.saveTimer) {
        clearTimeout(this.saveTimer);
      }
      this.saveTimer = setTimeout(() => {
        this.saveTimer = null;
        this.persist();
      }, SAVE_DELAY);
    },
    async persist() {
      if (!this.plan || !this.plan._id) {
        return;
      }
      if (this.saving) {
        this.saveAgain = true;
        return;
      }
      this.saving = true;
      try {
        await this.$store.dispatch("splitPlanModule/SavePlan", this.payload());
      } catch (err) {
        this.showError(err, "Could not save the plan.");
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
        clearTimeout(this.saveTimer);
        this.saveTimer = null;
        this.persist();
      }
    },
    onToggleNewPlan(force) {
      this.showNewPlan = typeof force === "boolean" ? force : !this.showNewPlan;
      this.newPlanName = "";
      if (this.showNewPlan) {
        this.$nextTick(() => this.$refs.newPlanInput && this.$refs.newPlanInput.focus());
      }
    },
    async onAddNewPlan() {
      const name = this.newPlanName.trim();
      if (!name) {
        return;
      }
      this.flushSave();
      try {
        const saved = await this.$store.dispatch("splitPlanModule/SavePlan", {
          name,
          amount: 100000,
          useleftover: true,
          items: [],
        });
        this.plan = toEditable(saved);
        this.editHeader = false;
        this.editSymbol = null;
        this.showNewPlan = false;
        this.newPlanName = "";
        this.menuOpen = false;
        this.setMessage("");
      } catch (err) {
        this.showError(err, "Could not create the plan.");
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
      this.editSymbol = null;
      this.setMessage("");
    },
    onEditHeader() {
      this.editHeader = true;
    },
    async onSaveHeader() {
      const amount = Number(this.plan.amount);
      if (!Number.isFinite(amount) || amount < 0) {
        this.setMessage("Enter an amount of zero or more.", true);
        return;
      }
      this.editHeader = false;
      if (this.saveTimer) {
        clearTimeout(this.saveTimer);
        this.saveTimer = null;
      }
      await this.persist();
    },
    async onDeletePlan() {
      const ok = await confirmDelete(`Remove the plan "${this.plan.name}"?`, "Remove plan");
      if (!ok) {
        return;
      }
      if (this.saveTimer) {
        clearTimeout(this.saveTimer);
        this.saveTimer = null;
      }
      try {
        await this.$store.dispatch("splitPlanModule/DeletePlan", this.plan);
        this.plan = this.Plans.length ? toEditable(this.Plans[0]) : null;
        this.editHeader = false;
        this.editSymbol = null;
        this.setMessage("");
      } catch (err) {
        this.showError(err, "Could not remove the plan.");
      }
    },
    onPasteSymbols(event) {
      const text = event.clipboardData && event.clipboardData.getData("text");
      if (!text || !/[\r\n]/.test(text)) {
        return;
      }
      event.preventDefault();
      const joined = text
        .split(/[\r\n]+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .join(", ");
      const current = this.symbolInput.trim();
      this.symbolInput = current ? `${current}, ${joined}` : joined;
    },
    onAddSymbols() {
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
        this.plan.items.push({
          symbol,
          price: 0,
          lasttradedprice: 0,
          included: true,
          error: "",
          loading: false,
        });
      });
      this.symbolInput = "";
      this.queueSave();
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
    onLTPAction(type, id) {
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
    onUseLtp(symbol) {
      const item = this.findItem(symbol);
      if (item && item.lasttradedprice > 0) {
        item.price = item.lasttradedprice;
        this.queueSave();
      }
    },
    onEditRow(row) {
      this.editSymbol = row.symbol;
      this.editName = row.symbol;
      this.editPrice = row.price || null;
      this.$nextTick(() => {
        const el = this.$refs["sym-" + row.symbol];
        const input = Array.isArray(el) ? el[0] : el;
        if (input) {
          input.focus();
          input.select();
        }
      });
    },
    onSaveRow(symbol) {
      const item = this.findItem(symbol);
      if (!item) {
        this.editSymbol = null;
        return;
      }
      const newSymbol = normalizeSymbol(this.editName);
      if (!SYMBOL_PATTERN.test(newSymbol)) {
        this.setMessage(`"${this.editName}" is not a valid NSE symbol.`, true);
        return;
      }
      if (newSymbol !== symbol && this.findItem(newSymbol)) {
        this.setMessage(`${newSymbol} is already in the plan.`, true);
        return;
      }
      const n = Number(this.editPrice);
      const newPrice = Number.isFinite(n) && n > 0 ? n : 0;
      if (newSymbol !== symbol) {
        item.symbol = newSymbol;
        item.lasttradedprice = 0;
        item.price = newPrice !== item.price ? newPrice : 0;
      } else {
        item.price = newPrice;
      }
      item.error = "";
      this.setMessage("");
      this.queueSave();
      this.editSymbol = null;
    },
    onToggleItem(symbol, checked) {
      const item = this.findItem(symbol);
      if (item) {
        item.included = checked;
        this.queueSave();
      }
    },
    onToggleAll(checked) {
      this.plan.items.forEach((i) => {
        i.included = checked;
      });
      this.queueSave();
    },
    onRemoveItem(symbol) {
      this.plan.items = this.plan.items.filter((i) => i.symbol !== symbol);
      if (this.editSymbol === symbol) {
        this.editSymbol = null;
      }
      this.queueSave();
    },
  },
};
</script>

<style scoped>
.plan-drawer {
  position: fixed;
  top: 4rem;
  bottom: 2.5rem;
  left: 0;
  z-index: 40;
  width: 16rem;
  max-width: 85vw;
  transform: translateX(-100%);
  transition: transform 0.2s ease-out;
}
.plan-drawer.is-open {
  transform: translateX(0);
}
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

.edit {
  display: none;
}
.isPlanEdit .edit {
  display: inline-flex;
}
.isPlanEdit .view {
  display: none;
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
.plan-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.plan-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem 1rem;
}
.plan-field {
  min-width: 0;
}
.plan-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
}
.plan-message {
  margin-bottom: 0;
}

.strategy-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.strategy-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem 1rem;
}
.strategy-field {
  min-width: 0;
}
.add-field {
  grid-column: 1 / -1;
}
.add-input {
  width: 100%;
  max-width: 24rem;
}
.leftover-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 1.75rem;
  cursor: pointer;
}
.strategy-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
}
.strategy-actions .btn,
.strategy-actions .dropdown {
  vertical-align: middle;
}
.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.isTradeEdit .edit {
  display: inline-block;
}
.isTradeEdit .view {
  display: none !important;
}
.isTradeEdit .trade-actions .edit {
  display: inline-flex;
}
.row-excluded .table-cell:not(:first-child) {
  opacity: 0.5;
}

.trade-empty {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.5rem;
  width: 100%;
}
.trade-empty-copy {
  margin: 0;
  flex: 1;
  min-width: 0;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.3;
  color: #6b7280;
}
:global(.dark) .trade-empty-copy {
  color: #9ca3af;
}
.trade-scroll {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  overflow-y: visible;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 0.25rem;
}
.trade-table {
  min-width: 720px;
}
.trade-actions {
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.2rem;
  position: relative;
  z-index: 1;
}
.trade-actions-col {
  min-width: 6.5rem;
  overflow: visible;
}
.trade-actions .tooltip {
  overflow: visible;
}
.trade-actions .btn {
  vertical-align: middle;
}
.trade-pnl-cell {
  white-space: nowrap;
  vertical-align: middle;
}
.trade-pnl-label {
  display: inline;
  margin-right: 0.4rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
}
:global(.dark) .trade-pnl-label {
  color: #9ca3af;
}
.trade-edit-input {
  box-sizing: border-box;
  width: 4.5rem;
  min-width: 4.5rem;
  height: 2rem;
  min-height: 2rem;
  padding: 0.2rem 0.4rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: transparent;
  color: inherit;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.2;
}
.trade-edit-symbol {
  width: 7.5rem;
  min-width: 7.5rem;
  text-transform: uppercase;
}
.trade-edit-price {
  width: 5.5rem;
  min-width: 5.5rem;
}
:global(.dark) .trade-edit-input {
  border-color: #4b5563;
  background-color: #1f2937;
}
.trade-edit-input:focus {
  outline: 2px solid #9ca3af;
  outline-offset: 1px;
}
.trade-select-cell {
  vertical-align: middle;
  white-space: nowrap;
  width: 1%;
  min-width: 2.5rem;
}
.trade-check-label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 1.75rem;
  margin: 0;
  line-height: 1;
}
.trade-check-label .mini-checkbox {
  margin: 0;
  vertical-align: middle;
}
.ltp-cell {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.1rem;
}
.ltp-cell button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 1.75rem;
  width: 1.75rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

@media (min-width: 768px) {
  .plan-meta {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .strategy-meta {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (min-width: 1024px) {
  .plan-drawer {
    transform: translateX(0);
    width: 13rem;
    max-width: none;
  }
  .workspace-main {
    margin-left: 13rem;
  }
  .plan-header {
    flex-direction: row;
    align-items: flex-start;
    gap: 0.5rem;
  }
  .plan-meta {
    flex: 1;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 0.5rem;
  }
  .plan-actions {
    flex-shrink: 0;
    margin-left: auto;
    padding-top: 0.25rem;
  }
  .strategy-header {
    flex-direction: row;
    align-items: flex-start;
  }
  .strategy-meta {
    flex: 1;
    grid-template-columns: minmax(0, 2fr) repeat(3, minmax(0, 1fr));
    gap: 0.5rem 0.75rem;
  }
  .add-field {
    grid-column: auto;
  }
  .strategy-actions {
    flex-shrink: 0;
    justify-content: flex-end;
  }
}
@media (prefers-reduced-motion: reduce) {
  .plan-drawer {
    transition: none;
  }
}
</style>
