<template>
  <div>
    <div class="container min-h-screen mx-auto bg-gray-100 dark:bg-gray-900">
      <div class="flex">
        <PortfolioMenu class="flex-none w-72 fixed " />
        <PortfolioDetail class="flex-auto w-full ml-72" />
      </div>
      <!-- <div class="grid grid-cols-10">
        <PortfolioMenu class="col-span-2" />
        <PortfolioDetail class="col-span-8" />
      </div> -->
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


