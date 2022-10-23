<template>
  <div class=" mx-3 my-3 rounded border drop-shadow-md border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-800
    " :class="{ isStrategyEdit: editStrategy == PropStrategy._id }">
    <div class="p-3 border-b border-gray-300 dark:border-gray-700">
      <div class="flex">
        <div class="flex-1">
          <label class="text-xxs block text-gray-500"> Name </label>
          <span class="view">
            {{ PropStrategy.name }}
          </span>
          <input class="normal-edit edit" placeholder="Strategy Name" v-model="PropStrategy.name"
            @keydown.enter="onSaveStrategy()" />
        </div>
        <div class="flex-1" v-if="!PropStrategy.ismultiplesymbol">
          <label class="text-xxs block text-gray-500"> Symbol </label>
          <span class="view">
            {{ PropStrategy.symbol }}
          </span>

          <autocomplete :Value="PropStrategy.symbol" :Items="Symbols" @keyup="onSymbolKeyUp" @save="onSaveStrategy"
            PlaceHolder="Symbol" />
        </div>
        <div class="flex-1">
          <label class="text-xxs block text-gray-500"> Symbol Type </label>
          <span class="view">
            {{ PropStrategy.symboltype }}
          </span>
          <autocomplete :Value="PropStrategy.symboltype" :Items="SymbolTypes" @keyup="onSymbolTypeKeyUp"
            @save="onSaveStrategy" PlaceHolder="Symbol Types" />
        </div>
        <div class="flex-1">
          <label class="text-xxs block text-gray-500"> Lot Size </label>
          <span class="view">
            {{ PropStrategy.lotsize }}
          </span>

          <input class="normal-edit edit" placeholder="Lot Size" v-model="PropStrategy.lotsize"
            @keydown.enter="onSaveStrategy()" />
        </div>
        <div class="flex-1">
          <label class="text-xxs block text-gray-500"> Expiry </label>
          <span class="view">
            {{ PropStrategy.expiry  }}
          </span>

          <input class="normal-edit edit" placeholder="Expiry" v-model="PropStrategy.expiry"
            @keydown.enter="onSaveStrategy()" />
        </div>
        <div class="flex-1">
          <label class="text-xxs block text-gray-500"> Strike Price Step </label>
          <span class="view">
            {{ PropStrategy.strikepricestep }}
          </span>

          <input class="normal-edit edit" placeholder="Strike Price Step" v-model="PropStrategy.strikepricestep"
            @keydown.enter="onSaveStrategy()" />
        </div>
        <div class="flex-1">
          <label class="text-xxs block text-gray-500"> Created On </label>
          {{ PropStrategy.createdon | formatDateTime }}
        </div>
        <div class="flex-2">
          <div class="float-right space-x-2">
            <!-- <button class="btn dark:text-orange-400 tooltip view" @click="onBindAddEditTrade()"
              v-if="!this.PropStrategy.isarchive">
              <i class="material-icons">playlist_add</i>
              <tooltip :Value="txtAddTrade" />
            </button> -->

            <button class="btn tooltip view" @click="onEditStrategy(PropStrategy)" v-if="!this.PropStrategy.isarchive">
              <i class="material-icons">edit</i>
              <tooltip :Value="txtEditStrategy" />
            </button>

            <button class="btn tooltip edit" @click="onSaveStrategy()">
              <i class="material-icons">save</i>
              <tooltip :Value="txtSaveStrategy" />
            </button>

            <dropdown class="inline-block tooltip view" :Icon="`join_full`" :Items="CurrentPortfoliosStrategies"
              :Type="`Strategy`" :ExcludeItem="PropStrategy._id" :Tooltip="txtMergeStrategy" :MinItem="3"
              @itemclicked="onDropDownItemClicked" v-if="!this.PropStrategy.isarchive">
            </dropdown>
            <dropdown class="inline-block tooltip view" :ExcludeItem="PropStrategy.portfolio" :Icon="`trending_flat`"
              :Items="Portfolios" :Type="`Portfolios`" :Tooltip="txtMoveStrategy"
              :MinItem="PropStrategy.isarchive? 0 : 3" @itemclicked="onDropDownItemClicked">

            </dropdown>

            <dropdown class="inline-block tooltip view" :Icon="`menu`" :Items="StrategyAction" :Type="`Menu`"
              @itemclicked="onActionDropDownItemClicked" :ExcludeItem="ExcluteStrategyAction" Tooltip="Action">
            </dropdown>

            <button class="btn text-red-700 dark:text-red-700 tooltip view" @dblclick="onDeleteStrategy()">
              <i class="material-icons">delete_forever</i>
              <tooltip :Value="txtDeleteStrategy" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="p-3">

      <div class="w-1 cursor-pointer float-right" v-if="!this.PropStrategy.isarchive" @click="onHideChart();">
        <i class="material-icons text-xxs" :class="hideChart?'hidden':''">
          keyboard_double_arrow_right
        </i>
        <i class="material-icons text-xxs" :class="hideChart?'':'hidden'">
          keyboard_double_arrow_left
        </i>
      </div>
      <div class="grid grid-cols-12" v-if="!this.PropStrategy.isarchive">
        <div :class="{'col-span-12': hideChart, 'col-span-6' : !hideChart}">
          <TradeList :PropStrategy="PropStrategy" :PropSelectedTraded="SelectedTraded" />
        </div>

        <div :class="{'hidden': hideChart, 'col-span-6' : !hideChart}">
          <div class="chartplaceholder ">
            <div class="">
              <input type="number" v-model="PropStrategy.x0" placeholder="min" min="0" class="chart-mini-edit ml-12"
                @keydown.enter="onShowChart()" />
              <input type="number" v-model="PropStrategy.x1" placeholder="max" min="0"
                class="chart-mini-edit float-right" @keydown.enter="onShowChart()" />
            </div>
            <div class="chart">
            </div>
          </div>
        </div>

      </div>
      <div class="grid" v-if="this.PropStrategy.isarchive">
        <TradeList :PropStrategy="PropStrategy" :PropSelectedTraded="SelectedTraded"
          @onItemEnterKeyPressed="onShowChart" />
      </div>
    </div>
  </div>
