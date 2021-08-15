<template>
  <div class="card bg-dark text-light order-window" v-if="TradeDetail">
    <div class="card-header">
      <!-- {{ TradeDetail.symbol }} -->
      <!-- -{{ TradeDetail.lotsize }} -->
    </div>
    <div class="card-body">
      <input
        class="form-control"
        type="text"
        v-model="TradeDetail.selectedstrike"
      />
      <input
        placeholder="Strike Price"
        type="range"
        :min="TradeDetail.strikepricemin"
        :max="TradeDetail.strikepricemax"
        :step="TradeDetail.strikepricestep"
        v-model.number="TradeDetail.selectedstrike"
        class="form-control-range"
        id="formControlRange"
      />
      <div class="btn-group btn-group-toggle">
        <label
          class="btn btn btn-secondary"
          v-for="(value, key) in BUYORSELL"
          :key="key"
          :class="{
            'text-success': key == 1,
            'text-danger': key == 2,
            active: value == [TradeDetail.buyorsell],
          }"
        >
          <input
            type="radio"
            name="tradeTypename"
            :value="value"
            :id="'trade_' + value"
            v-model="TradeDetail.buyorsell"
          />
          {{ value }}
        </label>
      </div>
      <div class="btn-group btn-group-toggle">
        <label
          class="btn btn-secondary text-white"
          v-for="(value, key) in TRADETYPE"
          :key="key"
          :class="{ active: value == [TradeDetail.tradetype] }"
        >
          <input
            type="radio"
            name="TRADETYPE"
            :value="value"
            :id="'tradeSymbol_' + value"
            v-model="TradeDetail.tradetype"
          />
          {{ value }}
        </label>
      </div>
      <input
        placeholder="Price"
        type="number"
        v-model.number="TradeDetail.spotprice"
        class="form-control"
        id="formSpotPrice"
      />

      <input
        placeholder="Quantity"
        type="number"
        v-model.number="TradeDetail.quantity"
        class="form-control"
        id="formSpotPrice"
      />

      <textarea
        placeholder="Note"
        type="number"
        v-model.number="TradeDetail.note"
        class="form-control"
        id="formSpotPrice"
      ></textarea>

      <a class="btn btn-warning" @click="onAddEditTrade()" href="#"> Save </a>

     
    </div>
  </div>

  <!-- <div
    v-if="TradeDetail"
    class="bg-grey-custom"
    style="
      position: fixed;
      bottom: 0px;
      top: auto;
      right: 0px;
      width: 600px;
      height: 200px;
    ">
    <div class="row text-white">

      <div>{{ TradeDetail.symbol }}</div>
      <div>{{ TradeDetail.lotsize }}</div>

      <div class="row">
        <div class="col-md-2">
          <div>
            <input
              class="form-control"
              type="text"
              v-model="TradeDetail.selectedstrike"
            />
            <input
              placeholder="Strike Price"
              type="range"
              :min="TradeDetail.strikepricemin"
              :max="TradeDetail.strikepricemax"
              :step="TradeDetail.strikepricestep"
              v-model.number="TradeDetail.selectedstrike"
              class="form-control-range"
              id="formControlRange"
            />
          </div>
        </div>
        <div class="col-md-1">
          <div class="btn-group btn-group-toggle">
            <label
              class="btn btn btn-secondary"
              v-for="(value, key) in BUYORSELL"
              :key="key"
              :class="{
                'text-success': key == 1,
                'text-danger': key == 2,
                active: value == [TradeDetail.buyorsell],
              }"
            >
              <input
                type="radio"
                name="tradeTypename"
                :value="value"
                :id="'trade_' + value"
                v-model="TradeDetail.buyorsell"
              />
              {{ value }}
            </label>
          </div>
        </div>
        <div class="col-md-2">
          <div class="btn-group btn-group-toggle">
            <label
              class="btn btn-secondary text-white"
              v-for="(value, key) in TRADETYPE"
              :key="key"
              :class="{ active: value == [TradeDetail.tradetype] }"
            >
              <input
                type="radio"
                name="TRADETYPE"
                :value="value"
                :id="'tradeSymbol_' + value"
                v-model="TradeDetail.tradetype"
              />
              {{ value }}
            </label>
          </div>
        </div>
        <div class="col-md-2">
          <input
            placeholder="Price"
            type="number"
            v-model.number="TradeDetail.spotprice"
            class="form-control"
            id="formSpotPrice"
          />
        </div>
        <div class="col-md-2">
          <input
            placeholder="Quantity"
            type="number"
            v-model.number="TradeDetail.quantity"
            class="form-control"
            id="formSpotPrice"
          />
        </div>
        <div class="col-md-2">
          <textarea
            placeholder="Note"
            type="number"
            v-model.number="TradeDetail.note"
            class="form-control"
            id="formSpotPrice"
          ></textarea>
        </div>
        <div class="col-md-2 text-dark">
          <a class="btn btn-warning" @click="onAddEditTrade()"> Save </a>
        </div>
      </div>
    </div>
  </div> -->
</template>
<script>
import { mapActions, mapState } from "vuex"; //mapGetters,
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
  computed: {
    ...mapState(["TradeDetail"]),
  },
  methods: {
    ...mapActions(["AddEditTrade"]),
    onAddEditTrade() {
      this.AddEditTrade(this.TradeDetail);
    },
  },
  created() {},
};
</script>
<style scoped>
.order-window {
  position: fixed;
  bottom: 0px;
  top: auto;
  right: 100px;
  width: 800px;
  height: 400px;
}

/* .btn.focus,
input[type="text"] {
  outline: none !important;
  box-shadow: none !important;
}
.form-control-range {
  height: 35px;
} */
</style>
