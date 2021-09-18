<template>
  <div
    class="mx-3 my-3 rounded drop-shadow-md bg-gray-200 dark:bg-gray-700"
    :class="{ isStrategyEdit: PropStrategy == editStrategy }"
  >
    <div class="p-3 border- border-b-2 border-gray-300 dark:border-gray-600">
      <div class="grid grid-cols-10">
        <div class="col-span-2">
          <span class="view">
            {{ PropStrategy.name }}
          </span>
          <input
            class="form-control edit"
            placeholder="Strategy Name"
            v-model="PropStrategy.name"
            @keydown.enter="onSaveStrategy()"
          />
        </div>
        <div class="col-span-2" v-if="!PropStrategy.ismultiplesymbol">
          <span class="view">
            {{ PropStrategy.symbol }}
          </span>

          <input
            class="form-control edit"
            placeholder="Symbol"
            v-model="PropStrategy.symbol"
            @keydown.enter="onSaveStrategy()"
          />
        </div>
        <div class="col-span-2">
          <label>
            <input
              type="checkbox"
              v-model="PropStrategy.ismultiplesymbol"
              @click="onSaveStrategy()"
            />
            Is Multiple Symbol
          </label>
        </div>
        <div class="col-span-2">
          Created On:
          {{ PropStrategy.CreatedOn }}
        </div>
        <div class="col-span-2">
          <div class="float-right">
            <a
              class="btn inline-block view"
              @click="onEditStrategy(PropStrategy)"
            >
              <i class="material-icons">edit</i>
              {{ txtEditStrategy }}
            </a>

            <a class="btn inline-block edit" @click="onSaveStrategy()">
              <i class="material-icons">save</i>
              {{ txtSaveStrategy }}
            </a>
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
          />
        </div>
        <div class="col-span-1">
          <div class="chartplaceholder">
            <div class="chart">
              <!-- CHART COMES HERE -->
            </div>
            <div class="col-span-1">
              <input
                type="number"
                v-model="PropStrategy.x0"
                placeholder="min"
                min="0"
                class="chart-mini-edit "
              />
              <input
                type="number"
                v-model="PropStrategy.x1"
                placeholder="max"
                min="0"
                class="chart-mini-edit  float-right "
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="p-3 grid grid-cols-2">
      <div class="col-span-1 space-x-2">
        <a class="btn inline-block text-red-600" @click="onDeleteStrategy()">
          <i class="material-icons">delete</i>
        </a>
        <a class="btn inline-block" @click="onDuplicateStrategy()">
          <i class="material-icons">content_copy</i>
          {{ txtDuplicateStrategy }}
        </a>
        <select class="btn" @change="onMoveStrategy($event)">
          <option value="Select">Move To Other Portfolio</option>
          <option
            :key="item._id"
            v-for="item in Portfolios"
            v-bind:value="item._id"
          >
            {{ item.name }}
          </option>
        </select>
      </div>
      <div class="col-span-1">
        <div class="float-right space-x-2">
          <a
            v-if="!PropStrategy.ismultiplesymbol"
            class="btn inline-block view"
            @click="onShowChart()"
          >
            <i class="material-icons">show_chart</i>
            {{ txtShowStratergyDiagram }}
          </a>

          <a class="btn inline-block" @click="onBindAddEditTrade()">
            <i class="material-icons">add</i>
            {{ txtAddTrade }}
          </a>
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
    }),
  },
  mounted: function () {
    this.onShowChart();
  },
  data: function () {
    return {
      txtEditStrategy: this.$getConst("editStrategy"),
      txtSaveStrategy: this.$getConst("saveStrategy"),
      txtShowStratergyDiagram: this.$getConst("showStrategyDiagram"),
      txtAddTrade: this.$getConst("addTrade"),
      txtDuplicateStrategy: this.$getConst("duplicateStrategy"),
      editStrategy: null,
    };
  },
  methods: {
    ...mapActions({
      EditStrategy: "strategyModule/EditStrategy",
      DeleteStrategy: "strategyModule/DeleteStrategy",
      BindAddEditTrade: "tradeModule/BindAddEditTrade",
      MoveStrategy: "strategyModule/MoveStrategy",
    }),
    onEditStrategy(strategy) {
      this.editStrategy = strategy;
    },
    onSaveStrategy() {
      this.editStrategy = null;
      this.EditStrategy(this.PropStrategy);
    },
    onDeleteStrategy() {
      this.DeleteStrategy({ _id: this.PropStrategy._id });
    },
    onDuplicateStrategy() {
      var _startegyClone = { ...this.PropStrategy };
      _startegyClone._id = null;
      _startegyClone.trades.forEach((t) => {
        t._id = undefined;
      });
      this.EditStrategy(_startegyClone);
    },
    onBindAddEditTrade() {
      if (this.TradeDetail) {
        this.BindAddEditTrade(null);
      } else {
        this.BindAddEditTrade(this.PropStrategy);
      }
    },
    onShowChart() {
      this.GenerateChart(this.PropStrategy, {
        x0: this.PropStrategy.x0,
        x1: this.PropStrategy.x1,
      });
    },
    onMoveStrategy(event) {
      this.MoveStrategy({
        Strategy: this.PropStrategy,
        PortfolioID: event.target.value,
      });
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

