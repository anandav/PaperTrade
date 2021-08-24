<template>
  <div class="col-lg-12 row">
      <PortfolioMenu style="margin-top: 70px" />

  test
  </div>
</template>

<script>
import PortfolioMenu from "../PortfolioMenu";
import myMixins from "../../shared/utilitymixins";
//import * as d3js from 'd3';
export default {
  name: "Builder",
  components: {
    PortfolioMenu,
  },
  computed: {
    //   ...mapState(["TradeDetail","Portfolio"])
  },
  created() {
      //console.log(d3js);
  },
  data() {
    return {
     
    };
  },
  methods:{},
  mixins: [myMixins],
  props: {}
};
</script>

<style>
</style>