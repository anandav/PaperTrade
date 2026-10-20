<template>
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
    :class="{ isPlanEdit: editing }"
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
          @keyup.enter="$emit('save')"
        />
      </div>
      <div class="plan-field">
        <label class="text-xs block text-gray-500" for="sp-amount">
          Amount I'd like to invest
        </label>
        <input
          class="normal-edit amount-input"
          id="sp-amount"
          type="number"
          min="0"
          step="any"
          inputmode="decimal"
          placeholder="0"
          v-model.number="plan.amount"
          @input="$emit('amount-input')"
          @keyup.enter="$emit('amount-commit')"
          @blur="$emit('amount-commit')"
        />
      </div>
      <div class="plan-field">
        <span class="text-xs block text-gray-500" id="sp-target-label">
          Target per Stock
        </span>
        <span v-if="result.targetVaries" aria-labelledby="sp-target-label">
          Varies
          <span class="block text-xs text-gray-500">
            {{ $filters.decimal2(result.targetMin) }} -
            {{ $filters.decimal2(result.targetMax) }}
          </span>
        </span>
        <span v-else aria-labelledby="sp-target-label">
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
          :class="{ 'text-red-700 dark:text-red-400': result.zeroCount > 0 && plan.amount > 0 }"
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
        @click="$emit('edit')"
      >
        <i class="material-icons" aria-hidden="true">edit</i>
        <tooltip Value="Edit plan" />
      </button>
      <button
        class="btn edit tooltip"
        type="button"
        aria-label="Save plan"
        @click="$emit('save')"
      >
        <i class="material-icons" aria-hidden="true">save</i>
        <tooltip Value="Save plan" />
      </button>
      <button
        class="btn ml-1 tooltip text-red-700 dark:text-red-700 view"
        type="button"
        aria-label="Remove plan"
        @click.stop="$emit('delete')"
      >
        <i class="material-icons" aria-hidden="true">delete_forever</i>
        <tooltip Value="Remove plan" Location="above end" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlanHeader",
  props: {
    plan: { type: Object, required: true },
    result: { type: Object, required: true },
    editing: { type: Boolean, default: false },
  },
  emits: ["edit", "save", "delete", "amount-input", "amount-commit"],
};
</script>

<style scoped>
.edit {
  display: none;
}
.isPlanEdit .edit {
  display: inline-flex;
}
.isPlanEdit .view {
  display: none;
}
.amount-input {
  display: inline-flex;
  width: 9rem;
  text-align: right;
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
@media (min-width: 768px) {
  .plan-meta {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (min-width: 1024px) {
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
}
</style>
