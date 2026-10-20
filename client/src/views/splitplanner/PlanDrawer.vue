<template>
  <div>
    <div
      v-if="open"
      class="workspace-backdrop fixed inset-0 z-30 bg-black bg-opacity-40 lg:hidden"
      @click="$emit('close')"
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
      :class="{ 'is-open': open }"
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
          v-for="item in filteredPlans"
          :key="item._id"
        >
          <div
            class="leading-10 rounded-sm cursor-pointer"
            role="button"
            tabindex="0"
            :class="{ 'border-l-2 border-yellow-500': item._id == selectedId }"
            @click="$emit('select', item)"
            @keydown.enter="$emit('select', item)"
          >
            <div class="p-2">
              <div class="truncate" :class="{ 'font-black': item._id == selectedId }">
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
        <p v-if="!filteredPlans.length" class="px-3 text-xs text-gray-500">
          {{ plans.length ? "No plans match your search." : "No plans yet. Use + to create one." }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlanDrawer",
  props: {
    open: { type: Boolean, default: false },
    plans: { type: Array, default: () => [] },
    selectedId: { type: String, default: null },
    create: { type: Function, required: true },
  },
  emits: ["close", "select"],
  data() {
    return {
      planSearch: "",
      showNewPlan: false,
      newPlanName: "",
    };
  },
  computed: {
    filteredPlans() {
      const q = this.planSearch.trim().toLowerCase();
      return q
        ? this.plans.filter((p) => String(p.name || "").toLowerCase().includes(q))
        : this.plans;
    },
  },
  methods: {
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
      if (await this.create(name)) {
        this.showNewPlan = false;
        this.newPlanName = "";
      }
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
@media (min-width: 1024px) {
  .plan-drawer {
    transform: translateX(0);
    width: 13rem;
    max-width: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .plan-drawer {
    transition: none;
  }
}
</style>
