<template>
  <div class="container mx-auto h-auto bg-gray-100 dark:bg-gray-700">
    <div class="grid grid-cols-5">
      <PortfolioMenu class="col-span-1" />
      <PortfolioDetail class="" />
      <TradeAddEdit />
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  padding: 0;
  width: 100%;
  margin: 0 auto;
  max-width: 1200px;
}
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


