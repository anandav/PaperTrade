<template>
  <div class="col-lg-9">
    <div v-if="!Portfolio" class="jumbotron">
      <h3 class="display-4">Please select a portfolio.</h3>
    </div>
    <div v-if="Portfolio" class="text-white rounded">
      <div class="bg-secondary p-4 rounded">
        {{ Portfolio.name }}
        <a
          class="btn btn-warning float-right text-dark"
          @click="addNewStrategy()"
        >
          <i class="bi bi-plus-square"></i>
          Add New Strategy</a
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
export default {
  name: "PortfolioDetail",
  components: {
    StrategyDetail,
  },
  computed: {
    ...mapState(["Portfolio", "Strategies"]),
  },
  methods: {
    ...mapActions(["AddEditStrategy"]),
    addNewStrategy: function () {
      this.isEdit = !this.isEdit;

      var _strategy = {
        name: "NEW",
        description: "",
        symbol: "NIFTY",
        portfolio: this.Portfolio._id,
        isNameEdit: true,
      };
      this.AddEditStrategy(_strategy);
    },
  },
  data: function () {
    return { isEdit: false };
  },
};
</script>
