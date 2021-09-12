<template>
  <div>
    <div
      class="pb-52 container min-h-screen mx-auto bg-gray-100 dark:bg-gray-700"
    >
      <div class="grid grid-cols-12 mb-22">
        <PortfolioMenu class="col-span-3" />
        <PortfolioDetail class="col-span-9" />
      </div>
    </div>
    <TradeAddEdit />
  </div>
</template>
<style scoped>
</style>
<script>
import PortfolioMenu from "./PortfolioMenu";
import PortfolioDetail from "./PortfolioDetail";
import TradeAddEdit from "./TradeAddEdit";

export default {
  name: "PaperTrade",
  components: {
    PortfolioMenu,
    PortfolioDetail,
    TradeAddEdit,
  },
mounted (){
console.log('mounted');
console.log('this.$store :>> ', this.$store);
},
// computed: {
  //   ...mapState(["TradeDetail","Portfolio"])
  // },
  created() {},
};
</script>


