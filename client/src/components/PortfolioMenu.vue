<template>
  <div class="col-lg-3 col-md-5">
    <div class="card text-white bg-grey-custom">
      <div class="card-header">
        <div class="float-left">
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
          <a class="btn btn-warning" href="#" @click="addEditPortfolio()">
            <i v-show="!isEdit" class="bi bi-plus-square"></i>
            <i v-show="isEdit" class="bi bi-save"></i>
            <span class="d-none d-lg-inline d-xl-inline">
              {{ txtAddEditPortfolio }}
            </span>
          </a>
        </div>
      </div>
      <div class="card-body">
        <div class="d-flex justify-content-center">
          <div v-show="isLoading" class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <div class="mt-2" :key="item._id" v-for="item in Portfolios">
          <div class="row" :class="{ isPortfolioEdit: item == editPortfolio }">
            <div class="col-sm">
              <div class="">
                <a
                  @click="onMenuSelectedPortfolio(item)"
                  :class="{ active: Portfolio === item }"
                  v-show="!(inlineEdit && item._id === _pid)"
                  class="pt-5 view"
                  >{{ item.name }}</a
                >
              </div>
              <input
                class="form-control edit"
                placeholder="Edit Portfolio Name"
                type="text"
                v-model="item.name"
                @keyup.enter="onInlineSavePortfolio(item)"
              />
            </div>
            <div class="col-sm">
              <div class="float-right text-dark">
                <a
                  class="btn btn-warning view"
                  @click="onInlineEditPortfolio(item)"
                >
                  <i class="bi bi-pencil"></i>
                </a>
                <a
                  class="btn btn-warning edit"
                  @click="onInlineSavePortfolio(item)"
                >
                  <i class="bi bi-save"></i>
                </a>
                <a class="btn btn-danger ml-2" @click="onDeletePortfolio(item)">
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
      "GetAllStrategies",
    ]),
    onMenuSelectedPortfolio(item) {
      this.GetPortfolioById(item);
      this.GetAllStrategies(item);
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
      this.txtAddEditPortfolio = this.isEdit
        ? this.$getConst("savePortfolio")
        : this.$getConst("addNewPortfolio");
    },
    onInlineEditPortfolio(portfolio) {
      this.editPortfolio = portfolio;
    },
    onInlineSavePortfolio(portfolio) {
      this.editPortfolio = null;
      this.SavePortfolio(portfolio);
    },
    onDeletePortfolio(itempfl) {
      this.DeletePortfolio(itempfl);
    },
  },
  data: function () {
    return {
      portfolioName: "",
      txtAddEditPortfolio: this.$getConst("addNewPortfolio"),
      isLoading: true,
      isEdit: false,
      inlineEdit: false,
      editPortfolio: null,
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
/* .portfolioitem {
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
} */

[v-cloak] {
  display: none;
}
.form-control {
  width: 200px;
}
.edit {
  display: none;
}
.isPortfolioEdit .edit {
  display: inline-block;
}
.isPortfolioEdit .view {
  display: none;
}
</style>
