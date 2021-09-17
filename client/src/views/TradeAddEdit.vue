<template>
  <div
    id="neworderpanel"
    class="
      ring ring-gray-400 ring-opacity-50
      h-40
      md:h-60
      absolute
      bottom-0
      items-center
      w-2/5
      left-1/3
      rounded-md
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
      class="
        bg-clip-border
        rounded-t
        p-3
        cursor-move
        border-b-2 border-gray-500
      "
      :class="
        TradeDetail.buyorsell == 'Sell'
          ? 'bg-gradient-to-r from-gray-700 to-red-700'
          : 'bg-gradient-to-r from-gray-700 to-green-800'
      "
      @mousedown="onMouseDownUp($event)"
    >
      <div class="grid grid-cols-3">
        <div class="col-span-2">
          {{ TradeDetail.symbol }}
        </div>
        <!-- <div class="col-span-1">
          <div class="float-right">
            <SwitchButton :PropTrade="TradeDetail" />
          </div>
        </div> -->
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
      <div class="mt-2 flex flex-row space-x-4 justify-around">
        <div class="inline-block">
          <label class="block my-2"> Lot Size </label>
          <input
            class="mini-edit text-right"
            placeholder="Strike Step"
            type="number"
            v-model="TradeDetail.lotsize"
          />
        </div>

        <div class="inline-block">
          <label class="block my-2"> Step </label>
          <input
            class="mini-edit text-right"
            placeholder="Strike Step"
            type="number"
            v-model="TradeDetail.strikepricestep"
          />
        </div>
        <div class="inline-block mx-3">
          <label class="block my-2"> Strike Price </label>
          <div class="">
            <a
-              class="btn-nonrounded rounded-l-sm inline-block"
              @click="onDec(TradeDetail)"
              >-</a
            >
            <input
              v-model="TradeDetail.selectedstrike"
              type="text"
              class="text-right mini-edit-nonrounded inline-block"
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
          <label class="block my-2"> Type </label>
          <label
            class="btn-nonrounded"
            v-for="(value, key) in TRADETYPE"
            :key="key"
            :class="{
              'active text-green-400 dark:text-green-400':
                value == [TradeDetail.tradetype],
            }"
          >
            <input
              type="radio"
              name="TRADETYPE"
              class="hidden"
              :value="value"
              :id="'tradeSymbol_' + value"
              v-model="TradeDetail.tradetype"
            />
            {{ value }}
          </label>
        </div>
        <div class="inline-block">
          <label class="block my-2"> Buy/Sell </label>
          <SwitchButton :PropTrade="TradeDetail" />
        </div>

        <div class="">
          <label class="block my-2"> Quantity </label>
          <input
            placeholder="Quantity"
            type="number"
            v-model.number="TradeDetail.quantity"
            class="mini-edit text-right"
          />
        </div>

        <div class="">
          <label class="block my-2"> Price </label>
          <input
            placeholder="Price"
            type="number"
            v-model.number="TradeDetail.price"
            class="mini-edit text-right"
          />
        </div>
      </div>

      <div class="flex flex-row float-right my-2 mr-5">
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