</template>
<script>
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
  },
  mounted: function () {
    if (!this.PropStrategy.isarchive) {
      this.PortfolioLoad({
        portfolio: this.Portfolio,
        action: "init",
      });
    }
    if (this.PropStrategy.isedit) {
      this.editStrategy = this.PropStrategy._id;
    }
  },
  data: function () {
    return {
      txtEditStrategy: this.$getConst("editStrategy"),
      txtSaveStrategy: this.$getConst("saveStrategy"),
      txtShowStratergyDiagram: this.$getConst("showStrategyDiagram"),
      txtAddTrade: this.$getConst("addTrade"),
      txtGetLiveData: this.$getConst("getLiveData"),
      txtDuplicateStrategy: this.$getConst("duplicateStrategy"),
      txtDeleteStrategy: this.$getConst("deleteStrategy"),
      txtMergeStrategy: this.$getConst("mergeStrategy"),
      txtMoveStrategy: this.$getConst("moveStrategy"),
      editStrategy: null,
      StrategyAction: [
        { _id: "1", name: "Duplicate", displaytext: "Duplicate", icon: "content_copy" },
        { _id: "2", name: "Archive", displaytext: "Archive", icon: "archive" },
        { _id: "3", name: "Unarchive", displaytext: "Restore", icon: "archive" },
      ],
      hideChart: this.PropStrategy.hidechart,
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
      PortfolioLoad: "dataModule/PortfolioLoad",
      StrategySymbolChange: "dataModule/StrategySymbolChange",
    }),

    onEditStrategy: function (strategy) {
      this.editStrategy = strategy._id;
    },
    onSaveStrategy: function () {
      this.editStrategy = null;
      this.Symbols.forEach((x) => {
        if (x.name == this.PropStrategy.symbol) {
          this.PropStrategy.symboltype = x.symboltype;
        }
      });
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
    },
    onSymbolTypeKeyUp: function (Value) {
      this.PropStrategy.symboltype = Value;
    },
    onHideChart: function () {
      this.PropStrategy.hidechart = this.hideChart = !this.hideChart;
      this.onSaveStrategy();
    },
  },
  mixins: [myMixins],
  props: {
    PropStrategy: { type: Object },
    PropTrade: { type: Object },
    SelectedTraded: { type: Array },
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

