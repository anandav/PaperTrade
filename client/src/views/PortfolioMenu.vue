<template>
  <div
    class="min-h-screen mt-16 border-r border-gray-300 dark:border-gray-700"
    role="menu"
  >
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

      <div class="w-1/6">
        <a
          class="btn mx-2 invisible lg:visible float-right tooltip"
          href="#"
          @click="onAddNewPortfolio()"
        >
          <i class="material-icons">save</i>
          <tooltip :Value="txtAddEditPortfolio" />
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
          tabindex="0"
          role="menuitem"
          class="mt-1 leading-10 rounded-sm cursor-pointer"
          @click="onMenuSelectedPortfolio(item)"
          @keydown.enter="onMenuSelectedPortfolio(item)"
          @keydown.f2="onInlineEditPortfolio(item)"
          :class="{
            'border-l-2  border-yellow-500':
              Portfolio && item._id == Portfolio._id,
          }"
        >
        <div class="p-2" tabindex="0">
          <div class="inline-block">
            <div
              class="view"
              :class="{
                'font-black': Portfolio && item._id == Portfolio._id,
              }"
            >
<!-- <svg
              class="inline-block cursor-move pb-1"
              width="10"
              height="15"
              viewBox="0 0 2 5"
              version="1.1"
            >
              <path
                id="rect2026"
                style="fill: #ececec; stroke-width: 0.264583"
                d="M 1.7134726,6.3056817 H 2.4866974 V 7.0479501 H 1.7134726 Z m -1.48504562,0 H 1.0016518 V 7.0479501 H 0.22842698 Z M 1.7134726,5.1017156 H 2.4866974 V 5.8439839 H 1.7134726 Z m -1.48504562,0 H 1.0016518 V 5.8439839 H 0.22842698 Z M 1.7067486,3.9151924 H 2.4799734 V 4.6574607 H 1.7067486 Z m -1.48504561,0 H 0.99492782 V 4.6574607 H 0.22170299 Z M 1.7067486,2.7112265 H 2.4799734 V 3.4534948 H 1.7067486 Z m -1.48504561,0 H 0.99492782 V 3.4534948 H 0.22170299 Z M 1.704524,1.4995462 H 2.4777489 V 2.2418146 H 1.704524 Z m -1.48504551,0 H 0.99270332 V 2.2418146 H 0.21947849 Z M 1.704524,0.29558012 H 2.4777489 V 1.0378485 H 1.704524 Z m -1.48504551,0 H 0.99270332 V 1.0378485 H 0.21947849 Z"
              />
            </svg> -->

              {{ item.name }}
            </div>
            <input
              class="
                edit
                ml-2
                pl-2
                py-1
                bg-gray-200
                dark:bg-gray-700
                focus:outline-none
                rounded
              "
              placeholder="Edit Portfolio Name"
              type="text"
              v-model="item.name"
              @keyup.enter="onInlineSavePortfolio(item)"
            />
          </div>
          <!-- <div class="float-right ">
            <div class="space-x-1">
              <a class="btn tooltip view " @click="onInlineEditPortfolio(item)">
                <i class="material-icons">edit</i>
                <tooltip Value="Edit" />
              </a>
              <a class="btn edit tooltip " @click="onInlineSavePortfolio(item)">
                <i class="material-icons">save</i>
                <tooltip Value="Save Portfilio" />
              </a>
              <a
                class="btn ml-2 tooltip text-red-700 dark:text-red-700 "
                @dblclick="onDeletePortfolio(item)"
              >
                <i class="material-icons">delete</i>
                <tooltip Value="Delete Portfilio" />
              </a>
            </div>
          </div> -->

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
    onMenuSelectedPortfolio: function (item) {
      this.GetPortfolioById(item);
      this.GetAllStrategies(item);
    },
    onAddNewPortfolio : function() {
      if (this.portfolioName) {
        this.SavePortfolio({
          _id: 0,
          name: this.portfolioName,
          exchange : 'NSE',
          description: "",
          updateui: true,
        });
        this.portfolioName = "";
      }
    },
    // onInlineEditPortfolio : function(portfolio) {
    //   this.editPortfolio = portfolio;
    // },
    // onInlineSavePortfolio : function(portfolio) {
    //   this.editPortfolio = null;
    //   this.SavePortfolio(portfolio);
    // },
    // onDeletePortfolio(itempfl) {
    //   this.DeletePortfolio(itempfl);
    // },
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
