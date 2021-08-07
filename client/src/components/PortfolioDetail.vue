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
      <StrategiesList />
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import StrategiesList from "./StrategiesList";
export default {
  name: "PortfolioDetail",
  components: { StrategiesList },
  computed: {
    ...mapState(["Portfolio", "Strategies"]),
  },
  methods: {
    addNewStrategy: function () {
      this.isEdit = !this.isEdit;
      console.log( this.$dayjs.format());
    },
  },
  data: function () {
    return { isEdit: false };
  },
};
</script>
