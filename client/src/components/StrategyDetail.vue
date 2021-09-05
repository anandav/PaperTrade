<template>
  <div
    class="mx-3 mt-1 rounded bg-gray-200 dark:bg-gray-600"
    :class="{ isStrategyEdit: PropStrategy == editStrategy }"
  >
    <div class=" p-3 border- border-b-2 border-gray-300 dark:border-gray-400">
      <div class="grid grid-cols-8">
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
      </div>
    </div>

    <div class="p-3">
      <div class="grid grid-cols-2">
        <div class="col-span-1">
          <TradeList :PropStrategy="PropStrategy" />
        </div>
        <div class="col-span-1">
          <div class="ml-5 chartplaceholder"></div>
        </div>
      </div>
    </div>

    <div class="p-3 grid grid-cols-2">
      <div class="col-span-1">
        <div class="float-left">
          <a class="btn text-red-600" @click="onDeleteStrategy()">
            <i class="material-icons">delete</i>
          </a>
          <a class="btn ml-1" @click="onDuplicateStrategy()">
            <i class="material-icons">content_copy</i>
            {{ txtDuplicateStrategy }}
          </a>
        </div>
      </div>
      <div class="col-span-1">
        <div class="float-right">
          <a
            v-if="!PropStrategy.ismultiplesymbol"
            class="btn ml-2 view"
            @click="onShowChart()"
          >
            <i class="material-icons">show_chart</i>
            {{ txtShowStratergyDiagram }}
          </a>

          <a class="btn ml-2" @click="onBindAddEditTrade()">
            <i class="material-icons">add</i>
            {{ txtAddTrade }}
          </a>

          <a class="btn ml-2 view" @click="onEditStrategy(PropStrategy)">
            <i class="material-icons">edit</i>
            {{ txtEditStrategy }}
          </a>

          <a class="btn ml-2 edit" @click="onSaveStrategy()">
            <i class="material-icons">save</i>
            {{ txtSaveStrategy }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
//import TradeInlineEdit from "./TradeInlineEdit";
import TradeList from "./TradeList";
import myMixins from "../shared/utilitymixins";

export default {
  name: "StrategyDetail",
  components: { TradeList },
  computed: {
    ...mapState(["TradeDetail"]),
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
    ...mapActions(["EditStrategy", "DeleteStrategy", "BindAddEditTrade"]),
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
      this.GenerateChart(this.PropStrategy);
    },
  },
  mixins: [myMixins],
  props: { PropStrategy: { type: Object }, PropTrade: { type: Object } },
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

