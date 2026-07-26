<template>
  <div class="pt-2 pb-4 min-h-full px-2 sm:px-0">
    <div v-if="!Portfolio" class="drop-shadow-md dark:bg-gray-900">
      <h3 class="pl-3 sm:pl-5 pb-5 text-xl">Please select a portfolio.</h3>
    </div>
    <div v-if="Portfolio" class="">
      <div
        class="
          portfolio-header
          border-b-2
          px-3
          sm:pl-5
          sm:pr-5
          pb-4
          border-gray-300
          dark:border-gray-800
        "
        :class="{ isPortfolioEdit: Portfolio == editPortfolio }"
      >
        <div class="portfolio-meta">
          <div class="portfolio-field">
            <label class="text-xs block text-gray-500" :for="'pf-name-' + Portfolio._id">
              Portfolio
            </label>
            <span class="view">
              {{ Portfolio.name }}
            </span>
            <input
              class="normal-edit edit"
              :id="'pf-name-' + Portfolio._id"
              placeholder="Edit Portfolio Name"
              type="text"
              v-model="Portfolio.name"
              @keyup.enter="onSavePortfolio(Portfolio)"
            />
          </div>
          <div class="portfolio-field">
            <label class="text-xs block text-gray-500" :for="'pf-ex-' + Portfolio._id">
              Exchange
            </label>
            <span class="view">
              {{ Portfolio.exchange }}
            </span>

            <input
              class="normal-edit edit"
              :id="'pf-ex-' + Portfolio._id"
              placeholder="Exchange Name"
              type="text"
              v-model="Portfolio.exchange"
              @keyup.enter="onSavePortfolio(Portfolio)"
            />
          </div>

          <div class="portfolio-field">
            <label class="text-xs block text-gray-500" :for="'pf-ob-' + Portfolio._id">
              Opening Balance
            </label>
            <span class="view">
              {{ $filters.decimal2(Portfolio.openingbalance) }}
            </span>

            <input
              class="normal-edit edit"
              :id="'pf-ob-' + Portfolio._id"
              placeholder="Opening Balance"
              type="number"
              v-model="Portfolio.openingbalance"
              @keyup.enter="onSavePortfolio(Portfolio)"
            />
          </div>

          <div class="portfolio-field">
            <span class="text-xs block text-gray-500" id="pf-cb-label">
              Current Balance
            </span>
            <span :class="FgColor" aria-labelledby="pf-cb-label">
              {{ $filters.decimal2(CurrentBalance) }}
            </span>
          </div>
          <div class="portfolio-field">
            <span class="text-xs block text-gray-500" id="pf-pnl-label">
              Current P&L
            </span>
            <span :class="FgColor" aria-labelledby="pf-pnl-label">
              {{ $filters.decimal2(TotalPortfolioAmount) }}
            </span>
          </div>
          <div class="portfolio-field">
            <span class="text-xs block text-gray-500" id="pf-nav-label">NAV</span>
            <span :class="FgColor" aria-labelledby="pf-nav-label">
              {{ $filters.decimal2(NAV) }}%
            </span>
          </div>
        </div>

        <div class="portfolio-actions">
          <button
            class="btn dark:text-orange-400 tooltip view"
            type="button"
            :aria-label="getLableConst.addNewStrategy"
            @click="onAddNewStrategy()"
          >
            <i class="material-icons" aria-hidden="true">playlist_add</i>
            <tooltip :Value="getLableConst.addNewStrategy" />
          </button>
          <button
            class="btn tooltip view"
            type="button"
            aria-label="Edit Portfolio"
            @click="onEditPortfolio(Portfolio)"
          >
            <i class="material-icons" aria-hidden="true">edit</i>
            <tooltip Value="Edit Portfolio" />
          </button>
          <button
            class="btn edit tooltip"
            type="button"
            aria-label="Save Portfolio"
            @click="onSavePortfolio(Portfolio)"
          >
            <i class="material-icons" aria-hidden="true">save</i>
            <tooltip Value="Save Portfolio" />
          </button>
          <button
            class="btn ml-1 tooltip text-red-700 dark:text-red-700 view"
            type="button"
            aria-label="Delete Portfolio"
            @click="onDeletePortfolio(Portfolio)"
          >
            <i class="material-icons" aria-hidden="true">delete_forever</i>
            <tooltip Value="Delete Portfolio" />
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
import { inject } from "vue";
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
      const name = portfolio?.name || "this portfolio";
      if (
        !window.confirm(
          "Delete portfolio \"" + name + "\"? This cannot be undone."
        )
      ) {
        return;
      }
      this.DeletePortfolio(portfolio);
    },
  },
  mixins: [myMixins],
  data: function () {
    return {
      isEdit: false,
      editPortfolio: null,
    };
  },
  setup() {
    let getLableConst = inject("GETCONST");
    return { getLableConst };
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
  display: inline-flex;
}
.isPortfolioEdit .view {
  display: none;
}
.portfolio-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.portfolio-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem 1rem;
}
.portfolio-field {
  min-width: 0;
}
.portfolio-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
}
@media (min-width: 768px) {
  .portfolio-meta {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (min-width: 1024px) {
  .portfolio-header {
    flex-direction: row;
    align-items: flex-start;
    gap: 0.5rem;
  }
  .portfolio-meta {
    flex: 1;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 0.5rem;
  }
  .portfolio-actions {
    flex-shrink: 0;
    margin-left: auto;
    padding-top: 0.25rem;
  }
}
</style>
