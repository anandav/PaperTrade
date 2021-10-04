<template>
  <div>
    <div
      class=" container min-h-screen mx-auto bg-gray-100 dark:bg-gray-800"
    >
      <div class="grid grid-cols-10">
        <PortfolioMenu class="col-span-2 mt-16" />
        <PortfolioDetail class="col-span-8 mt-16" />
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
  mounted() {},

  created() {},
};
</script>


