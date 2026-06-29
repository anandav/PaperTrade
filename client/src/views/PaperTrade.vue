<template>
  <div>
    <div class="w-full bg-gray-100 dark:bg-gray-900">
      <PortfolioMenu class="fixed top-16 bottom-0 w-52 overscroll-auto" />
      <div class="ml-52 w-[calc(100%-13rem)] min-h-screen pt-16 pb-10 bg-gray-100 dark:bg-gray-900">
        <PortfolioDetail />
      </div>
      <!-- <div class="grid grid-cols-10">
        <PortfolioMenu class="col-span-2" />
        <PortfolioDetail class="col-span-8" />
      </div> -->
    </div>
    <!-- <TradeAddEdit /> -->
  </div>
</template>
<style scoped>
</style>
<script>
import PortfolioMenu from "./PortfolioMenu";
import PortfolioDetail from "./PortfolioDetail";

export default {
  name: "PaperTrade",
  components: {
    PortfolioMenu,
    PortfolioDetail,
  },
  mounted() {},

  created() {},
};
</script>


