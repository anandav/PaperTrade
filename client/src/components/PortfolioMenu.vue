<template>
  <div class="col-lg-3">
    <div class="card text-white bg-secondary">
      <div class="card-header">
        <div class="float-left"></div>
        <div class="float-right">
          <a
            class="btn btn-dark"
            href="#"
            data-target="#divcreateeditportfolio"
            data-toggle="modal"
            >Create New Portfolio</a
          >
        </div>
      </div>
      <div class="card-body">
        <div class="car-title" :key="item._id" v-for="item in Portfolios">
          <a
            v-show="Portfolios !== undefined && Portfolios.length > 0"
            @click="menuSelectedPortfolio(item)"
            :class="{ active: Portfolio === item }"
            >{{ item.name }}</a
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "PortfolioMenu",
  methods: {
    ...mapActions([
      "GetAllPortfolios",
      "SelectPortfolioChanged",
      "GetPortfolioById",
    ]),
    menuSelectedPortfolio(item) {
      this.GetPortfolioById(item);
    },
  },

  created() {
    this.GetAllPortfolios();
  },
  computed: {
    ...mapState(["Portfolios", "Portfolio"]),
  },
};
</script>
<style scoped>
.portfolioitem {
  min-height: 560px;
  overflow-y: hidden;
}

.portforlio-menu-item {
  font-size: 14px;
}

.portforlio-menu-item:hover {
  color: #bebebe !important;
}
.active {
  color: #ffffff !important;
  background-color: #6c757d;
  border-color: #6c757d;
}

.active :hover {
  color: #ffffff !important;
}
</style>
