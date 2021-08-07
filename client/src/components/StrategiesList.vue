<template>
  <div class="mt-3" v-if="Portfolio">
    <div :key="item._id.$oid" v-for="item in Strategies">
      <StrategyDetail :Strategy="item" />
      <hr />
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import StrategyDetail from "./StrategyDetail";

export default {
  name: "StrategiesList",
  computed: {
    ...mapState(["Portfolio", "Strategies"]),
  },
  components :{StrategyDetail},
  created() {
    this.GetAllStrategies(this.Portfolio._id);
  },
  methods: {
    ...mapActions(["GetAllStrategies"]),
  },
};
</script>
