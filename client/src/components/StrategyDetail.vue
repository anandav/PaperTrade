<template>
  <div class="card mb-2" @click="SelectedStrategy(Strategy)">
    <h5 class="card-header">{{Strategy.Name}}</h5>
    <div class="card-body">
      <h5 class="card-title">Created On: {{Strategy.CreatedOn.$date}}</h5>

      <ul v-if="Strategy.Trades" class="list-group list-group-flush">
        <li :key="Trade._id.$oid" v-for="Trade in Strategy.Trades" class="list-group-item">
          <button class="btn btn-dark" @click="DeleteTrade(Strategy,Trade)">{{Trade.Name}}</button>
        </li>
      </ul>

      <!-- <p
            class="card-text"
      >With supporting text below as a natural lead-in to additional content.</p>-->
      <div class="TradeAddEditPlaceholder">
        <TradeAddEdit v-if="Strategy.IsEdit" ParentStrategy="Strategy" />
      </div>
    </div>
    <div class="card-footer">
      <div class="col-lg-12">
        <div class="btn-group row float-right">
          <button class="btn btn-outline-primary" @click="CreateNewTrade()">Add Trade</button>
          <button class="btn btn-outline-danger">Delete Stratergy</button>
        </div>
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
      }
      //this.ShowNewTrade(_strategy);
    },
    DeleteTrade(_strategy, _trade) {
      this.RemoveTrade({ _strategy, _trade });
    },
    SelectedStrategy(_strategy){
      console.log(_strategy);
      //this.SetSelectedStrategy(_strategy)
    }
  },
};
</script>
