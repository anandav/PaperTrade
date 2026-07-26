<template>
  <div
    class="
      strategy-card
      mx-2
      sm:mx-3
      my-3
      rounded
      border
      drop-shadow-md
      border-gray-300
      dark:border-gray-700
      bg-gray-100
      dark:bg-gray-800
    "
    :class="{ isStrategyEdit: editStrategy == PropStrategy._id }"
  >
    <div class="p-3 border-b border-gray-300 dark:border-gray-700">
      <div class="strategy-header">
        <div class="strategy-meta">
          <div class="strategy-field">
            <label
              class="text-xs block text-gray-500"
              :for="'st-name-' + PropStrategy._id"
            >
              Name
            </label>
            <span class="view">
              {{ PropStrategy.name }}
            </span>
            <input
              class="normal-edit edit"
              :id="'st-name-' + PropStrategy._id"
              placeholder="Strategy Name"
              v-model="PropStrategy.name"
              @keydown.enter="onSaveStrategy()"
            />
          </div>
          <div class="strategy-field">
            <label
              class="text-xs block text-gray-500"
              :for="'st-type-' + PropStrategy._id"
            >
              Symbol Type
            </label>
            <span class="view">
              {{ PropStrategy.symboltype }}
            </span>
            <autocomplete
              :Value="PropStrategy.symboltype"
              :Items="SymbolTypes"
              :inputId="'st-type-' + PropStrategy._id"
              AriaLabel="Symbol Type"
              @keyup="onSymbolTypeKeyUp"
              @change="onSymbolTypeKeyUp"
              @save="onSymbolTypeSave"
              PlaceHolder="Symbol Types"
            />
          </div>
          <div class="strategy-field" v-if="!PropStrategy.ismultiplesymbol">
            <label
              class="text-xs block text-gray-500"
              :for="'st-symbol-' + PropStrategy._id"
            >
              Symbol
            </label>
            <span class="view">
              {{ PropStrategy.symbol }}
            </span>

            <autocomplete
              :Value="PropStrategy.symbol"
              :Items="SymbolsForType"
              :inputId="'st-symbol-' + PropStrategy._id"
              AriaLabel="Symbol"
              @keyup="onSymbolKeyUp"
              @change="onSymbolKeyUp"
              @save="onSymbolSave"
              PlaceHolder="Symbol"
            />
          </div>
          <div class="strategy-field">
            <label
              class="text-xs block text-gray-500"
              :for="'st-lot-' + PropStrategy._id"
            >
              Lot Size
            </label>
            <span class="view">
              {{ PropStrategy.lotsize }}
            </span>

            <input
              class="normal-edit edit"
              :id="'st-lot-' + PropStrategy._id"
              placeholder="Lot Size"
              v-model="PropStrategy.lotsize"
              @keydown.enter="onSaveStrategy()"
            />
          </div>
          <div class="strategy-field">
            <label
              class="text-xs block text-gray-500"
              :for="'st-exp-' + PropStrategy._id"
            >
              Expiry
            </label>
            <span class="view">
              {{ $filters.formatDateTime(PropStrategy.expiry) }}
            </span>

            <input
              type="date"
              class="normal-edit edit"
              :id="'st-exp-' + PropStrategy._id"
              placeholder="Expiry"
              v-model="PropStrategy.expiry"
              @keydown.enter="onSaveStrategy()"
            />
          </div>
          <div class="strategy-field">
            <label
              class="text-xs block text-gray-500"
              :for="'st-step-' + PropStrategy._id"
            >
              Strike Price Step
            </label>
            <span class="view">
              {{ PropStrategy.strikepricestep }}
            </span>

            <input
              class="normal-edit edit"
              :id="'st-step-' + PropStrategy._id"
              placeholder="Strike Price Step"
              v-model="PropStrategy.strikepricestep"
              @keydown.enter="onSaveStrategy()"
            />
          </div>
          <div class="strategy-field">
            <span class="text-xs block text-gray-500"> Created On </span>
            {{ $filters.formatDateTime(PropStrategy.createdon) }}
          </div>
        </div>
        <div class="strategy-actions">
          <button
            class="btn tooltip view"
            type="button"
            :aria-label="getLableConst.editStrategy"
            @click="onEditStrategy(PropStrategy)"
            v-if="!this.PropStrategy.isarchive"
          >
            <i class="material-icons" aria-hidden="true">edit</i>
            <tooltip
              :Value="getLableConst.editStrategy"
              Location="above end"
            />
          </button>

          <button
            class="btn tooltip view"
            type="button"
            :aria-label="
              hideChart ? getLableConst.showGraph : getLableConst.hideGraph
            "
            :disabled="!canShowPayoffChart && hideChart"
            @click="onHideChart()"
            v-if="!this.PropStrategy.isarchive"
          >
            <i class="material-icons" aria-hidden="true">{{
              hideChart ? "show_chart" : "hide_source"
            }}</i>
            <tooltip
              :Value="
                canShowPayoffChart || !hideChart
                  ? hideChart
                    ? getLableConst.showGraph
                    : getLableConst.hideGraph
                  : 'Add call, put, or future trades to show payoff'
              "
              Location="above end"
            />
          </button>

          <button
            class="btn tooltip edit"
            type="button"
            :aria-label="getLableConst.saveStrategy"
            @click="onSaveStrategy()"
          >
            <i class="material-icons" aria-hidden="true">save</i>
            <tooltip
              :Value="getLableConst.saveStrategy"
              Location="above end"
            />
          </button>

          <dropdown
            class="inline-block tooltip view"
            :Icon="`join_full`"
            :Items="CurrentPortfoliosStrategies"
            :Type="`Strategy`"
            :ExcludeItem="PropStrategy._id"
            :Tooltip="getLableConst.mergeStrategy"
            TooltipLocation="above end"
            :MinItem="3"
            @itemclicked="onDropDownItemClicked"
            v-if="!this.PropStrategy.isarchive"
          >
          </dropdown>
          <dropdown
            class="inline-block tooltip view"
            :ExcludeItem="PropStrategy.portfolio"
            :Icon="`trending_flat`"
            :Items="Portfolios"
            :Type="`Portfolios`"
            :Tooltip="getLableConst.moveStrategy"
            TooltipLocation="above end"
            :MinItem="PropStrategy.isarchive ? 0 : 3"
            @itemclicked="onDropDownItemClicked"
          >
          </dropdown>

          <dropdown
            class="inline-block tooltip view"
            :Icon="`menu`"
            :Items="StrategyAction"
            :Type="`Menu`"
            @itemclicked="onActionDropDownItemClicked"
            :ExcludeItem="ExcluteStrategyAction"
            Tooltip="Action"
            TooltipLocation="above end"
          >
          </dropdown>

          <button
            class="btn text-red-700 dark:text-red-700 tooltip view"
            type="button"
            :aria-label="getLableConst.deleteStrategy"
            @click="onDeleteStrategy()"
          >
            <i class="material-icons" aria-hidden="true">delete_forever</i>
            <tooltip
              :Value="getLableConst.deleteStrategy"
              Location="above end"
            />
          </button>
        </div>
      </div>
    </div>
    <div class="p-2 sm:p-3">
      <div class="strategy-body" v-if="!this.PropStrategy.isarchive">
        <div class="strategy-trades" :class="{ 'with-chart': !hideChart }">
          <TradeList
            :PropStrategy="PropStrategy"
            :PropSelectedTraded="SelectedTraded"
          />
        </div>

        <div class="strategy-chart" :class="{ hidden: hideChart }">
          <div v-if="!canShowPayoffChart" class="chart-empty">
            <p>
              No payoff to plot yet. Add at least one call, put, or future trade,
              then open the graph again.
            </p>
          </div>
          <div v-else class="chartplaceholder">
            <div class="chart-range">
              <input
                type="number"
                v-model="PropStrategy.x0"
                placeholder="Min strike"
                min="0"
                class="chart-mini-edit"
                aria-label="Payoff chart minimum strike"
                @keydown.enter="onShowChart()"
              />
              <input
                type="number"
                v-model="PropStrategy.x1"
                placeholder="Max strike"
                min="0"
                class="chart-mini-edit"
                aria-label="Payoff chart maximum strike"
                @keydown.enter="onShowChart()"
              />
            </div>
            <p class="chart-help">
              Payoff by strike. Hover the line for simulated P&amp;L at a strike.
              Press Enter in min or max to redraw.
            </p>
            <div
              class="chart"
              role="img"
              :aria-label="
                'Payoff chart for ' +
                (PropStrategy.name || 'strategy') +
                ', strike range ' +
                (PropStrategy.x0 || 'auto') +
                ' to ' +
                (PropStrategy.x1 || 'auto')
              "
            ></div>
          </div>
        </div>
      </div>
      <div class="grid" v-if="this.PropStrategy.isarchive">
        <TradeList
          :PropStrategy="PropStrategy"
          :PropSelectedTraded="SelectedTraded"
          @onItemEnterKeyPressed="onShowChart"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { inject } from "vue";
