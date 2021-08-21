<template>
  <!-- @click="SelectedStrategy(PropStrategy)" -->
  <div>
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
        <TradeList :PropStrategy="PropStrategy" />
      </div>
      <div class="card-footer text-dark">
        <div class="p-2 float-left">
          <a class="btn btn-danger ml-2" @click="onDeleteStrategy()">
            <i class="bi bi-trash"></i>
          </a>
        </div>
        <div class="float-right">
          <a class="btn btn-warning" @click="onBindAddEditTrade()">
            <i class="bi-plus-square"></i>
            {{txtAddTrade}}
          </a>
          <a
            class="btn btn-warning ml-2 view"
            @click="onEditStrategy(PropStrategy)"
          >
            <i class="bi bi-pencil"></i>
            {{ txtEditSaveStrategy }}
          </a>
          <a
            class="btn btn-secondary ml-2 edit"
            @click="onSaveStrategy()"
          >
            <i class="bi bi-save"></i>
            {{ txtEditSaveStrategy }}
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
export default {
  name: "StrategyDetail",
  components: { TradeList },
  props: { PropStrategy: { type: Object }, PropTrade: { type: Object } },
  methods: {
    ...mapActions(["AddEditStrategy", "DeleteStrategy", "BindAddEditTrade"]),
    onEditStrategy(strategy) {
      this.editStrategy = strategy;
      this.txtEditSaveStrategy = this.$getConst("saveStrategy");
    },
    onSaveStrategy() {
      this.editStrategy = null;
      this.txtEditSaveStrategy = this.$getConst("editStrategy");
      this.AddEditStrategy(this.PropStrategy);
    },
    onDeleteStrategy() {
      this.DeleteStrategy({ _id: this.PropStrategy._id });
    },
    onBindAddEditTrade() {
      if (this.TradeDetail) {
        this.BindAddEditTrade(null);
      } else {
        this.BindAddEditTrade(this.PropStrategy);
      }
    },
  },
  computed: {
    ...mapState(["TradeDetail"]),
  },
  created: function () {},
  data: function () {
    return {
      txtEditSaveStrategy: this.$getConst("editStrategy"),
      txtAddTrade : this.$getConst("addTrade"),
      editStrategy: null,
    };
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

