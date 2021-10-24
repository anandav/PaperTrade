<template>
  <div class="mt-20">
    <div v-if="!Portfolio" class="drop-shadow-md dark:bg-gray-900">
      <h3 class="pl-5 pb-5 text-xl">Please select a portfolio.</h3>
    </div>
    <div v-if="Portfolio" class="">
      <div
        class="
          border-b-2
          drop-shadow-md
          pl-5
          pb-5
          border-gray-300
        
          dark:border-gray-700
        "
      >
        <span class="text-xl">
          {{ Portfolio.name }}
        </span>
        <div class="float-right pr-5">
          <a class="btn" @click="onAddNewStrategy()">
            <i class="material-icons">insights</i> &nbsp;
            <!-- <i class="material-icons-outlined">insights</i>  -->
            {{ txtAddStrategy }}</a
          >
        </div>
      </div>

      <div class="mt-3">
        <div
          v-bind:id="'strategy_' + item._id"
          :key="item._id"
          v-for="item in Strategies"
        >
          <StrategyDetail :PropStrategy="item" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import StrategyDetail from "./StrategyDetail.vue";
import myMixins from "../shared/utilitymixins";
export default {
  name: "PortfolioDetail",
  components: {
    StrategyDetail,
  },
  computed: {
    ...mapGetters({
      Portfolio: "portfolioModule/Portfolio",
      Strategies: "strategyModule/Strategies",
    }),
  },
  methods: {
    ...mapActions({ AddStrategy: "strategyModule/AddStrategy" }),
    onAddNewStrategy: function () {
      this.isEdit = !this.isEdit;
      this.AddStrategy(this.Portfolio._id);
    },
  },
  mixins: [myMixins],
  data: function () {
    return { isEdit: false, txtAddStrategy: this.$getConst("addNewStrategy") };
  },
};
</script>
