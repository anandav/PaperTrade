<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">
      <div class="row">
        <div class="col-md-1 mb-3">
          <label>Buy & Sell</label>
          <div class="btn-group btn-group-toggle">
            <label
              class="btn"
              v-for="(value, key) in tradeBS"
              :key="key"
              :class="{
                'btn-outline-success': key == 1,
                'btn-outline-danger': key == 2,
                'active': value == [TradeDetail.BuyOrSell]
              }"
            >
              <input
                type="radio"
                name="tradebsname"
                :value="value"
                :id="'trade_' + value"
                v-model="TradeDetail.BuyOrSell"
              />
              {{value}}
            </label>
          </div>
        </div>

        <div class="col-md-2 mb-3">
          <label>Type</label>
          <div class="btn-group btn-group-toggle">
            <label
              class="btn btn-outline-secondary"
              v-for="(value, key) in tradeType"
              :key="key"
              :class="{ 'active':  value == [TradeDetail.Type] }"
            >
              <input
                type="radio"
                name="tradetype"
                :value="value"
                :id="'tradetype_' + value"
                v-model="TradeDetail.Type"
              />
              {{value}}
            </label>
          </div>
        </div>

        <div class="col-md-2 mb-3">
          <label>Striker Price</label>
          <div class>
            <input
              type="range"
              :min="70"
              :max="80"
              step="0.25"
              v-model.number="TradeDetail.SelectedStrikePrice"
              class="form-control-range"
              id="formControlRange"
            />

            <span style="float: left; display:block">{{TradeDetail.SelectedStrikePrice}}</span>
          </div>
        </div>
        <div class="col-md-2 mb-3">
          <label>Spot Price</label>
          <div class>
            <input
              type="number"
              v-model.number="TradeDetail.SpotPrice"
              class="form-control"
              id="formSpotPrice"
            />
          </div>
        </div>

        <div class="form-group">
          <div class="btn-group" role="group" style="margin-top:30px;">
            <button type="button" class="btn btn-outline-secondary" @click="onSaveTrade();">Save</button>
            <button type="button" class="btn btn-outline-secondary">Cancel</button>
           </div>
        </div>
      </div>
      <div class="form-group row">
        <div class="pull-right">
          <!-- <label for>Action</label> -->
        </div>
      </div>
    </li>
  </ul>
</template>
<script>
import { mapActions, mapGetters, mapState } from "vuex"; //, mapState
//import { utilitymixins } from '../shared/utilitymixins'
export default {
  name: "TradeAddEdit",
  //mixins : [utilitymixins],

  data() {
    return {
      TradeDetail: {
        BuyOrSell: "",
        Type: "",
        SelectedStrikePrice: 75,
        SpotPrice: 0.0,
      },

      tradeBS: {
        1: "Buy",
        2: "Sell",
      },
      tradeType: {
        1: "Call",
        2: "Put",
        3: "Future",
      },
    };
  },
  props: { selectedPrice: { type: Number, default: 0 },
  ParentStrategy :{}
  },
  methods: {
    ...mapActions([
      "GetInstrumentDetail",
      "OnStrikePriceRangeChanging",
      "OnStrikePriceRangeChanged",
      "TradeAddEdit"
    ]),
    onStrikeRangeChanging(evt) {
      //this.selectedPrice = evt.target.value;
      this.OnStrikePriceRangeChanging(evt);
    },
    onStrikeRangeChanged(evt) {
      console.log("test");
      var searchQuery = {
        underlying: "NIFTY",
        optionType: "put",
        strikePrice: evt.target.value,
        expiryDate: "",
      };
      this.OnStrikePriceRangeChanged(searchQuery);
    },
    onSaveTrade() {
      //this.Strategy.Trades.push(this.TradeDetail);
      console.log(this.ParentStrategy);
      console.log(this.TradeDetail);
      this.TradeAddEdit(this.Strategy,this.TradeDetail );
    },
  },
  created() {
    // this.utilitymixins.foo();
    //this.GetInstrumentDetail();
  },
  computed: {
     ...mapState(["Strategy"]),//"SelectedStrikePrice"
    ...mapGetters(["getLatestPrice"]),
  },

};
</script>
<style scoped>
.btn.focus,
input[type="text"] {
  outline: none !important;
  box-shadow: none !important;
}
.form-control-range {
  height: 35px;
}
</style>
