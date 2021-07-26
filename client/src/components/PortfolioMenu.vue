<template>
  <div class="col-lg-3">
    <div class="card text-white bg-secondary">
      <div class="card-header">
        <div class="float-left">
          <input
            class="form-control"
            v-show="isEdit"
            placeholder="Portfolio Name"
            type="text"
            v-model="portfolioName"
          />
        </div>
        <div class="float-right">
          <a class="btn btn-dark" href="#" @click="addEditPortfolio()">{{
            btnAddEditProtfolio
          }}</a>
        </div>
      </div>
      <div class="card-body">
        <div class="car-title" :key="item._id" v-for="item in Portfolios">
          <!-- v-show="Portfolios !== undefined && Portfolios.length > 0" -->
          <a
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
      "SavePortfolio",
    ]),
    menuSelectedPortfolio(item) {
      this.GetPortfolioById(item);
    },
    addEditPortfolio() {
      if (this.isEdit) {
        console.log(this.portfolioName);
        this.portfolioName = "";
        this.SavePortfolio({
          pid: 0,
          name: this.portfolioName,
          description: "",
        });
      }
      this.isEdit = !this.isEdit;

      this.btnAddEditProtfolio = this.isEdit
        ? this.$getConst("savePortfolio")
        : this.$getConst("addNewPortfolio");
    },
  },
  data: function () {
    return {
      portfolioName: "",
      btnAddEditProtfolio: this.$getConst("addNewPortfolio"),
      isEdit: false,
    };
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
