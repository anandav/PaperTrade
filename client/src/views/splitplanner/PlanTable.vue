<template>
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
            <div class="table-cell px-1 py-4 text-left">
              <button
                type="button"
                class="sort-btn"
                :class="{ 'sort-active': sortKey === 'symbol' }"
                :aria-label="sortLabel(symbolColumn)"
                @click="onSort('symbol')"
              >
                Symbol
                <i
                  v-if="sortKey === 'symbol'"
                  class="material-icons sort-icon"
                  aria-hidden="true"
                >{{ sortDir === "asc" ? "arrow_upward" : "arrow_downward" }}</i>
              </button>
            </div>
            <div
              v-for="col in valueColumns"
              :key="col.key"
              class="table-cell px-1 py-2"
              :class="['grp-' + col.group, { 'grp-start': col.groupLabel }]"
            >
              <span v-if="col.groupLabel" class="grp-label">{{ col.groupLabel }}</span>
              <span v-else class="grp-label" aria-hidden="true">&nbsp;</span>
              <button
                type="button"
                class="sort-btn tooltip"
                :class="{ 'sort-active': sortKey === col.key }"
                :aria-label="sortLabel(col)"
                @click="onSort(col.key)"
              >
                <i
                  v-if="sortKey === col.key"
                  class="material-icons sort-icon"
                  aria-hidden="true"
                >{{ sortDir === "asc" ? "arrow_upward" : "arrow_downward" }}</i>
                {{ col.label }}
                <tooltip :Value="col.tip" Location="above end" />
              </button>
            </div>
            <div class="table-cell px-1 trade-actions-col"></div>
          </div>
        </div>
        <div class="table-row-group">
          <div
            class="table-row text-right border-t border-gray-300 dark:border-gray-600"
            v-for="row in sortedRows"
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
            <div class="table-cell px-1 py-2 grp-now grp-start">
              <div v-if="row.loading" class="ltp-cell">...</div>
              <div v-else-if="row.lasttradedprice > 0" class="ltp-cell">
                <span>{{ $filters.decimal2(row.lasttradedprice) }}</span>
                <button
                  class="tooltip"
                  type="button"
                  :aria-label="'Use LTP as buy price for ' + row.symbol"
                  @click="onUseLtp(row.symbol)"
                >
                  <i class="font13px material-icons" aria-hidden="true">east</i>
                  <tooltip Value="Use LTP as buy price" Location="above end" />
                </button>
              </div>
            </div>
            <div class="table-cell px-1 py-2 grp-now">
              <span class="view">{{ row.holdQty || "-" }}</span>
              <input
                v-model.number="editHold"
                type="number"
                min="0"
                step="1"
                :aria-label="'Shares held for ' + row.symbol"
                class="trade-edit-input edit text-right"
                @keydown.enter="onSaveRow(row.symbol)"
                @keydown.esc="editSymbol = null"
              />
            </div>
            <div class="table-cell px-1 py-2 grp-now">
              <span class="view">
                {{ row.holdAvg ? $filters.decimal2(row.holdAvg) : "-" }}
              </span>
              <input
                v-model.number="editAvg"
                type="number"
                min="0"
                step="0.05"
                :aria-label="'Average price for ' + row.symbol"
                class="trade-edit-input trade-edit-price edit text-right"
                @keydown.enter="onSaveRow(row.symbol)"
                @keydown.esc="editSymbol = null"
              />
            </div>
            <div class="table-cell px-1 py-2 grp-now">
              <span
                v-if="row.holdAvg && row.price > 0"
                class="tooltip"
                :class="{
                  'text-green-700 dark:text-green-400': row.pnlPercent > 0,
                  'text-red-700 dark:text-red-400': row.pnlPercent < 0,
                }"
              >
                {{ row.pnlPercent > 0 ? "+" : "" }}{{ $filters.decimal2(row.pnlPercent) }}%
                <tooltip
                  :Value="'P&L ' + $filters.decimal2(row.pnl)"
                  Location="above end"
                />
              </span>
              <span v-else>-</span>
            </div>
            <div class="table-cell px-1 py-2 grp-buy grp-start">
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
            <div class="table-cell px-1 py-2 grp-buy">
              {{ row.counted ? row.qty : "-" }}
            </div>
            <div class="table-cell px-1 py-2 grp-buy">
              {{ row.counted ? $filters.decimal2(row.cost) : "-" }}
            </div>
            <div class="table-cell px-1 py-2 grp-buy">
              {{ row.counted ? $filters.decimal2(row.diff) : "-" }}
            </div>
            <div class="table-cell px-1 py-2 grp-after grp-start">
              <span :class="afterClass(row.symbol, 'qty')">
                {{ row.finalQty || "-" }}
              </span>
            </div>
            <div class="table-cell px-1 py-2 grp-after">
              <span :class="afterClass(row.symbol, 'avg')">
                {{ row.finalAvg ? $filters.decimal2(row.finalAvg) : "-" }}
              </span>
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
                  <tooltip Value="Edit row" Location="above end" />
                </button>
                <button
                  class="btn tooltip edit"
                  type="button"
                  :aria-label="'Save price for ' + row.symbol"
                  @click="onSaveRow(row.symbol)"
                >
                  <i class="material-icons" aria-hidden="true">save</i>
                  <tooltip Value="Save row" Location="above end" />
                </button>
                <button
                  class="btn tooltip view"
                  type="button"
                  :aria-label="'Refresh last price for ' + row.symbol"
                  :disabled="row.loading"
                  @click="$emit('refresh', row.symbol)"
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
            <div class="table-cell grp-now grp-start"></div>
            <div class="table-cell grp-now"></div>
            <div class="table-cell px-1 py-2 trade-pnl-cell grp-now">
              <span class="trade-pnl-label">Invested</span>
              <span>{{ $filters.decimal2(result.invested) }}</span>
            </div>
            <div class="table-cell grp-now"></div>
            <div class="table-cell grp-buy grp-start"></div>
            <div class="table-cell px-1 py-2 grp-buy">{{ result.totalShares }}</div>
            <div class="table-cell px-1 py-2 trade-pnl-cell grp-buy">
              <span class="trade-pnl-label">Total</span>
              <span>{{ $filters.decimal2(result.spent) }}</span>
            </div>
            <div class="table-cell px-1 py-2 trade-pnl-cell grp-buy">
              <span class="trade-pnl-label">Left</span>
              <span>{{ $filters.decimal2(result.leftover) }}</span>
            </div>
            <div class="table-cell grp-after grp-start"></div>
            <div class="table-cell grp-after"></div>
            <div class="table-cell trade-actions-col"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SYMBOL_PATTERN, normalizeSymbol } from "../../common/splitPlan";