import { mapActions, mapGetters } from "vuex";
import TradeList from "./TradeList";
import myMixins from "../shared/chart";

export default {
  name: "StrategyDetail",
  components: { TradeList },

  computed: {
    ...mapGetters({
      TradeDetail: "tradeModule/TradeDetail",
      Portfolios: "portfolioModule/Portfolios",
      Portfolio: "portfolioModule/Portfolio",
      CurrentPortfoliosStrategies: "strategyModule/Strategies",
      Symbols: "dataModule/Symbols",
      SymbolTypes: "dataModule/SymbolTypes",
    }),
    ExcluteStrategyAction: {
      get: function () {
        return this.PropStrategy.isarchive ? "2" : "3";
      },
    },
    SymbolsForType: function () {
      const type = (this.PropStrategy.symboltype || "").toLowerCase();
      if (!type || !this.Symbols?.length) {
        return this.Symbols || [];
      }
      return this.Symbols.filter(
        (x) => (x.symboltype || "").toLowerCase() === type
      );
    },
    canShowPayoffChart: function () {
      return this.hasDerivative(this.PropStrategy);
    },
  },
  mounted: function () {
    if (this.PropStrategy.isedit) {
      this.editStrategy = this.PropStrategy._id;
    }
  },
  data: function () {
    return {
      editStrategy: null,
      StrategyAction: [
        {
          _id: "1",
          name: "Duplicate",
          displaytext: "Duplicate",
          icon: "content_copy",
        },
        { _id: "2", name: "Archive", displaytext: "Archive", icon: "archive" },
        {
          _id: "3",
          name: "Unarchive",
          displaytext: "Restore",
          icon: "archive",
        },
      ],
      hideChart: true,
    };
  },
  methods: {
    ...mapActions({
      EditStrategy: "strategyModule/EditStrategy",
      DeleteStrategy: "strategyModule/DeleteStrategy",
      BindAddEditTrade: "tradeModule/BindAddEditTrade",
      MoveStrategy: "strategyModule/MoveStrategy",
      MergeStrategy: "strategyModule/MergeStrategy",
      GetLiveData: "dataModule/GetLiveData",
      StrategySymbolChange: "dataModule/StrategySymbolChange",
    }),

    onEditStrategy: function (strategy) {
      this.editStrategy = strategy._id;
    },
    onSaveStrategy: function () {
      this.editStrategy = null;
      const type = (this.PropStrategy.symboltype || "").toLowerCase();
      const symbol = this.PropStrategy.symbol;
      let match = null;
      if (symbol && this.Symbols?.length) {
        if (type) {
          match = this.Symbols.find(
            (x) =>
              x.name == symbol &&
              (x.symboltype || "").toLowerCase() === type
          );
        }
        if (!match && !type) {
          match = this.Symbols.find((x) => x.name == symbol);
          if (match) {
            this.PropStrategy.symboltype = match.symboltype;
          }
        }
      }
      if (match?.lotsize) {
        this.PropStrategy.lotsize = match.lotsize;
      }
      this.EditStrategy(this.PropStrategy);
      this.GenerateChart(this.PropStrategy);
    },
    onDeleteStrategy: function () {
      const name = this.PropStrategy?.name || "this strategy";
      if (
        !window.confirm(
          "Delete strategy \"" +
            name +
            "\" and its trade legs? You cannot undo this action."
        )
      ) {
        return;
      }
      this.DeleteStrategy({ _id: this.PropStrategy._id });
    },
    onBindAddEditTrade: function () {
      this.BindAddEditTrade(this.PropStrategy);
    },
    onShowChart: function () {
      this.GenerateChart(this.PropStrategy);
    },
    onDropDownItemClicked: function (type, id) {
      if (type == "Portfolios") {
        this.MoveStrategy({
          Strategy: this.PropStrategy,
          PortfolioID: id,
        });
      } else if (type == "Strategy") {
        this.MergeStrategy({
          SourceStrategy: this.PropStrategy,
          DestinationStrategyID: id,
        });
      }
    },
    onActionDropDownItemClicked: function (type, id) {
      if (id == 1) {
        var _startegyClone = { ...this.PropStrategy };
        _startegyClone._id = undefined;
        _startegyClone.createdon = new Date();
        _startegyClone.trades.forEach((t) => {
          t._id = undefined;
        });
        this.EditStrategy(_startegyClone);
      } else if (id == 2 || id == 3) {
        this.PropStrategy.isarchive = !this.PropStrategy.isarchive;
        this.EditStrategy(this.PropStrategy);
      }
    },
    asTextValue: function (Value) {
      if (Value == null) {
        return "";
      }
      if (typeof Value === "string") {
        return Value;
      }
      if (typeof Value === "number") {
        return String(Value);
      }
      return "";
    },
    onSymbolKeyUp: function (Value) {
      const text = this.asTextValue(Value);
      this.PropStrategy.symbol = text;
      if (!text || !this.Symbols?.length) {
        return;
      }
      const matches = this.Symbols.filter((x) => x.name == text);
      if (matches.length === 1) {
        this.PropStrategy.symboltype = matches[0].symboltype;
        if (matches[0].lotsize) {
          this.PropStrategy.lotsize = matches[0].lotsize;
        }
        return;
      }
      const type = (this.PropStrategy.symboltype || "").toLowerCase();
      if (type) {
        const typed = matches.find(
          (x) => (x.symboltype || "").toLowerCase() === type
        );
        if (typed?.lotsize) {
          this.PropStrategy.lotsize = typed.lotsize;
        }
      }
    },
    onSymbolTypeKeyUp: function (Value) {
      const text = this.asTextValue(Value);
      this.PropStrategy.symboltype = text;
      const type = text.toLowerCase();
      if (!type || !this.PropStrategy.symbol) {
        return;
      }
      const ok = this.Symbols?.some(
        (x) =>
          x.name == this.PropStrategy.symbol &&
          (x.symboltype || "").toLowerCase() === type
      );
      if (!ok) {
        this.PropStrategy.symbol = "";
      }
    },
    onSymbolSave: function (Value) {
      this.onSymbolKeyUp(Value);
      this.onSaveStrategy();
    },
    onSymbolTypeSave: function (Value) {
      this.onSymbolTypeKeyUp(Value);
      this.onSaveStrategy();
    },
    onHideChart: function () {
      if (this.hideChart && !this.canShowPayoffChart) {
        return;
      }
      this.PropStrategy.hidechart = this.hideChart = !this.hideChart;
      this.EditStrategy(this.PropStrategy);
      if (!this.hideChart) {
        this.$nextTick(() => {
          this.GenerateChart(this.PropStrategy);
        });
      }
    },
  },
  mixins: [myMixins],
  props: {
    PropStrategy: { type: Object },
    PropTrade: { type: Object },
    SelectedTraded: { type: Array },
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

.edit {
  display: none;
}

.isStrategyEdit .edit {
  display: inline-flex;
}

.isStrategyEdit .view {
  display: none;
}

.isStrategyEdit .dropdown.view {
  display: none;
}

.strategy-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.strategy-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem 1rem;
}

.strategy-field {
  min-width: 0;
}

.strategy-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
}

