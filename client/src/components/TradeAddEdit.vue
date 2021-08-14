<template>
  <div class="list-group list-group-flush bg-grey-custom">
    <div class="row text-white">
      <div>{{ PropStrategy.BindingValues.symbol }}</div>
      <div>{{ PropStrategy.BindingValues.lotsize }}</div>
      <div class="col-md-2">
        <div>
          <input
            class="form-control"
            type="text"
            v-model="PropStrategy.BindingValues.selectedstrike"
          />
          <input
            placeholder="Strike Price"
            type="range"
            :min="PropStrategy.BindingValues.strikepricemin"
            :max="PropStrategy.BindingValues.strikepricemax"
            :step="PropStrategy.BindingValues.strikepricestep"
            v-model.number="PropStrategy.BindingValues.selectedstrike"
            class="form-control-range"
            id="formControlRange"
          />
        </div>
      </div>

      <div class="col-md-1 pl-4">
        <div class="btn-group btn-group-toggle">
          <label
            class="btn btn btn-secondary"
            v-for="(value, key) in BUYORSELL"
            :key="key"
            :class="{
              'text-success': key == 1,
              'text-danger': key == 2,
              active: value == [PropStrategy.BindingValues.buyorsell],
            }"
          >
            <input
              type="radio"
              name="tradeTypename"
              :value="value"
              :id="'trade_' + value"
              v-model="PropStrategy.BindingValues.buyorsell"
            />
            {{ value }}
          </label>
        </div>
      </div>

      <div class="col-md-2 pl-5">
        <div class="btn-group btn-group-toggle">
          <label
            class="btn btn-secondary text-white"
            v-for="(value, key) in TRADETYPE"
            :key="key"
            :class="{ active: value == [PropStrategy.BindingValues.tradetype] }"
          >
            <input
              type="radio"
              name="TRADETYPE"
              :value="value"
              :id="'tradeSymbol_' + value"
              v-model="PropStrategy.BindingValues.tradetype"
            />
            {{ value }}
          </label>
        </div>
      </div>

      <div class="col-md-2">
        <input
          placeholder="Price"
          type="number"
          v-model.number="PropStrategy.BindingValues.spotprice"
          class="form-control"
          id="formSpotPrice"
        />
      </div>
      <div class="col-md-2">
        <input
          placeholder="Quantity"
          type="number"
          v-model.number="PropStrategy.BindingValues.quantity"
          class="form-control"
          id="formSpotPrice"
        />
      </div>
      <div class="col-md-2">
        <textarea
          placeholder="Note"
          type="number"
          v-model.number="PropStrategy.BindingValues.note"
          class="form-control"
          id="formSpotPrice"
        ></textarea>
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
      BUYORSELL: {
        1: "Buy",
        2: "Sell",
      },
      TRADETYPE: {
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
