<template>
  <div class="">
    <div v-if="!Portfolio" class="jumbotron">
      <h3 class="display-4">Please select a portfolio.</h3>
    </div>
    <div v-if="Portfolio" class="rounded">
      <div class="bg-grey-custom p-4 rounded">
        {{ Portfolio.name }}
        <a
          class="btn btn-secondary float-right"
          @click="onAddNewStrategy()"
        >
          <i class="bi bi-plus-square"></i>
          {{ txtAddStrategy }}</a
        >
      </div>

      <!-- <StrategiesList /> -->
      <div class="mt-3">
        <div v-bind:id="'strategy_'+item._id" :key="item._id" v-for="item in Strategies"  >
          <StrategyDetail :PropStrategy="item"  />
          <hr />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import StrategyDetail from "./StrategyDetail.vue";
import myMixins from "../shared/utilitymixins";
export default {
  name: "PortfolioDetail",
  components: {
    StrategyDetail,
  },
  computed: {
    ...mapState(["Portfolio", "Strategies"]),
  },
  methods: {
    ...mapActions(["AddStrategy"]),
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
