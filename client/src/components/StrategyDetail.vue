<template>
  <div class="card mb-2 bg-grey-custom">
    <!-- @click="SelectedStrategy(Strategy)" -->
    <div class="card-header">
      <div class="d-flex">
        <div class="p-2 align-self-center">
          <h5>{{ Strategy.name }}</h5>
        </div>
        <div class="p-2">
          <i class="btn btn-danger bi bi-trash"></i>
        </div>
        <div class="ml-auto p-2">
          <h5 class="float-right">
            Created On:
            {{ Strategy.CreatedOn }}
          </h5>
        </div>
      </div>
    </div>

    <div class="card-body">
      <ul v-if="Strategy.Trades" class="list-group list-group-flush">
        <li
          :key="Trade._id.$oid"
          v-for="Trade in Strategy.Trades"
          class="list-group-item"
        >
          <button class="btn btn-dark" @click="DeleteTrade(Strategy, Trade)">
            {{ Trade.Name }}
          </button>
        </li>
      </ul>
      <div class="TradeAddEditPlaceholder">
        <TradeAddEdit v-if="Strategy.IsEdit" :ParentStrategy="Strategy" />
      </div>
    </div>
    <div class="card-footer text-dark">
      <div class="col-lg-12">
        <a class="btn btn-warning float-right" @click="CreateNewTrade()">
          <i class="bi bi-plus-square"></i>
          <!-- <i v-show="isEdit" class="bi bi-save"></i> -->
          Add New Trade
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import TradeAddEdit from "./TradeAddEdit";
export default {
  name: "StrategyDetail",
  components: { TradeAddEdit },

  props: { Strategy: { type: Object } },
  methods: {
    ...mapActions(["ShowNewTrade", "RemoveTrade", "SetSelectedStrategy"]),
    CreateNewTrade() {
      if (this.Strategy.IsEdit) {
        this.Strategy.IsEdit = false;
      } else {
        this.$set(this.Strategy, "IsEdit", true);
        //console.log(this.Strategy);
        //this.SetSelectedStrategy(this.Strategy);
      }
    },
    DeleteTrade(_strategy, _trade) {
      this.RemoveTrade({ _strategy, _trade });
    },
  },
};
</script>
