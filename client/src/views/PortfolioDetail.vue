<template>
  <div class="mt-20">
    <div v-if="!Portfolio" class="drop-shadow-md dark:bg-gray-900">
      <h3 class="pl-5 pb-5 text-xl">Please select a portfolio.</h3>
    </div>
    <div v-if="Portfolio" class="">
      <div
        class="
          border-b-2
          drop-shadow-md
          pl-5
          pb-5
          flex
          space-x-2
          border-gray-300
          dark:border-gray-800
        "
        :class="{ isPortfolioEdit: Portfolio == editPortfolio }"
      >
        <div class="flex-1">
          <label class="text-xxs block text-gray-500"> Portfolio </label>
          <span class="view">
            {{ Portfolio.name }}
          </span>
          <input
            class="normal-edit edit"
            placeholder="Edit Portfolio Name"
            type="text"
            v-model="Portfolio.name"
            @keyup.enter="onSavePortfolio(Portfolio)"
          />
        </div>
        <div class="flex-1">
          <label class="text-xxs block text-gray-500"> Exchange </label>
          <span class="view">
            {{ Portfolio.exchange }}
          </span>

          <input
            class="normal-edit edit"
            placeholder="Exchange Name"
            type="text"
            v-model="Portfolio.exchange"
            @keyup.enter="onSavePortfolio(Portfolio)"
          />
        </div>

        <div class="flex-1">
          <label class="text-xxs block text-gray-500"> Opening Balance </label>
          <span class="view">
            {{ Portfolio.openingbalance | decimal2}}
          </span>

          <input
            class="normal-edit edit"
            placeholder="Opening Balance"
            type="number"
            v-model="Portfolio.openingbalance"
            @keyup.enter="onSavePortfolio(Portfolio)"
          />
        </div>

        <div class="flex-1">
          <label class="text-xxs block text-gray-500"> Current Balance </label>
          <span :class="FgColor">
            {{ CurrentBalance | decimal2 }}
          </span>
        </div>
        <div class="flex-1">
          <label class="text-xxs block text-gray-500"> Current P&L </label>
          <span :class="FgColor">
            {{ TotalPortfolioAmount | decimal2}}
          </span>
        </div>
        <div class="flex-1">
          <label class="text-xxs block text-gray-500"> NAV </label>
          <span :class="FgColor"> {{ NAV  | decimal2 }}% </span>
        </div>

        <div class="float-right pr-5 space-x-2">
          <button
            class="btn dark:text-orange-400 tooltip view"
            @click="onAddNewStrategy()"
          >
            <i class="material-icons">playlist_add</i>
            <tooltip :Value="txtAddStrategy" />
          </button>
          <button class="btn tooltip view" @click="onEditPortfolio(Portfolio)">
            <i class="material-icons">edit</i>
            <tooltip Value="Edit Portfilio" />
          </button>
          <button class="btn edit tooltip" @click="onSavePortfolio(Portfolio)">
            <i class="material-icons">save</i>
            <tooltip Value="Save Portfilio" />
          </button>
          <button
            class="btn ml-2 tooltip text-red-700 dark:text-red-700 view"
            @dblclick="onDeletePortfolio(Portfolio)"
          >
            <i class="material-icons">delete_forever</i>
            <tooltip Value="Delete Portfilio" />
          </button>
        </div>
      </div>


      <div class="mt-3">
        <div
          v-bind:id="'strategy_' + item._id"
          :key="item._id"
          v-for="item in Strategies"
        >
          <StrategyDetail :PropStrategy="item" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import StrategyDetail from "./StrategyDetail.vue";
import myMixins from "../shared/chart";
export default {
  name: "PortfolioDetail",
  components: {
    StrategyDetail,
  },
  computed: {
    ...mapGetters({
      Portfolio: "portfolioModule/Portfolio",
      Strategies: "strategyModule/Strategies",
    }),
    TotalPortfolioAmount: {
      get: function () {
        let price = 0;
        this.Strategies.forEach((_startegy) => {
          _startegy?.trades?.forEach((_trade) => {
            price =
              _trade.buyorsell == "Buy"
                ? price - _trade.price * (_startegy.lotsize * _trade.quantity)
                : price + _trade.price * (_startegy.lotsize * _trade.quantity);
          });
        });

        return price;
      },
    },
    CurrentBalance: {
      get: function () {
        // ~~ 'double tilda' is bitwise operator here it is use to convert string to int
        return ~~this.Portfolio.openingbalance + this.TotalPortfolioAmount;
      },
    },
    NAV: {
      get: function () {
        return (this.CurrentBalance / ~~this.Portfolio.openingbalance) * 100;
      },
    },
    FgColor: function () {
      return {
        "text-green-700": this.TotalPortfolioAmount >= 0,
        "text-red-700": this.TotalPortfolioAmount < 0,
      };
    },
  },
  methods: {
    ...mapActions({
      AddStrategy: "strategyModule/AddStrategy",
      SavePortfolio: "portfolioModule/SavePortfolio",
      DeletePortfolio: "portfolioModule/DeletePortfolio",
    }),
    onAddNewStrategy: function () {
      this.isEdit = !this.isEdit;
      this.AddStrategy(this.Portfolio._id);
    },
    onEditPortfolio: function (portfolio) {
      this.editPortfolio = portfolio;
    },
    onSavePortfolio: function (portfolio) {
      this.editPortfolio = null;
      this.SavePortfolio(portfolio);
    },
    onDeletePortfolio: function (portfolio) {
      this.DeletePortfolio(portfolio);
    },
  },
  mixins: [myMixins],
  data: function () {
    return {
      isEdit: false,
      txtAddStrategy: this.$getConst("addNewStrategy"),
      editPortfolio: null,
    };
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