const SORT_STORAGE_KEY = "splitPlanSort";

const COLUMNS = [
  { key: "ltp", label: "LTP", group: "now", groupLabel: "Now", tip: "Last traded price on NSE", value: (r) => r.lasttradedprice || null },
  { key: "held", label: "Held", group: "now", tip: "Shares you already own", value: (r) => r.holdQty || null },
  { key: "avg", label: "Avg Price", group: "now", tip: "Your average buy price so far", value: (r) => r.holdAvg || null },
  { key: "pnl", label: "P&L %", group: "now", tip: "Profit or loss on shares held, at Buy Price", value: (r) => (r.holdAvg && r.price > 0 ? r.pnlPercent : null) },
  { key: "price", label: "Buy Price", group: "buy", groupLabel: "This buy", tip: "Price you plan to buy at. Starts as LTP, edit it for a limit price", value: (r) => r.price || null },
  { key: "qty", label: "Buy Qty", group: "buy", tip: "New shares to buy with this plan", value: (r) => (r.counted ? r.qty : null) },
  { key: "cost", label: "Buy Amount", group: "buy", tip: "Buy Qty x Buy Price", value: (r) => (r.counted ? r.cost : null) },
  { key: "diff", label: "vs Target", group: "buy", tip: "Buy Amount minus this stock share of the plan amount. Negative means under target because only whole shares can be bought", value: (r) => (r.counted ? r.diff : null) },
  { key: "finalQty", label: "Total Qty", group: "after", groupLabel: "After", tip: "Held + Buy Qty", value: (r) => r.finalQty || null },
  { key: "finalAvg", label: "New Avg", group: "after", tip: "Average price after this buy", value: (r) => r.finalAvg || null },
];

