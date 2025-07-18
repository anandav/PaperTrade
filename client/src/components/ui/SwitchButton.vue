<template>
  <button
    class="relative focus:outline-none edit"
    x-cloak
    @click="onRadioChange()"
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
    >
      <!-- {
        trueBgColour: IsTrue,
        falseBgColour: !IsTrue,
      } -->
    </div>
  </button>
</template>
  
  <script>
export default {
  name: "SwitchButton",
  created() {
    if (this.PropTrade) {
      this.IsTrue = this.PropTrade.buyorsell == "Buy" ? true : false;
    } 
    else {
      this.IsTrue = this.Value;
    }
  },
  computed: {
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
  },
};
</script>
  
