<template>
  <div class="container mx-auto h-auto bg-gray-100 dark:bg-gray-700">
    <div class="grid grid-cols-12">
      <PortfolioMenu class="col-span-3" />
      <PortfolioDetail class="col-span-9" />
      <TradeAddEdit />
    </div>

    <!-- <div class="hidden bg-gray-300 dark:bg-gray-600 border-red-300"></div> -->
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
  // computed: {
  //   ...mapState(["TradeDetail","Portfolio"])
  // },
  created() {},

};
</script>


