<template>
  <div
    class="plan-tools p-3 border-b border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
    :style="{ top: stickyTop + 'px' }"
  >
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
            :value="symbols"
            @input="$emit('update:symbols', $event.target.value)"
            @paste="onPasteSymbols"
            @keydown.enter.prevent="$emit('add')"
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
              @change="$emit('settings-change')"
            />
            <span>Use leftover cash</span>
            <tooltip
              Value="Buy 1 more share where leftover cash covers it"
              Location="bottom start"
            />
          </label>
        </div>
        <div class="strategy-field">
          <label class="text-xs block text-gray-500" for="sp-allocation">
            Allocation
          </label>
          <select
            class="normal-edit allocation-select"
            id="sp-allocation"
            v-model="plan.allocationmode"
            @change="$emit('settings-change')"
          >
            <option v-for="mode in AllocationModes" :key="mode.id" :value="mode.id">
              {{ mode.name }}
            </option>
          </select>
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
        <div class="strategy-field">
          <span class="text-xs block text-gray-500" id="sp-invested-label">
            Already Invested
          </span>
          <span aria-labelledby="sp-invested-label">
            {{ $filters.decimal2(result.invested) }}
            <span v-if="result.holdCount" class="text-xs text-gray-500">
              in {{ result.holdCount }}
              {{ result.holdCount === 1 ? "stock" : "stocks" }}
            </span>
          </span>
        </div>
      </div>
      <div class="strategy-actions">
        <button
          class="btn dark:text-orange-400 tooltip"
          type="button"
          aria-label="Add stocks"
          @click="$emit('add')"
        >
          <i class="material-icons" aria-hidden="true">playlist_add</i>
          <tooltip Value="Add stocks" Location="above end" />
        </button>
        <button
          v-if="importEnabled"
          class="btn dark:text-orange-400 tooltip"
          type="button"
          aria-label="Import holdings"
          @click="$emit('import')"
        >
          <i class="material-icons" aria-hidden="true">upload_file</i>
          <tooltip Value="Import holdings" Location="above end" />
        </button>
        <dropdown
          class="text-red-600 inline-block tooltip"
          Tooltip="Refresh prices (LTP)"
          TooltipLocation="above end"
          :Icon="`currency_rupee`"
          :Items="LTPAction"
          :Type="`Menu`"
          :MinItem="2"
          @itemclicked="(type, id) => $emit('ltp-action', id)"
        >
        </dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { ALLOCATION_MODES } from "../../common/splitPlan";

export default {
  name: "PlanTools",
  props: {
    plan: { type: Object, required: true },
    result: { type: Object, required: true },
    symbols: { type: String, default: "" },
    stickyTop: { type: Number, default: 0 },
    importEnabled: { type: Boolean, default: false },
  },
  emits: ["update:symbols", "add", "import", "ltp-action", "settings-change"],
  data() {
    return {
      AllocationModes: ALLOCATION_MODES,
      LTPAction: [
        { _id: "refresh", name: "Refresh last prices", icon: "get_app" },
        { _id: "copy", name: "Use last prices as buy price", icon: "east" },
      ],
    };
  },
  methods: {
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
      const current = this.symbols.trim();
      this.$emit("update:symbols", current ? `${current}, ${joined}` : joined);
    },
  },
};
</script>

<style scoped>
.plan-tools {
  position: sticky;
  z-index: 10;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  box-shadow: 0 6px 8px -6px rgba(0, 0, 0, 0.18);
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
.allocation-select {
  width: 100%;
  max-width: 12rem;
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
@media (min-width: 768px) {
  .strategy-meta {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (min-width: 1024px) {
  .strategy-header {
    flex-direction: row;
    align-items: flex-start;
  }
  .strategy-meta {
    flex: 1;
    grid-template-columns: minmax(0, 2fr) repeat(5, minmax(0, 1fr));
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
</style>
