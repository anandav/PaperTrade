<template>
  <div
    class="list-group list-group-flush bg-grey-custom"
    data-id="ParentStrategy._id"
  >
    <div class="row text-white">
      <div class="col-sm col-md-2">
        <div class>
          <input
            type="range"
            :min="14000"
            :max="17000"
            step="50"
            v-model.number="TradeDetail.SelectedStrikePrice"
            class="form-control-range"
            id="formControlRange"
          />

          <span>{{ TradeDetail.SelectedStrikePrice }}</span>
        </div>
      </div>

      <div class="col-sm col-md-2">
        <div class>
          <input
            placeholder="Price"
            type="number"
            v-model.number="TradeDetail.SpotPrice"
            class="form-control"
            id="formSpotPrice"
          />
        </div>
      </div>

      <div class="col-sm col-md-8">
        <div class="btn-group btn-group-toggle">
          <label
            class="btn btn-sm"
            v-for="(value, key) in tradeType"
            :key="key"
            :class="{
              'btn-outline-success': key == 1,
              'btn-outline-danger': key == 2,
              active: value == [TradeDetail.BuyOrSell],
            }"
          >
            <input
              type="radio"
              name="tradeTypename"
              :value="value"
              :id="'trade_' + value"
              v-model="TradeDetail.BuyOrSell"
            />
            {{ value }}
          </label>
        </div>
     
        <div class="ml-2 btn-group btn-group-toggle">
          <label
            class="btn btn-outline-secondary btn-sm"
            v-for="(value, key) in tradeSymbol"
            :key="key"
            :class="{ active: value == [TradeDetail.Type] }"
          >
            <input
              type="radio"
              name="tradeSymbol"
              :value="value"
              :id="'tradeSymbol_' + value"
              v-model="TradeDetail.Type"
            />
            {{ value }}
          </label>
        </div>
     
        <div class="col-md-8">
          <a class="btn btn-outline-secondary" @click="onSaveTrade()"> Save </a>
          <a class="btn btn-outline-secondary"> Cancel </a>
        </div>
      </div>
    </div>
  </div>
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
        SelectedStrikePrice: 16300,
        SpotPrice: null,
      },

      tradeType: {
        1: "Buy",
        2: "Sell",
      },
      tradeSymbol: {
        1: "Call",
        2: "Put",
        3: "Future",
      },
    };
  },
  props: { selectedPrice: { type: Number, default: 0 }, ParentStrategy: {} },
  methods: {
    ...mapActions([
      "GetInstrumentDetail",
      "OnStrikePriceRangeChanging",
      "OnStrikePriceRangeChanged",
      "SaveTrade",
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
      this.SaveTrade(this.Strategy, this.TradeDetail);
    },
  },
  created() {
    // this.utilitymixins.foo();
    //this.GetInstrumentDetail();
  },
  computed: {
    ...mapState(["Strategy"]), //"SelectedStrikePrice"
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
