<template>
  <div
    class="list-group list-group-flush bg-grey-custom"
    
  >
    <div class="row text-white">
      <div class="col-md-2">
        <div>
          <input
            class="form-control"
            type="text"
            v-model="TradeDetail.SelectedStrikePrice"
          />
          <input
            placeholder="Strike Price"
            type="range"
            :min="TradeDetail.StrikePriceMin"
            :max="TradeDetail.StrikePriceMax"
            :step="TradeDetail.StrikePriceStep"
            v-model.number="TradeDetail.SelectedStrikePrice"
            class="form-control-range"
            id="formControlRange"
          />
          <!-- <span>{{ TradeDetail.SelectedStrikePrice }}</span>  -->
        </div>
      </div>

      <div class="col-md-1 pl-4">
        <div class="btn-group btn-group-toggle">
          <label
            class="btn btn btn-secondary"
            v-for="(value, key) in tradeType"
            :key="key"
            :class="{
              'text-success': key == 1,
              'text-danger': key == 2,
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
      </div>
      <div class="col-md-2  pl-5">
        <div class="btn-group btn-group-toggle">
          <label
            class="btn btn-secondary  text-white"
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
      </div>

      <div class="col-md-2">
        <input
          placeholder="Price"
          type="number"
          v-model.number="TradeDetail.SpotPrice"
          class="form-control"
          id="formSpotPrice"
        />
      </div>

      <div class="col-md-2 text-dark">
        <a class="btn btn-warning" @click="onSaveTrade()"> Save </a>
        <!-- <a class="btn btn-danger"> Cancel </a> -->
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
        StrikePriceMin :14000,
        StrikePriceMax : 17000,
        StrikePriceStep : 50,
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
  props: {
    selectedPrice: { type: Number, default: 0 },
   
    ParentStrategy: {},
  },
  methods: {
    ...mapActions([
      "GetInstrumentDetail",
      "OnStrikePriceRangeChanging",
      "OnStrikePriceRangeChanged",
      "SaveTrade",
    ]),
    onStrikeRangeChanging(evt) {
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
