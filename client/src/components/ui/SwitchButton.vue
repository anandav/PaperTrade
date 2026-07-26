<template>
  <button
    class="switch-btn relative focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
    :class="{ edit: !!PropTrade }"
    type="button"
    role="switch"
    :aria-checked="IsTrue ? 'true' : 'false'"
    :aria-label="resolvedLabel"
    @click="onRadioChange()"
    @keydown.space.prevent="onRadioChange()"
  >
    <div
      class="
        w-10
        h-4
        transition
        rounded-full
        outline-none
        dark:bg-primary-darker
      "
      :class="BgColor"
      aria-hidden="true"
    ></div>
    <div
      class="
        absolute
        top-0
        left-0
        inline-flex
        items-center
        justify-center
        w-4
        h-4
        transition-all
        duration-200
        ease-in-out
        transform
        scale-110
        rounded-full
        shadow
      "
      :class="FgColor"
      aria-hidden="true"
    ></div>
  </button>
</template>

<script>
export default {
  name: "SwitchButton",
  created() {
    this.syncFromProps();
  },
  watch: {
    Value(val) {
      if (!this.PropTrade) {
        this.IsTrue = !!val;
      }
    },
    PropTrade: {
      deep: true,
      handler(trade) {
        if (trade) {
          this.IsTrue = trade.buyorsell == "Buy";
        }
      },
    },
  },
  computed: {
    resolvedLabel: function () {
      if (this.AriaLabel) {
        return this.AriaLabel;
      }
      if (this.PropTrade) {
        return this.IsTrue ? "Buy" : "Sell";
      }
      return this.IsTrue ? "On" : "Off";
    },
    FgColor: function () {
      return {
        "translate-x-6 bg-green-300 dark:bg-green-300":
          this.IsTrue && !this.IsDarkTheme,
        "translate-x-0 bg-red-300 dark:bg-red-300":
          !this.IsTrue && !this.IsDarkTheme,
        "translate-x-6 bg-gray-500 dark:bg-gray-500":
          this.IsTrue && this.IsDarkTheme,
        "translate-x-0 bg-gray-500 dark:bg-gray-500":
          !this.IsTrue && this.IsDarkTheme,
      };
    },
    BgColor: function () {
      return {
        "bg-green-600": this.IsTrue && !this.IsDarkTheme,
        "bg-red-600": !this.IsTrue && !this.IsDarkTheme,
        "bg-gray-600": this.IsTrue && this.IsDarkTheme,
        "bg-gray-400": !this.IsTrue && this.IsDarkTheme,
      };
    },
  },
  data() {
    return {
      IsTrue: false,
    };
  },
  methods: {
    syncFromProps: function () {
      if (this.PropTrade) {
        this.IsTrue = this.PropTrade.buyorsell == "Buy";
      } else {
        this.IsTrue = !!this.Value;
      }
    },
    onRadioChange: function () {
      this.IsTrue = !this.IsTrue;
      if (this.PropTrade) {
        this.PropTrade.buyorsell = this.IsTrue ? "Buy" : "Sell";
      }
      this.$emit("itemclicked", this.IsTrue);
    },
  },
  props: {
    PropTrade: { type: Object },
    IsDarkTheme: { type: Boolean },
    Value: { type: Boolean },
    AriaLabel: { type: String },
  },
};
</script>

<style scoped>
.switch-btn {
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
  min-height: 1rem;
  min-width: 2.5rem;
}
@media (prefers-reduced-motion: reduce) {
  .switch-btn .transition,
  .switch-btn .transition-all {
    transition: none !important;
  }
}
</style>
