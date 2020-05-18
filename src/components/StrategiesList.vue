<template>
  <div style=" overflow-y:scroll" class="pr-2" v-if="Portfolio">
    <div :key="itemstrategy._id.$oid" v-for="itemstrategy in Portfolio.Strategies">
      <StrategyDetail :Strategy="itemstrategy"/>
      <hr />
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import StrategyDetail from "./StrategyDetail";
export default {
  name: "StrategiesList",
  components: { StrategyDetail },
  computed: {
    ...mapState(["Portfolio"]),
  },
  //Portfolio.Strategies
  
 };
</script>