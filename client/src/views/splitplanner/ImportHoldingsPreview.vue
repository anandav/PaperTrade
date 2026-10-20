<template>
  <div>
    <p v-if="!items.length" class="preview-empty text-xs text-gray-500">
      No equity holdings were found in this document.
    </p>

    <div v-else class="preview-scroll">
      <table class="preview-table w-full text-xs">
        <thead>
          <tr class="text-right text-gray-900 dark:text-white">
            <th class="px-1 py-3 w-8">
              <input
                type="checkbox"
                class="mini-checkbox"
                aria-label="Include all imported stocks"
                :checked="allIncluded"
                @change="onToggleAll($event.target.checked)"
              />
            </th>
            <th class="px-1 py-3 text-left">Symbol</th>
            <th class="px-1 py-3">Held</th>
            <th class="px-1 py-3">Avg Price</th>
            <th class="px-1 py-3">Invested</th>
            <th class="px-1 py-3">LTP</th>
            <th class="px-1 py-3">P&amp;L %</th>
            <th class="px-1 py-3 text-left">In plan</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in items"
            :key="row.symbol"
            class="text-right border-t border-gray-300 dark:border-gray-600"
            :class="{ 'row-excluded': !row.include }"
          >
            <td class="px-1 py-2">
              <input
                type="checkbox"
                class="mini-checkbox"
                :aria-label="'Import ' + row.symbol"
                v-model="row.include"
              />
            </td>
            <td class="px-1 py-2 text-left">{{ row.symbol }}</td>
            <td class="px-1 py-2">{{ row.holdqty }}</td>
            <td class="px-1 py-2">{{ $filters.decimal2(row.avgprice) }}</td>
            <td class="px-1 py-2">{{ $filters.decimal2(row.holdqty * row.avgprice) }}</td>
            <td class="px-1 py-2">
              {{ row.lasttradedprice ? $filters.decimal2(row.lasttradedprice) : "-" }}
            </td>
            <td class="px-1 py-2">
              <span v-if="pnlPercent(row) !== null" :class="pnlClass(row)">
                {{ pnlPercent(row) > 0 ? "+" : "" }}{{ $filters.decimal2(pnlPercent(row)) }}%
              </span>
              <span v-else>-</span>
            </td>
            <td class="px-1 py-2 text-left">
              <span
                class="preview-status"
                :class="isExisting(row.symbol) ? 'text-gray-500' : 'text-green-700 dark:text-green-400'"
              >
                <i class="material-icons" aria-hidden="true">
                  {{ isExisting(row.symbol) ? "sync" : "playlist_add" }}
                </i>
                {{ isExisting(row.symbol) ? "Update" : "New" }}
              </span>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="text-right border-t border-yellow-500">
            <td class="px-1 py-2"></td>
            <td class="px-1 py-2 text-left">
              <span class="preview-total-label">Selected</span>
            </td>
            <td class="px-1 py-2">{{ summary.shares }}</td>
            <td class="px-1 py-2"></td>
            <td class="px-1 py-2">{{ $filters.decimal2(summary.invested) }}</td>
            <td class="px-1 py-2"></td>
            <td class="px-1 py-2"></td>
            <td class="px-1 py-2"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script>
import { summarizeImport } from "../../common/splitPlan";

export default {
  name: "ImportHoldingsPreview",
  props: {
    items: { type: Array, required: true },
    existingSymbols: { type: Array, default: () => [] },
  },
  computed: {
    summary() {
      return summarizeImport(this.items, this.existingSymbols);
    },
    allIncluded() {
      return this.items.length > 0 && this.items.every((i) => i.include);
    },
  },
  methods: {
    isExisting(symbol) {
      return this.existingSymbols.includes(symbol);
    },
    pnlPercent(row) {
      if (!(row.avgprice > 0) || !(row.lasttradedprice > 0)) {
        return null;
      }
      return ((row.lasttradedprice - row.avgprice) / row.avgprice) * 100;
    },
    pnlClass(row) {
      const pnl = this.pnlPercent(row);
      return {
        "text-green-700 dark:text-green-400": pnl > 0,
        "text-red-700 dark:text-red-400": pnl < 0,
      };
    },
    onToggleAll(checked) {
      this.items.forEach((i) => {
        i.include = checked;
      });
    },
  },
};
</script>

<style scoped>
.preview-empty {
  margin: 0.75rem 0 0;
}
.preview-scroll {
  width: 100%;
  overflow-x: auto;
  margin-top: 0.5rem;
}
.preview-table {
  min-width: 36rem;
  border-collapse: collapse;
}
.preview-table th {
  font-weight: 500;
  white-space: nowrap;
}
.preview-table td {
  white-space: nowrap;
}
.row-excluded td:not(:first-child) {
  opacity: 0.5;
}
.preview-status {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
}
.preview-status i {
  font-size: 14px;
}
.preview-total-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
}
:global(.dark) .preview-total-label {
  color: #9ca3af;
}
</style>
