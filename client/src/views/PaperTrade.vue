<template>
  <div class="flex min-h-screen bg-gray-100 dark:bg-gray-900">
    <PortfolioMenu class="fixed top-16 bottom-0 w-52" />
    <div class="ml-52 flex-1 pt-16 pb-10">
      <PortfolioDetail />
    </div>
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


