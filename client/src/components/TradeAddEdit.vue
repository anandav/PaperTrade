<template>
  <div
    class="card bg-dark text-light order-window"
    v-if="TradeDetail"
    @keydown.esc="bindAddEditTrade()"
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
              bg-transparent
              border border-secondary
              text-white
            "
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
        <div class="col-sm">
          <input
            placeholder="Price"
            type="number"
            v-model.number="TradeDetail.spotprice"
            class="
              form-control
              bg-transparent
              border border-secondary
              text-white
            "
            id="formSpotPrice"
          />
        </div>
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
            id="formSpotPrice"
          />
        </div>
      </div>

      <div class="d-flex mt-2">
        <textarea
          placeholder="Note"
          type="number"
          v-model.number="TradeDetail.note"
          class="form-control bg-transparent border border-secondary text-white"
          id="formSpotPrice"
        ></textarea>
      </div>
      <div class="d-flex mt-2">
        <a
          class="btn btn-warning float-right"
          @click="onAddEditTrade()"
          href="#"
        >
          Save
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
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
    ...mapActions(["AddEditTrade", "BindAddEditTrade"]),
    onAddEditTrade: function () {
      this.AddEditTrade(this.TradeDetail);
    },
    bindAddEditTrade: function () {
      this.BindAddEditTrade(null);
    },
    onMyMouseDown: function () {
      console.log("console log");
    },
    dragElement: function (elmnt) {
      console.log("Drag Element");
      var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
      if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown =
          dragMouseDown;
      } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
      }

      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = elmnt.offsetTop - pos2 + "px";
        elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
      }

      function closeDragElement() {
        console.log("// stop moving when mouse button is released:");
        document.onmouseup = null;
        document.onmousemove = null;
      }
    },
  },
  created() {

    this.dragElement(document.getElementsByClassName("order-window"));
  },
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
</style>
