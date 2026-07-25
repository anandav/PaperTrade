<template>
  <div
    class="mx-3 my-3 rounded border drop-shadow-md border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
    :class="{ isStrategyEdit: editStrategy == PropStrategy._id }"
  >
    <div class="p-3 border-b border-gray-300 dark:border-gray-700">
      <div class="flex">
        <div class="flex-1">
          <label class="text-xxs block text-gray-500"> Name </label>
          <span class="view">
            {{ PropStrategy.name }}
          </span>
          <input
            class="normal-edit edit"
            placeholder="Strategy Name"
            v-model="PropStrategy.name"
            @keydown.enter="onSaveStrategy()"
          />
        </div>
        <div class="flex-1">
          <label class="text-xxs block text-gray-500"> Symbol Type </label>
          <span class="view">
            {{ PropStrategy.symboltype }}
          </span>
          <autocomplete
            :Value="PropStrategy.symboltype"
            :Items="SymbolTypes"
            @keyup="onSymbolTypeKeyUp"
            @save="onSaveStrategy"
            PlaceHolder="Symbol Types"
          />
        </div>
        <div class="flex-1" v-if="!PropStrategy.ismultiplesymbol">
          <label class="text-xxs block text-gray-500"> Symbol </label>
          <span class="view">
            {{ PropStrategy.symbol }}
          </span>

          <autocomplete
            :Value="PropStrategy.symbol"
            :Items="SymbolsForType"
            @keyup="onSymbolKeyUp"
            @save="onSaveStrategy"
            PlaceHolder="Symbol"
          />
        </div>
        <div class="flex-1">
          <label class="text-xxs block text-gray-500"> Lot Size </label>
          <span class="view">
            {{ PropStrategy.lotsize }}
          </span>

          <input
            class="normal-edit edit"
            placeholder="Lot Size"
            v-model="PropStrategy.lotsize"
            @keydown.enter="onSaveStrategy()"
          />
        </div>
        <div class="flex-1">
          <label class="text-xxs block text-gray-500"> Expiry </label>
          <span class="view">
            {{ $filters.formatDateTime(PropStrategy.expiry) }}
          </span>

          <input
            type="date"
            class="normal-edit edit"
            placeholder="Expiry"
            v-model="PropStrategy.expiry"
            @keydown.enter="onSaveStrategy()"
          />
        </div>
        <div class="flex-1">
          <label class="text-xxs block text-gray-500">
            Strike Price Step
          </label>
          <span class="view">
            {{ PropStrategy.strikepricestep }}
          </span>

          <input
            class="normal-edit edit"
            placeholder="Strike Price Step"
            v-model="PropStrategy.strikepricestep"
            @keydown.enter="onSaveStrategy()"
          />
        </div>
        <div class="flex-1">
          <label class="text-xxs block text-gray-500"> Created On </label>
          {{ $filters.formatDateTime(PropStrategy.createdon) }}
        </div>
        <div class="flex-2">
          <div class="float-right space-x-2">






            <button
              class="btn tooltip view"
              @click="onEditStrategy(PropStrategy)"
              v-if="!this.PropStrategy.isarchive"
            >
              <i class="material-icons">edit</i>
              <tooltip :Value="getLableConst.editStrategy" />
            </button>

            <button
              class="btn tooltip view"
              @click="onHideChart()"
              v-if="!this.PropStrategy.isarchive"
            >
              <i class="material-icons">{{ hideChart ? "show_chart" : "hide_source" }}</i>
              <tooltip :Value="hideChart ? getLableConst.showGraph : getLableConst.hideGraph" />
            </button>

            <button class="btn tooltip edit" @click="onSaveStrategy()">
              <i class="material-icons">save</i>
              <tooltip :Value="getLableConst.saveStrategy" />
            </button>

            <dropdown
              class="inline-block tooltip view"
              :Icon="`join_full`"
              :Items="CurrentPortfoliosStrategies"
              :Type="`Strategy`"
              :ExcludeItem="PropStrategy._id"
              :Tooltip="getLableConst.mergeStrategy"
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
            >
            </dropdown>

            <button
              class="btn text-red-700 dark:text-red-700 tooltip view"
              @dblclick="onDeleteStrategy()"
            >
              <i class="material-icons">delete_forever</i>
              <tooltip :Value="getLableConst.deleteStrategy" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="p-3">
      <div class="grid grid-cols-12" v-if="!this.PropStrategy.isarchive">
        <div :class="{ 'col-span-12': hideChart, 'col-span-6': !hideChart }">
          <TradeList
            :PropStrategy="PropStrategy"
            :PropSelectedTraded="SelectedTraded"
          />
        </div>

        <div :class="{ hidden: hideChart, 'col-span-6': !hideChart }">
          <div class="chartplaceholder">
            <div class="">
              <input
                type="number"
                v-model="PropStrategy.x0"
                placeholder="min"
                min="0"
                class="chart-mini-edit ml-12"
                @keydown.enter="onShowChart()"
              />
              <input
                type="number"
                v-model="PropStrategy.x1"
                placeholder="max"
                min="0"
                class="chart-mini-edit float-right"
                @keydown.enter="onShowChart()"
              />
            </div>
            <div class="chart"></div>
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
//import logger from "../common/logs";

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
    onSymbolKeyUp: function (Value) {
      this.PropStrategy.symbol = Value;
      if (!Value || !this.Symbols?.length) {
        return;
      }
      const matches = this.Symbols.filter((x) => x.name == Value);
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
      this.PropStrategy.symboltype = Value;
      const type = (Value || "").toLowerCase();
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
    onHideChart: function () {
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
    let getLableConst = inject('GETCONST');
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
  display: inline-block;
}

.isStrategyEdit .view {
  display: none;
}
</style>

