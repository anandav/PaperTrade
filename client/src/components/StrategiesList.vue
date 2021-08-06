<template>
  <div class="pr-2" v-if="Portfolio">
    {{Portfolio._id}}
    <!-- <div :key="item._id.$oid" v-for="item in Strategies">
      <StrategyDetail :Strategy="item" />
      <hr />
    </div> -->
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
//import StrategyDetail from "./StrategyDetail";

export default {
  name: "StrategiesList",
  //components: { StrategyDetail },
  props :{pid : Number},
  computed: {
    ...mapState(["Portfolio"]),
  },
  created() {
    this.GetAllStrategies(this.Portfolio._id);
  },
  methods: {
    ...mapActions(["GetAllStrategies"]),
  },
};
</script>
