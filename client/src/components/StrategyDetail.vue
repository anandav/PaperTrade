<template>
  <!-- @click="SelectedStrategy(PropStrategy)" -->

  <div
    class="card mb-2 bg-grey-custom"
    :class="{ isStrategyEdit: PropStrategy == editStrategy }"
  >
    <div class="card-header">
      <div class="d-flex justify-content-between bd-highlight">
        <div class="">
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

        <div class="" v-if="!PropStrategy.ismultiplesymbol">
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

        <div class="" v-if="!PropStrategy.ismultiplesymbol">
          <span class="view">
            {{ PropStrategy.ste }}
          </span>

          <input
            class="form-control edit"
            placeholder="Symbol"
            v-model="PropStrategy.symbol"
            @keydown.enter="onSaveStrategy()"
          />
        </div>
        <div class="">
          <label>
            <input
              type="checkbox"
              v-model="PropStrategy.ismultiplesymbol"
              @click="onSaveStrategy()"
            />
            Is Multiple Symbol
          </label>
        </div>
        <div class="">
          Created On:
          {{ PropStrategy.CreatedOn }}
        </div>
      </div>
    </div>

    <div class="card-body">
      <div class="flex">
        <div class="">
          <TradeList :PropStrategy="PropStrategy" />
        </div>
        <div class=" ml-5 chartplaceholder "></div>
      </div>
    </div>
    <div class="card-footer text-dark">
      <div class="p-2 float-left">
        <a class="btn btn-danger ml-2" @click="onDeleteStrategy()">
          <i class="bi bi-trash"></i>
        </a>
      </div>
      <div class="p-2 float-left">
        <a class="btn btn-warning ml-2" @click="onDuplicateStrategy()">
          <i class="bi bi-clipboard-plus"></i>
        </a>
      </div>
      <div class="float-right">
        <a
          v-if="!PropStrategy.ismultiplesymbol"
          class="btn btn-warning ml-2 view"
          @click="onShowChart()"
        >
          <i class="bi bi-graph-up"></i>
          {{ txtShowStratergyDiagram }}
        </a>

        <a class="btn btn-warning ml-2" @click="onBindAddEditTrade()">
          <i class="bi-plus-square"></i>
          {{ txtAddTrade }}
        </a>

        <a
          class="btn btn-warning ml-2 view"
          @click="onEditStrategy(PropStrategy)"
        >
          <i class="bi bi-pencil"></i>
          {{ txtEditStrategy }}
        </a>

        <a class="btn btn-warning ml-2 edit" @click="onSaveStrategy()">
          <i class="bi bi-save"></i>
          {{ txtSaveStrategy }}
        </a>
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
  created: function () {},
  data: function () {
    return {
      txtEditStrategy: this.$getConst("editStrategy"),
      txtSaveStrategy: this.$getConst("saveStrategy"),
      txtShowStratergyDiagram: this.$getConst("showStrategyDiagram"),
      txtAddTrade: this.$getConst("addTrade"),
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

