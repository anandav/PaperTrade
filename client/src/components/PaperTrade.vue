<template>
  <div class="col-lg-12 row">
    <PortfolioMenu style="margin-top: 70px" />
    <PortfolioDetail style="margin-top: 70px" />
    <TradeAddEdit />
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


