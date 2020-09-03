<template>
  <div class="pr-2" v-if="Portfolio">
    <div :key="item._id.$oid" v-for="item in Portfolio.Strategies">
      <StrategyDetail :Strategy="item"/>
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
  }
  //Portfolio.Strategies

 };
</script>
