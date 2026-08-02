<template>
  <div class="pt-4 sm:pt-5 pb-4 min-h-full px-2 sm:px-0">
    <div v-if="!Portfolio" class="portfolio-empty-state">
      <p class="portfolio-empty-copy">
        Select a portfolio from the left, or create a new one to get started.
      </p>
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
            aria-label="Edit portfolio"
            @click="onEditPortfolio(Portfolio)"
          >
            <i class="material-icons" aria-hidden="true">edit</i>
            <tooltip Value="Edit portfolio" />
          </button>
          <button
            class="btn edit tooltip"
            type="button"
            aria-label="Save portfolio"
            @click="onSavePortfolio(Portfolio)"
          >
            <i class="material-icons" aria-hidden="true">save</i>
            <tooltip Value="Save portfolio" />
          </button>
          <button
            class="btn ml-1 tooltip text-red-700 dark:text-red-700 view"
            type="button"
            aria-label="Remove portfolio"
            @click.stop="onDeletePortfolio(Portfolio)"
          >
            <i class="material-icons" aria-hidden="true">delete_forever</i>
            <tooltip Value="Remove portfolio" Location="above end" />
          </button>
        </div>
      </div>

      <div class="mt-3">
        <div
          class="strategy-empty"
          v-if="!hasStrategies"
        >
          <p class="strategy-empty-copy">
            No strategies yet. Add a strategy to start paper trading.
          </p>
          <button
            class="btn dark:text-orange-400 tooltip strategy-empty-btn"
            type="button"
            :aria-label="getLableConst.addNewStrategy"
            @click="onAddNewStrategy()"
          >
            <i class="material-icons" aria-hidden="true">playlist_add</i>
            <span class="strategy-empty-action">{{
              getLableConst.addNewStrategy
            }}</span>
            <tooltip
              :Value="getLableConst.addNewStrategy"
              Location="bottom end"
            />
          </button>
        </div>
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
import { confirmDelete } from "../shared/confirmDialog";
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
          const lotsize = this.effectiveLotSize(_startegy);
          _startegy?.trades?.forEach((_trade) => {
            price =
              _trade.buyorsell == "Buy"
                ? price - _trade.price * (lotsize * _trade.quantity)
                : price + _trade.price * (lotsize * _trade.quantity);
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
        const openingbalance = ~~this.Portfolio.openingbalance;
        if (!openingbalance) {
          return 0;
        }
        return (this.CurrentBalance / openingbalance) * 100;
      },
    },
    FgColor: function () {
      return {
        "text-green-700": this.TotalPortfolioAmount >= 0,
        "text-red-700": this.TotalPortfolioAmount < 0,
      };
    },
    hasStrategies: function () {
      return Array.isArray(this.Strategies) && this.Strategies.length > 0;
    },
  },
  methods: {
    ...mapActions({
      AddStrategy: "strategyModule/AddStrategy",
      SavePortfolio: "portfolioModule/SavePortfolio",
      DeletePortfolio: "portfolioModule/DeletePortfolio",
    }),
    onAddNewStrategy: function () {
      if (!this.Portfolio?._id) {
        return;
      }
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
    onDeletePortfolio: async function (portfolio) {
      const target = portfolio || this.Portfolio;
      if (!target || !(target._id || target.id)) {
        return;
      }
      const name = target.name || "this portfolio";
      const ok = await confirmDelete(
        "Remove portfolio \"" +
          name +
          "\" and its strategies from your list? They will no longer appear in PaperTrade.",
        "Remove portfolio"
      );
      if (!ok) {
        return;
      }
      try {
        await this.DeletePortfolio(target);
      } catch (e) {
        console.error(e);
      }
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
.portfolio-empty-state {
  padding: 1.25rem 1rem;
}
.portfolio-empty-copy {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.4;
  color: #6b7280;
}
:global(.dark) .portfolio-empty-copy {
  color: #9ca3af;
}
.strategy-empty {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 0.75rem;
  margin: 0 0.5rem;
  border: 1px dashed #d1d5db;
  border-radius: 0.375rem;
  background: transparent;
}
:global(.dark) .strategy-empty {
  border-color: #4b5563;
}
.strategy-empty-copy {
  margin: 0;
  flex: 1;
  min-width: 0;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #6b7280;
}
:global(.dark) .strategy-empty-copy {
  color: #9ca3af;
}
.strategy-empty-action {
  margin-left: 0.35rem;
  font-size: 0.8125rem;
  line-height: 1;
}
.strategy-empty-btn {
  flex-shrink: 0;
  margin-left: auto;
  width: auto;
  min-width: auto;
  padding: 0 0.65rem;
  height: 2rem;
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
