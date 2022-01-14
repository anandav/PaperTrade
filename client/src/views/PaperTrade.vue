<template>
  <div>
    <div class="container min-h-screen mx-auto bg-gray-100 dark:bg-gray-900">
      <div class="flex">
        <PortfolioMenu class="flex-none w-52 fixed" />
        <PortfolioDetail class="flex-auto w-full ml-52" />
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


