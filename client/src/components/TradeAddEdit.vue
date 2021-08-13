<template>
  <div class="list-group list-group-flush bg-grey-custom">
    <div class="row text-white">
      <div class="col-md-2">
        <div>
          <input
            class="form-control"
            type="text"
            v-model="PropStrategy.BindingValues.SelectedStrikePrice"
          />
          <input
            placeholder="Strike Price"
            type="range"
            :min="PropStrategy.BindingValues.StrikePriceMin"
            :max="PropStrategy.BindingValues.StrikePriceMax"
            :step="PropStrategy.BindingValues.StrikePriceStep"
            v-model.number="PropStrategy.BindingValues.SelectedStrikePrice"
            class="form-control-range"
            id="formControlRange"
          />
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
              active: value == [PropStrategy.BindingValues.BuyOrSell],
            }"
          >
            <input
              type="radio"
              name="tradeTypename"
              :value="value"
              :id="'trade_' + value"
              v-model="PropStrategy.BindingValues.BuyOrSell"
            />
            {{ value }}
          </label>
        </div>
      </div>

      <div class="col-md-2 pl-5">
        <div class="btn-group btn-group-toggle">
          <label
            class="btn btn-secondary text-white"
            v-for="(value, key) in tradeSymbol"
            :key="key"
            :class="{ active: value == [PropStrategy.BindingValues.Type] }"
          >
            <input
              type="radio"
              name="tradeSymbol"
              :value="value"
              :id="'tradeSymbol_' + value"
              v-model="PropStrategy.BindingValues.Type"
            />
            {{ value }}
          </label>
        </div>
      </div>

      <div class="col-md-2">
        <input
          placeholder="Price"
          type="number"
          v-model.number="PropStrategy.BindingValues.SpotPrice"
          class="form-control"
          id="formSpotPrice"
        />
      </div>

      <div class="col-md-2 text-dark">
        <a class="btn btn-warning" @click="onAddEditTrade()"> Save </a>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex"; //mapGetters, mapState
export default {
  name: "TradeAddEdit",
  data() {
    return {
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
    PropStrategy: {},
  },
  computed: {},
  methods: {
    ...mapActions(["AddEditTrade"]),
    onAddEditTrade() {
      this.AddEditTrade(this.PropStrategy);
    },
  },
  created() {},
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