.strategy-actions .btn,
.strategy-actions .dropdown {
  vertical-align: middle;
}

.strategy-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.strategy-trades {
  min-width: 0;
  width: 100%;
}

.strategy-chart {
  min-width: 0;
  width: 100%;
}

.chart-range {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  padding-left: 0.5rem;
}

.chart {
  max-width: 100%;
  overflow-x: auto;
}

.chart-help {
  margin: 0 0 0.35rem;
  padding: 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  line-height: 1.35;
}

.chart-empty {
  padding: 1rem 0.5rem;
  min-height: 8rem;
  display: flex;
  align-items: center;
}

.chart-empty p {
  margin: 0;
  max-width: 22rem;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.4;
  color: #6b7280;
}

:global(.dark) .chart-help,
:global(.dark) .chart-empty p {
  color: #9ca3af;
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

@media (min-width: 768px) {
  .strategy-meta {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .strategy-header {
    flex-direction: row;
    align-items: flex-start;
  }

  .strategy-meta {
    flex: 1;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.5rem 0.75rem;
  }

  .strategy-actions {
    flex-shrink: 0;
    max-width: 14rem;
    justify-content: flex-end;
  }

  .strategy-body {
    flex-direction: row;
    align-items: flex-start;
  }

  .strategy-trades.with-chart {
    width: 50%;
  }

  .strategy-trades:not(.with-chart) {
    width: 100%;
  }

  .strategy-chart:not(.hidden) {
    width: 50%;
  }
}

@media (min-width: 1280px) {
  .strategy-meta {
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }

  .strategy-actions {
    max-width: none;
  }
}
</style>
