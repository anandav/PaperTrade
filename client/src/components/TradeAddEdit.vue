<template>
  <div
    class="card bg-dark text-light order-window edit"
    @keydown.esc="bindAddEditTrade()"
    v-if="TradeDetail"
  >
    <div id="header" class="card-header" @mousedown="onMyMouseDown">
      <a
        type="button"
        class="close"
        @click="bindAddEditTrade()"
        aria-label="Close"
      >
        <i aria-hidden="true">&times;</i>
      </a>
      <!-- {{ TradeDetail.symbol }} -->
      <!-- -{{ TradeDetail.lotsize }} -->
    </div>
    <div class="card-body">
      <div class="row d-flex">
        <div class="col-sm">
          <input
            class="
              form-control
              border-warning
              bg-transparent
              border border-secondary
              text-white
            "
            placeholder="Strike Step"
            type="number"
            v-model="TradeDetail.strikepricestep"
          />
        </div>
        <div class="col-sm">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <a class="input-group-text bg-dark" @click="onDec(TradeDetail);">-</a>
            </div>
            <input
              v-model="TradeDetail.selectedstrike"
              type="text"
              class="
                form-control text-white
                border-warning
                bg-transparent
                border border-secondary
              "
            />
            <div class="input-group-append">
              <a class="input-group-text bg-dark" @click="onInc(TradeDetail);">+</a>
            </div>
          </div>

          <input
            placeholder="Strike Price"
            type="range"
            :min="TradeDetail.strikepricemin"
            :max="TradeDetail.strikepricemax"
            :step="TradeDetail.strikepricestep"
            v-model.number="TradeDetail.selectedstrike"
            class="form-control-range "
            id="formControlRange"
          />
        </div>
        <div class="col-sm">
          <div class="col-sm btn-group btn-group-toggle">
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
        <div class="col-sm">
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
      </div>

      <div class="d-flex mt-2">
        <div class="col-sm">
          <input
            placeholder="Quantity"
            type="number"
            v-model.number="TradeDetail.quantity"
            class="
              form-control
              bg-transparent
              border border-secondary
              text-white
            "
          />
        </div>

        <div class="col-sm">
          <input
            placeholder="Price"
            type="number"
            v-model.number="TradeDetail.price"
            class="
              form-control
              bg-transparent
              border border-secondary
              text-white
            "
          />
        </div>
        <!-- <textarea
          placeholder="Note"
          type="number"
          v-model.number="TradeDetail.note"
          class="form-control bg-transparent border border-secondary text-white"
        ></textarea> -->
      </div>
      <div class="d-flex mt-2 float-right">
        <a class="btn btn-secondary " @click="onAddEditTrade()" href="#"> Save </a>
        <a class="btn btn-secondary  ml-1" @click="bindAddEditTrade()" href="#">
          Cancel
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import myMixins from "../shared/utilitymixins";
export default {
  name: "TradeAddEdit",
  props: {
    PropStrategy: {},
  },
  computed: {
    ...mapState(["TradeDetail"]),
  },
  methods: {
    ...mapActions(["AddEditTrade", "BindAddEditTrade"]),
    onAddEditTrade: function () {
      this.AddEditTrade(this.TradeDetail).then(() => {
        this.BindAddEditTrade(null);
      });
    },
    bindAddEditTrade: function () {
      this.BindAddEditTrade(null);
    },
    onMyMouseDown: function () {
      console.log("console log");
    }
    ,
    onInc(trade) {
      trade.selectedstrike += parseFloat(trade.strikepricestep);
    },
    onDec(trade) {
      trade.selectedstrike -= parseFloat(trade.strikepricestep);
    },
  },
  mixins: [myMixins],
  created() {},
};
</script>
<style scoped>
.order-window {
  position: fixed;
  bottom: 0px;
  top: auto;
  left: 500px;
  width: 800px;
  height: 250px;
}

/* [v-cloak] {
  display: none;
}
.edit {
  display: none;
}
.isTradeWindowEdit.edit {
   The above  class ("isTradeWindowEdit" and "edit") 
  is applied ONLY for Root node  of edit window  
  display: inline-block;
} */
</style>
