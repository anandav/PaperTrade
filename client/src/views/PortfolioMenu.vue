<template>
  <div class="border-r-2 border-gray-300 dark:border-gray-700">
    <div class="flex items-center mt-5">
      <div class="w-5/6">
        <input
          class="
            mx-2
            pl-2
            p-1
            w-full
            bg-gray-200
            dark:bg-gray-600
            focus:outline-none
            rounded
          "
          placeholder="Portfolio Name"
          type="text"
          v-model="portfolioName"
          @keyup.enter="onAddNewPortfolio()"
        />
      </div>

      <div class="w-1/6 ">
        <a
          class="btn mx-2 invisible lg:visible float-right"
          href="#"
          @click="onAddNewPortfolio()"
        >
          <i class="material-icons">save</i>
          <!-- {{ txtAddEditPortfolio }} -->
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
        class="flex-initial"
        :key="item._id"
        v-for="item in Portfolios"
        :class="{ isPortfolioEdit: item == editPortfolio }"
      >
        <div
          class="m-1 p-2 leading-10 bg-gray-200 dark:bg-gray-700 rounded-md "
          @click="onMenuSelectedPortfolio(item)"
          :class="{
            'border-l-2 border-red-300': Portfolio && item._id == Portfolio._id,
          }"
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
              class="edit ml-2 pl-2 py-1 bg-gray-200 dark:bg-gray-600 focus:outline-none rounded"
              placeholder="Edit Portfolio Name"
              type="text"
              v-model="item.name"
              @keyup.enter="onInlineSavePortfolio(item)"
            />
          </div>
          <div class="float-right">
            <div class="space-x-1">
              <a class="btn view" @click="onInlineEditPortfolio(item)">
                <i class="material-icons">edit</i>
              </a>
              <a class="btn edit" @click="onInlineSavePortfolio(item)">
                <i class="material-icons">save</i>
              </a>
              <a
                class="btn ml-2 text-red-700 dark:text-red-700"
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
import { mapActions, mapGetters } from "vuex";

export default {
  name: "PortfolioMenu",
  methods: {
    ...mapActions({
      GetAllPortfolios: "portfolioModule/GetAllPortfolios",
      GetPortfolioById: "portfolioModule/GetPortfolioById",
      SavePortfolio: "portfolioModule/SavePortfolio",
      DeletePortfolio: "portfolioModule/DeletePortfolio",
      GetAllStrategies: "strategyModule/GetAllStrategies",
    }),
    onMenuSelectedPortfolio(item) {
      this.GetPortfolioById(item);
      this.GetAllStrategies(item);
    },
    onAddNewPortfolio() {
      if (this.portfolioName) {
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

  mounted() {
    this.GetAllPortfolios().then(() => {
      this.isLoading = false;
    });
  },
  computed: {
    ...mapGetters({
      Portfolio: "portfolioModule/Portfolio",
      Portfolios: "portfolioModule/Portfolios",
    }),
  },
};
</script>
<style scoped>
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
