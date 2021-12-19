<template>
  <div
    class="
      mx-3
      my-3
      rounded
      border
      drop-shadow-md
      bg-gray-200
      dark:bg-gray-800
      border-gray-300
      dark:border-gray-700
    "
    :class="{ isStrategyEdit: editStrategy == PropStrategy._id  }"
  >
    <!-- rounded-t bg-gradient-to-br from-yellow-400 to-yellow-500 -->

    <div class="p-3 border-b border-gray-300 dark:border-gray-600">
      <div class="flex">
        <div class="flex-1">
          <label class="text-xs block text-gray-500"> Name </label>
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
        <div class="flex-1" v-if="!PropStrategy.ismultiplesymbol">
          <label class="text-xs block text-gray-500"> Symbol </label>
          <span class="view">
            {{ PropStrategy.symbol }}
          </span>

          <autocomplete
            :Value="PropStrategy.symbol"
            :Items="Symbols"
            @keyup="onSymbolKeyUp"
            @save="onSaveStrategy"
            PlaceHolder="Symbol"
          />

          <!-- <input
            class="normal-edit edit"
            placeholder="Symbol"
            v-model="PropStrategy.symbol"
            @keydown.enter="onSaveStrategy()"
          /> -->
        </div>

        <div class="flex-1">
          <label class="text-xs block text-gray-500"> Symbol Type </label>
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

          <!-- <input
            class="normal-edit edit"
            placeholder="Symbol Type"
            v-model="PropStrategy.symboltype"
          /> -->
        </div>
        <div class="flex-1">
          <label class="text-xs block text-gray-500"> Lot Size </label>
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
          <label class="text-xs block text-gray-500"> Expiry </label>
          <span class="view">
            {{ PropStrategy.expiry | formatDate }}
          </span>

          <input
            class="normal-edit edit"
            placeholder="Expiry"
            v-model="PropStrategy.expiry"
            @keydown.enter="onSaveStrategy()"
          />
<!-- 
          <autocomplete
            :Value="PropStrategy.expiry"
            @keyup="onSymbolTypeKeyUp"
            @save="onSaveStrategy"
            :Items="PropStrategy.expiries"
            PlaceHolder="Expiry"
          /> -->

        </div>
        <div class="flex-1">
          <label class="text-xs block text-gray-500"> Strike Price Step </label>
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
          <label class="text-xs block text-gray-500"> Created On </label>
          {{ PropStrategy.createdon | formatDateTime }}
        </div>

        <div class="flex-1">
          <div class="float-right space-x-2">
            <dropdown
              class="inline-block view tooltip"
              :Icon="`join_full`"
              :Items="CurrentPortfoliosStrategies"
              :Type="`Strategy`"
              @itemclicked="onDropDownItemClicked"
              :ExcludeItem="PropStrategy._id"
              :Tooltip="txtMergeStrategy"
              v-if="!this.PropStrategy.isarchive"
            >
            </dropdown>
            <dropdown
              class="inline-block view tooltip"
              :ExcludeItem="PropStrategy.portfolio"
              :Icon="`trending_flat`"
              :Items="Portfolios"
              :Type="`Portfolios`"
              @itemclicked="onDropDownItemClicked"
              :Tooltip="txtMoveStrategy"
            >
              <!-- v-if="!this.PropStrategy.isarchive" -->
            </dropdown>

            <dropdown
              class="inline-block view tooltip"
              :Icon="`menu`"
              :Items="StrategyAction"
              :Type="`Menu`"
              @itemclicked="onActionDropDownItemClicked"
              :ExcludeItem="ExcluteStrategyAction"
              Tooltip="Action"
            >
            </dropdown>

            <button
              class="btn tooltip view"
              @click="onEditStrategy(PropStrategy)"
              v-if="!this.PropStrategy.isarchive"
            >
              <i class="material-icons">edit</i>
              <tooltip :Value="txtEditStrategy" />
            </button>

            <button class="btn tooltip edit" @click="onSaveStrategy()">
              <i class="material-icons">save</i>
              <tooltip :Value="txtSaveStrategy" />
            </button>

            <button
              class="btn text-red-700 dark:text-red-700 tooltip"
              @dblclick="onDeleteStrategy()"
            >
              <i class="material-icons">delete_forever</i>
              <tooltip :Value="txtDeleteStrategy" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="p-3">
      <div class="grid grid-cols-2" v-if="!this.PropStrategy.isarchive">
        <div class="col-span-1">
          <TradeList
            :PropStrategy="PropStrategy"
            :PropSelectedTraded="SelectedTraded"
          />
          <!-- @onItemEnterKeyPressed="onShowChart" -->
        </div>
        <div class="col-span-1">
          <div class="chartplaceholder">
            <div class="chart">
              <!-- CHART COMES HERE -->
            </div>
            <div class="col-span-1 mt-3">
              <input
                type="number"
                v-model="PropStrategy.x0"
                placeholder="min"
                min="0"
                class="chart-mini-edit ml-5"
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

    <div class="p-3 grid grid-cols-2" v-if="!this.PropStrategy.isarchive">
      <div class="col-span-1 space-x-2">
        <button class="btn tooltip" @click="onBindAddEditTrade()">
          <i class="material-icons">add</i>
          <tooltip :Value="txtAddTrade" />
        </button>
        <button
          class="btn tooltip"
          v-if="this.Portfolio.exchange && this.PropStrategy.symbol"
          @click="onGetLiveData()"
        >
          <i class="material-icons">file_download</i>
          <tooltip :Value="txtGetLiveData" />
        </button>
      </div>
      <div class="col-span-1">
        <div class="float-right space-x-2">
          <button
            v-if="!PropStrategy.ismultiplesymbol"
            class="btn tooltip view"
            @click="onShowChart()"
          >
            <i class="material-icons">show_chart</i>
            <tooltip :Value="txtShowStratergyDiagram" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
//import TradeInlineEdit from "./TradeInlineEdit";
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
    if(this.PropStrategy.isedit){
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
        { _id: "1", name: "Duplicate", icon: "content_copy",  },
        { _id: "2", name: "Archive", icon: "archive",  },
        { _id: "3", name: "Unarchive", icon: "archive", },
      ],
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
      // this.StrategySymbolChange({
      //   portfolio: this.Portfolio,
      //   strategy,
      //   action: "getexpiries",
      // }).then((x) => {
      //   this.editStrategy = strategy._id;
      // });
    },
    onSaveStrategy: function () {
      this.editStrategy = null;

      var result = this.Symbols.forEach((x) => {
        if (x.name == this.PropStrategy.symbol) {
          this.PropStrategy.symboltype = x.symboltype;
          this.PropStrategy.lotsize = x.lotsize;
        }
      });
      this.EditStrategy(this.PropStrategy);
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
    onActionDropDownItemClicked: function (type, id, name) {
      if (name == "Duplicate") {
        var _startegyClone = { ...this.PropStrategy };
        _startegyClone._id = undefined;
        _startegyClone.createdon = new Date();
        _startegyClone.trades.forEach((t) => {
          t._id = undefined;
        });
        this.EditStrategy(_startegyClone);
      } else if (name == "Archive" || name == "Unarchive") {
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
    onGetLiveData: function () {
      this.GetLiveData({
        portfolio: this.Portfolio,
        strategy: this.PropStrategy,
      }).then(() => {
        //this.EditStrategy(this.PropStrategy);
      });
    },
    onSymbolChange: function (Value) {
      // this.PropStrategy.symbol = Value;
      // this.GetLiveData({"portfolio": this.Portfolio,"strategy": this.PropStrategy,"action" : "detail"})
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
.form-control {
  width: 200px;
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