const SYMBOL_COLUMN = { key: "symbol", label: "Symbol", value: (r) => r.symbol };

function readSort() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(SORT_STORAGE_KEY) || "null");
    const known = saved && (saved.key === "symbol" || COLUMNS.some((c) => c.key === saved.key));
    if (known && (saved.dir === "asc" || saved.dir === "desc")) {
      return saved;
    }
  } catch (err) {
    return { key: null, dir: null };
  }
  return { key: null, dir: null };
}

function writeSort(key, dir) {
  try {
    if (key) {
      window.localStorage.setItem(SORT_STORAGE_KEY, JSON.stringify({ key, dir }));
    } else {
      window.localStorage.removeItem(SORT_STORAGE_KEY);
    }
  } catch (err) {
    return;
  }
}

export default {
  name: "PlanTable",
  props: {
    plan: { type: Object, required: true },
    result: { type: Object, required: true },
    afterChanges: { type: Object, default: () => ({}) },
  },
  emits: ["change", "message", "refresh", "remove"],
  data() {
    const sort = readSort();
    return {
      valueColumns: COLUMNS,
      symbolColumn: SYMBOL_COLUMN,
      sortKey: sort.key,
      sortDir: sort.dir,
      editSymbol: null,
      editName: "",
      editPrice: 0,
      editHold: null,
      editAvg: null,
    };
  },
  computed: {
    sortedRows() {
      const rows = this.result.rows;
      const column =
        this.sortKey === "symbol"
          ? SYMBOL_COLUMN
          : COLUMNS.find((c) => c.key === this.sortKey);
      if (!column) {
        return rows;
      }
      const sign = this.sortDir === "desc" ? -1 : 1;
      return [...rows].sort((a, b) => {
        const va = column.value(a);
        const vb = column.value(b);
        if (va === null || vb === null) {
          return va === vb ? 0 : va === null ? 1 : -1;
        }
        if (typeof va === "string") {
          return sign * va.localeCompare(vb);
        }
        return sign * (va - vb);
      });
    },
    allIncluded() {
      return this.plan.items.length > 0 && this.plan.items.every((i) => i.included);
    },
  },
  watch: {
    plan() {
      this.editSymbol = null;
    },
  },
  methods: {
    onSort(key) {
      if (this.sortKey !== key) {
        this.sortKey = key;
        this.sortDir = "asc";
      } else if (this.sortDir === "asc") {
        this.sortDir = "desc";
      } else {
        this.sortKey = null;
        this.sortDir = null;
      }
      writeSort(this.sortKey, this.sortDir);
    },
    sortLabel(col) {
      if (this.sortKey !== col.key) {
        return `Sort by ${col.label}`;
      }
      return this.sortDir === "asc"
        ? `Sorted by ${col.label} ascending. Sort descending`
        : `Sorted by ${col.label} descending. Clear sort`;
    },
    findItem(symbol) {
      return this.plan.items.find((i) => i.symbol === symbol);
    },
    afterClass(symbol, field) {
      const change = this.afterChanges[symbol];
      const delta = change ? change[field] : 0;
      if (!delta) {
        return "";
      }
      return delta > 0 ? "after-up" : "after-down";
    },
    onUseLtp(symbol) {
      const item = this.findItem(symbol);
      if (item && item.lasttradedprice > 0) {
        item.price = item.lasttradedprice;
        this.$emit("change");
      }
    },
    onEditRow(row) {
      this.editSymbol = row.symbol;
      this.editName = row.symbol;
      this.editPrice = row.price || null;
      this.editHold = row.holdQty || null;
      this.editAvg = row.holdAvg || null;
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
        this.$emit("message", `"${this.editName}" is not a valid NSE symbol.`, true);
        return;
      }
      if (newSymbol !== symbol && this.findItem(newSymbol)) {
        this.$emit("message", `${newSymbol} is already in the plan.`, true);
        return;
      }
      const n = Number(this.editPrice);
      const newPrice = Number.isFinite(n) && n > 0 ? n : 0;
      const hold = Number(this.editHold);
      const avg = Number(this.editAvg);
      if ((Number.isFinite(hold) && hold > 0) !== (Number.isFinite(avg) && avg > 0)) {
        this.$emit("message", "Enter both shares held and average price, or leave both empty.", true);
        return;
      }
      item.holdqty = hold > 0 ? Math.floor(hold) : 0;
      item.avgprice = item.holdqty ? avg : 0;
      if (newSymbol !== symbol) {
        item.symbol = newSymbol;
        item.lasttradedprice = 0;
        item.price = newPrice !== item.price ? newPrice : 0;
      } else {
        item.price = newPrice;
      }
      item.error = "";
      this.$emit("message", "");
      this.$emit("change");
      this.editSymbol = null;
    },
    onToggleItem(symbol, checked) {
      const item = this.findItem(symbol);
      if (item) {
        item.included = checked;
        this.$emit("change");
      }
    },
    onToggleAll(checked) {
      this.plan.items.forEach((i) => {
        i.included = checked;
      });
      this.$emit("change");
    },
    onRemoveItem(symbol) {
      if (this.editSymbol === symbol) {
        this.editSymbol = null;
      }
      this.$emit("remove", symbol);
    },
  },
};
</script>

