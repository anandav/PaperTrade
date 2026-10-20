<template>
  <div>
    <p v-if="!items.length" class="import-empty">
      No equity holdings were found in this document.
    </p>
    <div v-else class="import-scroll">
      <table class="import-table w-full text-xs">
        <thead>
          <tr class="text-right text-gray-500">
            <th class="px-1 py-2 w-8">
              <input
                type="checkbox"
                class="mini-checkbox"
                aria-label="Include all imported stocks"
                :checked="allIncluded"
                @change="onToggleAll($event.target.checked)"
              />
            </th>
            <th class="px-1 py-2 text-left">Symbol</th>
            <th class="px-1 py-2">Held</th>
            <th class="px-1 py-2">Avg Price</th>
            <th class="px-1 py-2">LTP</th>
            <th class="px-1 py-2 text-left">In plan</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in items"
            :key="row.symbol"
            class="text-right border-t border-gray-300 dark:border-gray-700"
          >
            <td class="px-1 py-2">
              <input
                type="checkbox"
                class="mini-checkbox"
                :aria-label="'Import ' + row.symbol"
                v-model="row.include"
              />
            </td>
            <td class="px-1 py-2 text-left font-semibold">{{ row.symbol }}</td>
            <td class="px-1 py-2">{{ row.holdqty }}</td>
            <td class="px-1 py-2">{{ $filters.decimal2(row.avgprice) }}</td>
            <td class="px-1 py-2">
              {{ row.lasttradedprice ? $filters.decimal2(row.lasttradedprice) : "-" }}
            </td>
            <td class="px-1 py-2 text-left">
              <span
                class="import-badge"
                :class="isExisting(row.symbol) ? 'import-badge-update' : 'import-badge-new'"
              >
                {{ isExisting(row.symbol) ? "Updates existing" : "New" }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImportHoldingsPreview",
  props: {
    items: { type: Array, required: true },
    existingSymbols: { type: Array, default: () => [] },
  },
  computed: {
    allIncluded() {
      return this.items.every((i) => i.include);
    },
  },
  methods: {
    isExisting(symbol) {
      return this.existingSymbols.includes(symbol);
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
.import-empty {
  margin: 0.5rem 0;
  color: #6b7280;
}
.import-scroll {
  width: 100%;
  overflow-x: auto;
}
.import-table th {
  font-weight: 500;
}
.import-badge {
  display: inline-block;
  padding: 0.05rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.6875rem;
  font-weight: 600;
  white-space: nowrap;
}
.import-badge-new {
  background: #dcfce7;
  color: #166534;
}
.import-badge-update {
  background: #e5e7eb;
  color: #374151;
}
:global(.dark) .import-badge-new {
  background: #14532d;
  color: #bbf7d0;
}
:global(.dark) .import-badge-update {
  background: #374151;
  color: #e5e7eb;
}
</style>
