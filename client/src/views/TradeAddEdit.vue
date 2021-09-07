<template>
  <div
    id="neworderpanel"
    class="
      h-96
      absolute
      bottom-0
      items-center
      w-1/3
      left-1/3
      rounded-t-md
      bg-gray-400
      dark:bg-gray-700
      edit
    "
    @keydown.esc="bindAddEditTrade()"
    v-if="TradeDetail"
  >
    <div
      id="header"
      class="bg-clip-border rounded-t p-3 border-b-2 cursor-move"
      :class="TradeDetail.buyorsell == 'Sell' ?  'bg-gradient-to-r from-yellow-800 to-yellow-700' : 'bg-gradient-to-r from-green-700 to-green-800'"
      @mousedown="onMouseDownUp($event)"
    >
      <div class="grid grid-cols-12">
        <div class="col-span-10">
          {{ TradeDetail.symbol }}
        </div>
        <div class="col-span-1">
           <div class="float-right">
          <SwitchButton :PropTrade="TradeDetail" />
        </div>
        </div>
        <div class="col-span-1">
          <div class="float-right">
            <a @click="bindAddEditTrade()" aria-label="Close">
              <i class="material-icons">close</i>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="">
      <div class="m-5 flex flex-row space-x-4">
        <div class="inline-block">
          <input
            class="mini-edit text-right"
            placeholder="Strike Step"
            type="number"
            v-model="TradeDetail.strikepricestep"
          />
        </div>
        <div class="inline-block mx-3">
          <div class="">
            <a
              class="btn-nonrounded rounded-l-sm inline-block"
              @click="onDec(TradeDetail)"
              >-</a
            >
            <input
              v-model="TradeDetail.selectedstrike"
              type="text"
              class="w-24 text-right mini-edit-nonrounded inline-block"
              @keydown.up="onInc(TradeDetail)"
              @keydown.down="onDec(TradeDetail)"
            />
            <a
              class="btn-nonrounded rounded-r-sm inline-block"
              @click="onInc(TradeDetail)"
              >+</a
            >
          </div>

          <!-- <input
            placeholder="Strike Price"
            type="range"
            :min="TradeDetail.strikepricemin"
            :max="TradeDetail.strikepricemax"
            :step="TradeDetail.strikepricestep"
            v-model.number="TradeDetail.selectedstrike"
            class="mt-3"
            id="formControlRange"
          /> -->
        </div>
        <div class="inline-block">
          <label
            class="btn-nonrounded"
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
         <!-- <div class="">
        

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
        </div> -->
      </div>

      <div class="flex flex-row">
        <div class="">
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

        <div class="">
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
      <div class="flex flex-row">
        <a class="btn btn-secondary" @click="onAddEditTrade()" href="#">
          Save
        </a>
        <a class="btn btn-secondary ml-1" @click="bindAddEditTrade()" href="#">
          Cancel
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import SwitchButton from "../components/ui/SwitchButton";
import myMixins from "../shared/utilitymixins";
export default {
  name: "TradeAddEdit",
  data() {
    return {
      clientX: 0,
      clientY: 0,
      mouseX: 0,
      mouseY: 0,
      panel: null,
    };
  },
  props: {
    PropStrategy: {},
  },
  computed: {
    ...mapState(["TradeDetail"]),
  },
  components: {
    SwitchButton,
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
    onMouseDownUp: function (_e) {
      _e.preventDefault();
      this.clientX = _e.clientX;
      this.clientY = _e.clientY;
      document.onmousemove = this.onMouseMove;
      document.onmouseup = this.onMouseLeave;
      this.panel = document.getElementById("neworderpanel");
    },
    onMouseMove: function (_e) {
      _e.preventDefault();
      this.movementX = this.clientX - _e.clientX;
      this.movementY = this.clientY - _e.clientY;
      this.clientX = _e.clientX;
      this.clientY = _e.clientY;
      console.log("this.panel :>> ", this.panel.style);
      this.panel.style.top = this.panel.offsetTop - this.movementY + "px";
      this.panel.style.left = this.panel.offsetLeft - this.movementX + "px";
    },
    onMouseLeave: function (_e) {
      document.onmouseup = null;
      document.onmousemove = null;
    },
    onInc(trade) {
      trade.selectedstrike += parseFloat(trade.strikepricestep);
    },
    onDec(trade) {
      trade.selectedstrike -= parseFloat(trade.strikepricestep);
    },
  },
  created: function () {
    // var panel = document.getElementById("neworderpanel");
    // console.log('panel :>> ', panel);
    // panel.addEventListener("mousedown", function (e) {
    //   onMouseDownUp(e);
    //   panel.onmousemove = function (e) {
    //     onMouseMove(e);
    //   };
    // });
    // panel.addEventListener("mouseup", function (e) {
    //   panel.onmousemove = null;
    // });
  },
  mixins: [myMixins],
};
</script>
<style scoped>
/* .order-window {
  position: fixed;
  bottom: 0px;
  top: auto;
  left: 500px;
  width: 800px;
  height: 250px;
} */

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
