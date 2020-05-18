<template>
  <div class="card mb-2">
    <h5 class="card-header">{{Strategy.Name}}</h5>
    <div class="card-body">
      <h5 class="card-title">Created On: {{Strategy.CreatedOn.$date}}</h5>

      <ul v-if="Strategy.Trades">
        <li :key="trade._id.$oid" v-for="trade in Strategy.Trades">
          <button class="btn btn-dark" @click="SaveTrade(trade)">{{trade.Name}}</button>
        </li>
      </ul>

      <!-- <p
            class="card-text"
      >With supporting text below as a natural lead-in to additional content.</p>-->
      <div class="TradeAddEditPlaceholder">
        <TradeAddEdit  v-show="Strategy.IsEdit" />
      </div>
    </div>
    <div class="card-footer">
      <div class="col-lg-12">
        <div class="row float-right">
          <button class="btn btn-outline-primary" @click="ShowMyNewTrade(Strategy)">Add Trade</button>
          <button class="btn btn-danger">Delete Stratergy</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapActions} from 'vuex';
import TradeAddEdit from "./TradeAddEdit";
export default {
  name: "StrategyDetail",
  components: { TradeAddEdit },
  props: { Strategy: { type: Object } },
  methods: {
    ...mapActions(['ShowNewTrade']),
     ShowMyNewTrade(_strategy) {
       this.ShowNewTrade(_strategy);
     }
  }
};
</script>