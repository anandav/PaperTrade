<template>
  <div
    id="neworderpanel"
    class="
      drop-shadow-lg
      h-44
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
    style="bottom: 0"
    @keydown.esc="onBindAddEditTrade()"
    v-if="TradeDetail"
  >
    <div
      id="header"
      class="bg-clip-border rounded-t p-3 cursor-move border-b-2 border-gray-500"
      :class="
        TradeDetail.buyorsell == 'Sell'
          ? 'bg-gradient-to-r from-gray-700 to-yellow-700'
          : 'bg-gradient-to-r from-gray-700 to-green-800'
      "
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
          <div class="float-right cursor-pointer">
            <a @click="onBindAddEditTrade()" aria-label="Close">
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
     
        <div class="">
          <input
            placeholder="Quantity"
            type="number"
            v-model.number="TradeDetail.quantity"
            class="mini-edit text-right"
          />
        </div>

        <div class="">
          <input
            placeholder="Price"
            type="number"
            v-model.number="TradeDetail.price"
            class="mini-edit text-right"
          />
        </div>
       
      </div>
      <div class="flex flex-row float-right mr-5">
        <a class="btn btn-secondary" @click="onAddEditTrade()" href="#">
          Save
        </a>
        <a
          class="btn btn-secondary ml-1"
          @click="onBindAddEditTrade()"
          href="#"
        >
          Cancel
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
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
    ...mapGetters({ TradeDetail: "tradeModule/TradeDetail" }),
  },
  components: {
    SwitchButton,
  },
  methods: {
    ...mapActions({
      AddEditTrade: "tradeModule/AddEditTrade",
      BindAddEditTrade: "tradeModule/BindAddEditTrade",
    }),
    onAddEditTrade: function () {
      this.AddEditTrade(this.TradeDetail).then(() => {
        this.BindAddEditTrade(null);
      });
    },
    onBindAddEditTrade: function () {
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
      this.panel.style.top = this.panel.offsetTop - this.movementY + "px";
      this.panel.style.left = this.panel.offsetLeft - this.movementX + "px";
    },
    onMouseLeave: function () {
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
</style>
