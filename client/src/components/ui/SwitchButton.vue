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
        :class="{
          ' bg-green-600': IsBuy == 'Buy',
          ' bg-red-600': IsBuy == 'Sell',
        }"
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
          shadow-sm
        "
        :class="{
          'translate-x-0  bg-red-300 dark:bg-red-300':
            PropTrade.buyorsell == 'Sell',
          'translate-x-6 bg-green-300 dark:bg-green-300':
            PropTrade.buyorsell == 'Buy',
        }"
      ></div>
    </button>
  </template>
  
  <script>
  export default {
    name: "SwitchButton",
    created() {
      this.IsBuy = this.PropTrade.buyorsell;
    },
    data() {
      return {
        IsBuy: "",
      };
    },
    methods: {
      onRadioChange: function () {
         this.IsBuy = this.IsBuy == "Buy" ? "Sell" : "Buy";
         this.PropTrade.buyorsell = this.IsBuy;
      },
    },
    props: {
       PropTrade: { type: Object },
    },
  };
  </script>
  
  <style>
  </style>