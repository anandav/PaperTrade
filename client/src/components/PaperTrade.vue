<template>
  <div class="col-lg-12 row">
    <PortfolioMenu style="margin-top: 70px" />
    <PortfolioDetail style="margin-top: 70px" />
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
export default {
  name: "PaperTrade",
  components: {
    PortfolioMenu,
    PortfolioDetail,
  },
  methods: {},
  created() {},
};
</script>


