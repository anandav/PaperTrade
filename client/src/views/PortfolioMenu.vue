<template>
  <div class="border-r-2 border-gray-300 dark:border-gray-600">
    <div class="flex items-center mt-5">
      <div class="flex-initial">
        <input
          class="ml-2 pl-2 py-1  rounded"
          placeholder="Portfolio Name"
          type="text"
          v-model="portfolioName"
          @keyup.enter="onAddNewPortfolio()"
        />
      </div>

      <div class="flex-initial float-right">
        <a
          class="btn ml-1 invisible lg:visible "
          href="#"
          @click="onAddNewPortfolio()"
        >
          <i class="material-icons">save</i>
          {{ txtAddEditPortfolio }}
        </a>
      </div>
    </div>
    <div class="mt-5">
      <div class="">
        <div v-show="isLoading" class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div
        class=""
        :key="item._id"
        v-for="item in Portfolios"
        :class="{
          'border-l-2 border-red-300': Portfolio && item._id == Portfolio._id,
        }"
      >
        <div
          class="px-2 leading-10 "
          @click="onMenuSelectedPortfolio(item)"
          :class="{ isPortfolioEdit: item == editPortfolio }"
        >
          <div class="inline-block">
            <div
              class="view"
              :class="{
                'font-black': Portfolio && item._id == Portfolio._id,
              }"
            >
              {{ item.name }}
            </div>
            <input
              class="edit"
              placeholder="Edit Portfolio Name"
              type="text"
              v-model="item.name"
              @keyup.enter="onInlineSavePortfolio(item)"
            />
          </div>
          <div class="float-right">
            <div class="space-x-1">
              <a
                class="btn  view "
                @click="onInlineEditPortfolio(item)"
              >
                <i class="material-icons">edit</i>
              </a>
              <a
                class="btn edit"
                @click="onInlineSavePortfolio(item)"
              >
                <i class="material-icons">save</i>
              </a>
              <a
                class="btn ml-2 text-red-600"
                @click="onDeletePortfolio(item)"
              >
                <i class="material-icons">delete</i>
              </a>
            </div>
          </div>
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
    onAddNewPortfolio() {
      if ( this.portfolioName) {
        this.SavePortfolio({
          _id: 0,
          name: this.portfolioName,
          description: "",
          updateui: true,
        });
        this.portfolioName = "";
      }
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
      txtAddEditPortfolio: this.$getConst("savePortfolio"),
      isLoading: true,
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
