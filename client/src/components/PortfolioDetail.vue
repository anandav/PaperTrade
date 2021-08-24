<template>
  <div class="col-lg-9 col-md-7">
    <div v-if="!Portfolio" class="jumbotron">
      <h3 class="display-4">Please select a portfolio.</h3>
    </div>
    <div v-if="Portfolio" class="text-white rounded">
      <div class="bg-secondary p-4 rounded">
        {{ Portfolio.name }}
        <a
          class="btn btn-warning float-right text-dark"
          @click="onAddNewStrategy()"
        >
          <i class="bi bi-plus-square"></i>
          {{ txtAddStrategy }}</a
        >
      </div>

      <!-- <StrategiesList /> -->
      <div class="mt-3">
        <div :key="item._id" v-for="item in Strategies">
          <StrategyDetail :PropStrategy="item" />
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
