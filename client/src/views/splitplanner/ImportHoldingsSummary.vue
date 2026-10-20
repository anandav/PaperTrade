<template>
  <div class="summary-fields">
    <div class="summary-field">
      <span class="text-xs block text-gray-500">Found</span>
      <span>{{ summary.found }} {{ summary.found === 1 ? "stock" : "stocks" }}</span>
    </div>
    <div class="summary-field">
      <span class="text-xs block text-gray-500">Selected</span>
      <span>{{ summary.selected }}</span>
    </div>
    <div class="summary-field">
      <span class="text-xs block text-gray-500">New</span>
      <span class="text-green-700 dark:text-green-400">{{ summary.newCount }}</span>
    </div>
    <div class="summary-field">
      <span class="text-xs block text-gray-500">Updates</span>
      <span>{{ summary.selected - summary.newCount }}</span>
    </div>
    <div class="summary-field">
      <span class="text-xs block text-gray-500">Invested</span>
      <span>{{ $filters.decimal2(summary.invested) }}</span>
    </div>
  </div>
</template>

<script>
import { summarizeImport } from "../../common/splitPlan";

export default {
  name: "ImportHoldingsSummary",
  props: {
    items: { type: Array, required: true },
    existingSymbols: { type: Array, default: () => [] },
  },
  computed: {
    summary() {
      return summarizeImport(this.items, this.existingSymbols);
    },
  },
};
</script>

<style scoped>
.summary-fields {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem 1rem;
}
.summary-field {
  min-width: 0;
}
@media (min-width: 640px) {
  .summary-fields {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}
</style>
