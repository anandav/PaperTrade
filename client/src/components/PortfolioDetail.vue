<template>
  <div class="col-lg-9">
    <div class="jumbotron" v-show="!Portfolio">
      <h3 class="display-4">Please select a portfolio.</h3>
    </div>
    <div class="card text-white bg-secondary mb-3" v-if="Portfolio">
      <div class="card-header" :id="Portfolio._id.$oid">
        <div class="row">
          <div class="float-right col-lg-6">
            <h5 class="card-title">{{ Portfolio.Name }}</h5>
          </div>
          <div class=" col-lg-6">
            <div class="float-right">Created On: {{ Portfolio.CreatedOn.$date }}</div>
          </div>
        </div>
      </div>
      <div class="card-body">
        <p class="card-text">{{ Portfolio.Description }}</p>
      </div>
    </div>
    <StrategiesList />
  </div>
</template>
<script>
import { mapState } from "vuex";
import StrategiesList from "./StrategiesList";
export default {
  name: "PortfolioDetail",
  components: { StrategiesList },
  computed: {
    ...mapState(["Portfolio"]),
  },
};
</script>
