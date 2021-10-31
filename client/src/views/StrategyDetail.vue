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
    :class="{ isStrategyEdit: PropStrategy == editStrategy }"
  >
    <div class="p-3 border- border-b-2 border-gray-300 dark:border-gray-600">
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

          <input
            class="normal-edit edit"
            placeholder="Symbol"
            v-model="PropStrategy.symbol"
            @keydown.enter="onSaveStrategy()"
          />
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
          {{ PropStrategy.createdon | formatDate }}
        </div>

        <div class="flex-1">
          <div class="float-right space-x-2">
            <button class="btn tooltip " @click="onDuplicateStrategy()">
              <i class="material-icons">content_copy</i>
              <tooltip :Value="txtDuplicateStrategy" />
            </button>
            <DropDown
              class="inline-block tooltip"
              :Icon="`join_full`"
              :Items="CurrentPortfoliosStrategies"
              :Type="`Strategy`"
              @itemclicked="onDropDownItemClicked"
              :ExcludeItem="PropStrategy._id"
            >
            </DropDown>
            <DropDown
              class="inline-block tooltip"
              :Icon="`trending_flat`"
              :Items="Portfolios"
              :Type="`Portfolios`"
              @itemclicked="onDropDownItemClicked"
              :ExcludeItem="PropStrategy.portfolio"
            >
            </DropDown>

            <button
              class="btn tooltip view"
              @click="onEditStrategy(PropStrategy)"
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
              <i class="material-icons">delete</i>
              <tooltip :Value="txtDeleteStrategy" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="p-3">
      <div class="grid grid-cols-2">
        <div class="col-span-1">
          <TradeList
            :PropStrategy="PropStrategy"
            :PropSelectedTraded="SelectedTraded"
            @onItemEnterKeyPressed="onShowChart"
          />
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
    </div>

    <div class="p-3 grid grid-cols-2">
      <div class="col-span-1 space-x-2">
        <button class="btn tooltip" @click="onBindAddEditTrade()">
          <i class="material-icons">add</i>
          <tooltip :Value="txtAddTrade" />
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
import myMixins from "../shared/utilitymixins";

export default {
  name: "StrategyDetail",
  components: { TradeList },
  computed: {
    ...mapGetters({
      TradeDetail: "tradeModule/TradeDetail",
      Portfolios: "portfolioModule/Portfolios",
      CurrentPortfoliosStrategies: "strategyModule/Strategies",
    }),
  },
  mounted: function () {},
  data: function () {
    return {
      txtEditStrategy: this.$getConst("editStrategy"),
      txtSaveStrategy: this.$getConst("saveStrategy"),
      txtShowStratergyDiagram: this.$getConst("showStrategyDiagram"),
      txtAddTrade: this.$getConst("addTrade"),
      txtDuplicateStrategy: this.$getConst("duplicateStrategy"),
      txtDeleteStrategy: this.$getConst("deleteStrategy"),
      editStrategy: null,
    };
  },
  methods: {
    ...mapActions({
      EditStrategy: "strategyModule/EditStrategy",
      DeleteStrategy: "strategyModule/DeleteStrategy",
      BindAddEditTrade: "tradeModule/BindAddEditTrade",
      MoveStrategy: "strategyModule/MoveStrategy",
      MergeStrategy: "strategyModule/MergeStrategy",
    }),

    onEditStrategy: function (strategy) {
      this.editStrategy = strategy;
    },
    onSaveStrategy: function () {
      this.editStrategy = null;
      this.EditStrategy(this.PropStrategy);
    },
    onDeleteStrategy: function () {
      this.DeleteStrategy({ _id: this.PropStrategy._id });
    },
    onDuplicateStrategy: function () {
      var _startegyClone = { ...this.PropStrategy };
      _startegyClone._id = null;
      _startegyClone.trades.forEach((t) => {
        t._id = undefined;
      });
      this.EditStrategy(_startegyClone);
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