<style scoped>
.edit {
  display: none;
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
.after-up {
  color: #15803d;
}
.after-down {
  color: #b91c1c;
}
:global(.dark) .after-up {
  color: #4ade80;
}
:global(.dark) .after-down {
  color: #f87171;
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
.sort-btn {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.15rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
  white-space: nowrap;
}
.sort-btn:hover,
.sort-active,
.sort-icon {
  color: #ca8a04;
}
:global(.dark) .sort-btn:hover,
:global(.dark) .sort-active,
:global(.dark) .sort-icon {
  color: #eab308;
}
.sort-btn:focus-visible {
  outline: 2px solid #9ca3af;
  outline-offset: 2px;
  border-radius: 0.125rem;
}
.sort-icon {
  font-size: 12px;
  line-height: 1;
}
.grp-label {
  display: block;
  margin-bottom: 0.15rem;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
}
.grp-now .grp-label {
  color: #2563eb;
}
.grp-buy .grp-label {
  color: #c2410c;
}
.grp-after .grp-label {
  color: #15803d;
}
.grp-now {
  background: rgba(37, 99, 235, 0.05);
}
.grp-buy {
  background: rgba(224, 122, 47, 0.08);
}
.grp-after {
  background: rgba(21, 128, 61, 0.06);
}
.grp-start {
  border-left: 2px solid rgba(107, 114, 128, 0.25);
}
:global(.dark) .grp-now .grp-label {
  color: #93c5fd;
}
:global(.dark) .grp-buy .grp-label {
  color: #fdba74;
}
:global(.dark) .grp-after .grp-label {
  color: #86efac;
}
:global(.dark) .grp-now {
  background: rgba(96, 165, 250, 0.07);
}
:global(.dark) .grp-buy {
  background: rgba(251, 146, 60, 0.09);
}
:global(.dark) .grp-after {
  background: rgba(74, 222, 128, 0.07);
}
.trade-table {
  min-width: 1120px;
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
</style>
