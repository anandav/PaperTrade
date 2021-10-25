<template>
  <div class="chart flex items-center justify-center p-12">
    <div class="mt-52 ">
      <div class="tooltip ">
        Hover over me
        <span class="tooltiptext">Tooltip text</span>
      </div>
      <div class="tooltip2 ml-28">
        Hover over me2
        <span class="tooltiptext2">Tooltip text</span>
      </div>
    </div>

  </div>
</template>

<script>
import myMixins from "../../shared/utilitymixins";
// import * as d3 from "d3";
export default {
  name: "Builder",
  components: {},
  computed: {
    //   ...mapState(["TradeDetail","Portfolio"])
  },
  created() {
   
  },
  data() {
    return {
      isOn: false,
      active: true,
      open: false,
      navigation: { categories: ["Home", "Home2", "Home3"] },
    };
  },
  methods: {},
  mounted() {
    //this.onload();
  },
  mixins: [myMixins],
  props: {},
};
</script>

<style>


.tooltip2 {
  /* position: relative;
  display: inline-block;
  border-bottom: 1px dotted black; */
      position: relative;
    display: inline-block;
    border-width: 1px;
    border-style: dotted;
    --tw-border-opacity: 1;
    border-color: rgba(15, 23, 42, var(--tw-border-opacity));
}

.tooltip2 .tooltiptext2 {
  /* visibility: hidden; */
  width: 120px;
  background-color: #555;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;

  opacity: 0;
  transition: opacity 0.3s;
}


.tooltip2 .tooltiptext2::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}


.tooltip2:hover .tooltiptext2 {
  visibility: visible;
  opacity: 1;
}
</style>