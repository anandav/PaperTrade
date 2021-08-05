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
        <div class="d-flex justify-content-center">
          <div v-show="isLoading" class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <div class="mt-2" :key="item._id" v-for="item in Portfolios">
          <div class="row">
            <div class="col-sm">
              <div class="">
                <a
                  @click="menuSelectedPortfolio(item)"
                  :class="{ active: Portfolio === item }"
                  v-show="!(inlineEdit && item._id === _pid)"
                  class="pt-5"
                  >{{ item.name }}</a
                >
              </div>
              <input
                class="form-control col-lg"
                v-show="inlineEdit && item._id === _pid"
                placeholder="Edit Portfolio Name"
                type="text"
                v-model="item.name"
                @keyup.enter="inlineEditPortfolio(item)"
              />
            </div>
            <div class="col-sm">
              <div class="float-right">
                <a class="btn btn-dark" @click="inlineEditPortfolio(item)">
                  <i v-show="!inlineEdit" class="bi bi-plus-square"></i>
                  <i v-show="inlineEdit" class="bi bi-save"></i>
                </a>
                <a class="btn btn-danger ml-2" @click="deletePortfolio(item)">
                  <i class="bi bi-trash"></i>
                </a>
              </div>
            </div>
          </div>
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
        this._pid = "";
        this.portfolioName = "";
      }
      this.isEdit = !this.isEdit;
      this.btnAddEditProtfolio = this.isEdit
        ? this.$getConst("savePortfolio")
        : this.$getConst("addNewPortfolio");
    },
    inlineEditPortfolio(item) {
      if (item.name) {
        this.inlineEdit = !this.inlineEdit;
        this._pid = item._id;
        if (this.inlineEdit) {
          //TODO placeholder for edit mode
        } else {
          this.SavePortfolio(item);
        }
      }
    },
    deletePortfolio(itempfl) {
      console.log("Porfolio Delete clicked");
      this.DeletePortfolio(itempfl);
    },
  },
  data: function () {
    return {
      portfolioName: "",
      btnAddEditProtfolio: this.$getConst("addNewPortfolio"),
      isLoading: true,
      isEdit: false,
      inlineEdit: false,
    };
  },

  created() {
    this.GetAllPortfolios().then(() => {
      this.isLoading = false;
    });
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
