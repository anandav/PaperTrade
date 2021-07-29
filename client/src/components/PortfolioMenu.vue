<template>
  <div class="col-lg-3">
    <div class="card text-white bg-secondary">
      <div class="card-header">
        <div class="float-left" ref="refportfolioname">
          <input
            class="form-control"
            v-show="isEdit"
            placeholder="Portfolio Name"
            type="text"
            v-model="portfolioName"
            @keyup.enter="addEditPortfolio()"
            
          />
        </div>
        <div class="float-right">
          <a class="btn btn-dark" href="#" @click="addEditPortfolio()">
            <i v-show="!isEdit" class="bi bi-plus-square"></i>
            <i v-show="isEdit" class="bi bi-save"></i>
            {{ btnAddEditProtfolio }}</a
          >
        </div>
      </div>
      <div class="card-body">
        <div class="mt-2" :key="item._id" v-for="item in Portfolios">
          <a
            @click="menuSelectedPortfolio(item)"
            :class="{ active: Portfolio === item }"
            class=""
            >{{ item.name }}</a
          >
          <a class="btn btn-danger float-right">
            <i @click="deletePortfolio(item)" class="bi bi-trash"></i>
          </a>
          <hr />
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
      "GetPortfolioById",
      "SavePortfolio",
      "DeletePortfolio",
    ]),
    menuSelectedPortfolio(item) {
      this.GetPortfolioById(item);
    },

    addEditPortfolio() {
      if (this.isEdit && this.portfolioName) {
        this.SavePortfolio({
          _id: 0,
          name: this.portfolioName,
          description: "",
          updateui: true,
        });
        this.portfolioName = "";
      }
      this.isEdit = !this.isEdit;
      this.btnAddEditProtfolio = this.isEdit
        ? this.$getConst("savePortfolio")
        : this.$getConst("addNewPortfolio");
    },
    deletePortfolio(itempfl) {
      console.log("Porfolio Delete clicked")
      this.DeletePortfolio(itempfl);
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
