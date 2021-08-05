<template>
  <div class="col-lg-9 text-primary">
    <div v-if="!Portfolio" class="jumbotron">
      <h3 class="display-4">Please select a portfolio.</h3>
    </div>
    <div v-if="Portfolio" class="text-white">
      <div class="bg-secondary  p-4 ">
        {{ Portfolio.name }}
        <a class="btn btn-warning float-right" data-toggle="modal">
          Add New Strategy</a
        >
      </div>

      <div class="col-lg-12"></div>
      <StrategiesList />
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import StrategiesList from "./StrategiesList";
export default {
  name: "PortfolioDetail",
  components: { StrategiesList },
  computed: {
    ...mapState(["Portfolio"]),
  },
  methods: {
    ...mapActions(["GetAllStrategies"]),
  },
  data: function () {
    return { isEdit: true };
  },
  created() {
    //this.GetAllStrategies();
  },
};
</script>
