<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">
      <div class="row">
        <div class="form-group col-2">
          <label>Example label {{ gender }}</label>
          <div class="btn-group btn-group-toggle" >
            <label
              class=" btn"
              v-for="(value, key) in tradeBS"
              :key="key"
              :class="{
                'btn-outline-success': key == 1,
                'btn-outline-danger': key == 2,
                'active': value == [BuyOrSell]
              }">
              <input
                type="radio"
                name="tradebsname"
                :value="value"
                :id="'trade_' + value"
                v-model.number="BuyOrSell"
              />
              {{ value }}
            </label>
          </div>
        </div>
        <div class="form-group col-3">
          <label>Test label</label>
          <div class="btn-group btn-group-toggle" data-toggle="buttons">
            <label
              class="btn btn-outline-secondary"
              :class="{ active: key == 1 }"
              v-for="(value, key) in tradetype"
              :key="key"
            >
              <input type="radio" name="options" :id="'option' + key" />
              {{ value }}
            </label>
          </div>
        </div>
        <div class="form-group col-3">
          <label for="formControlRange">Strike Price</label>
          <input
            type="range"
            :min="9000"
            :max="12000"
            step="50"
            @input="onStrikeRangeChanging($event)"
            @change="onStrikeRangeChanged($event)"
            class="form-control-range"
            id="formControlRange"
          />
        </div>
        <div class="form-group col-2">
          <label for="">Price</label>
          <input
            type="text"
            class="text form-control"
            v-model="this.getLatestPrice"
          /><input
            type="hidden"
            class="text form-control"
            v-model="this.SelectedStrikePrice"
          />
        </div>
      </div>
      <div class="form-group  row">
        <div class="pull-right">
          <label for="">Action</label>
          <div class="btn-group  ">
            <button class="btn btn-outline-primary">Save</button>
            <button class="btn btn-outline-danger">Clear</button>
          </div>
        </div>
      </div>





    </li>
  </ul>
</template>
<script>

import { mapActions, mapGetters, mapState } from "vuex";
//import { utilitymixins } from '../shared/utilitymixins'
 export default {
  name: "TradeAddEdit",
  //mixins : [utilitymixins],

  data () {
    return {
     BuyOrSell: "",
     
      tradeBS: {
        1: "Buy",
        2: "Sell",
      },
      tradetype: {
        1: "Call",
        2: "Put",
        3: "Future",
      },
    };
  },

  methods: {
    ...mapActions([
      "GetInstrumentDetail",
      "OnStrikePriceRangeChanging",
      "OnStrikePriceRangeChanged",
    ]),
    onStrikeRangeChanging(evt) {
      this.OnStrikePriceRangeChanging(evt);
    },
    onStrikeRangeChanged(evt) {
      var searchQuery = {
        underlying: "NIFTY",
        optionType: "put",
        strikePrice: evt.target.value,
        expiryDate: "",
      };
      this.OnStrikePriceRangeChanged(searchQuery);
    },
  },
  created() {
   // this.utilitymixins.foo();

    this.GetInstrumentDetail();
  },
  computed: {
    ...mapState(["SelectedStrikePrice"]),
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
