<template>
  <!-- <div class="rounded-xl overflow-hidden bg-gradient-to-r from-pink-50 to-pink-100 p-10"></div> -->
  <div class="table w-full shadow border-collapse rounded-lg">
    <div class="table-row-group">
      <div class="table-row text-xs text-right text-gray-900 dark:text-white">
        <div class=""></div>
        <div class="table-cell px-1 py-3">
          <label class="block"
            ><input type="checkbox" class="mini-checkbox" v-model="SelectAll" />
          </label>
        </div>
        <!-- <div class="hidden px-1 py-4 ">Symbol</div>
        <div class="hidden px-1 py-4">Lot Size</div>
        <div class="hidden px-1 py-4">Step</div> -->
        <div class="table-cell px-1 py-4">Strike Price</div>
        <div class="table-cell px-1 py-4">Type</div>
        <div class="table-cell px-1 py-4">B/S</div>
        <div class="table-cell px-1 py-4">Qty</div>
        <div class="table-cell px-1 py-4">Spot Price</div>
        <div class="table-cell px-1 py-4 text-yellow-400">LTP</div>
        <div class="table-cell px-1 py-4">Total Price</div>
        <div class="table-cell px-1 w-28">Action</div>
      </div>
    </div>
    <div class="table-row-group">
      <div
        class="
          table-row
          text-right
          bg-gray-800
          dark:bg-gray-800
          border-t border-gray-400
          dark:border-gray-600
        "
        draggable="true"
        tabindex="-1"
        @keyup.113="onInlineEditTrade(item)"
        v-for="item in PropStrategy.trades"
        :key="item._id"
        :class="{ isTradeEdit: item && editTrade && item._id == editTrade._id }"
        v-cloak
      >
        <div class="table-cell" v-show="!item.ismove">
          <!-- <svg
            class="cursor-move pt-1"
            @click="onDrag($event)"
            width="10"
            height="15"
            viewBox="0 0 2 5"
            version="1.1"
          >
            <path
              id="rect2026"
              style="fill: #ececec; stroke-width: 0.264583"
              d="M 1.7134726,6.3056817 H 2.4866974 V 7.0479501 H 1.7134726 Z m -1.48504562,0 H 1.0016518 V 7.0479501 H 0.22842698 Z M 1.7134726,5.1017156 H 2.4866974 V 5.8439839 H 1.7134726 Z m -1.48504562,0 H 1.0016518 V 5.8439839 H 0.22842698 Z M 1.7067486,3.9151924 H 2.4799734 V 4.6574607 H 1.7067486 Z m -1.48504561,0 H 0.99492782 V 4.6574607 H 0.22170299 Z M 1.7067486,2.7112265 H 2.4799734 V 3.4534948 H 1.7067486 Z m -1.48504561,0 H 0.99492782 V 3.4534948 H 0.22170299 Z M 1.704524,1.4995462 H 2.4777489 V 2.2418146 H 1.704524 Z m -1.48504551,0 H 0.99270332 V 2.2418146 H 0.21947849 Z M 1.704524,0.29558012 H 2.4777489 V 1.0378485 H 1.704524 Z m -1.48504551,0 H 0.99270332 V 1.0378485 H 0.21947849 Z"
            />
          </svg> -->
        </div>
        <div class="table-cell px-1 py-3">
          <label class="">
            <input
              type="checkbox"
              class="mini-checkbox"
              :value="item._id"
              v-model="selectedIDs"
              @change="onCheckStateChanged(item)"
            />
          </label>
        </div>

        <div class="table-cell px-1 py-3">
          <span v-show="item.tradetype != 'Future'" class="view">
            {{ item.selectedstrike }}
          </span>

          <div class="edit">
            <div v-show="item.tradetype != 'Future'" class="flex flex-col">
              <input
                v-model="item.selectedstrike"
                :step="PropStrategy.strikepricestep"
                type="number"
                class="mini-edit text-right mini-edit-nonrounded"
              />
            </div>
          </div>
        </div>
        <div class="table-cell px-1 py-3">
          <span class="view">
            {{ item.tradetype }}
          </span>
          <div class="">
            <select class="btn edit" v-model="item.tradetype">
              <option
                :key="key"
                v-for="(value, key) in TRADETYPE"
                v-bind:value="value"
              >
                {{ value }}
              </option>
            </select>
          </div>
        </div>
        <div class="table-cell px-1 py-3">
          <span class="view">
            {{ item.buyorsell }}
          </span>
          <SwitchButton :PropTrade="item" />
        </div>
        <div class="table-cell px-1 py-3">
          <span class="view">
            {{ item.quantity }}
          </span>
          <input
            v-model="item.quantity"
            min="1"
            type="number"
            class="mini-edit edit text-right"
            @keydown.enter="onInlineSaveTrade(item)"
          />
        </div>
        <div class="table-cell px-1 py-3">
          <span class="view">
            {{ item.price }}
          </span>
          <input
            v-model="item.price"
            type="text"
            class="mini-edit edit text-right"
            @keydown.enter="onInlineSaveTrade(item)"
          />
        </div>
        <div class="table-cell px-1 py-4 text-yellow-400">
          Place holder
        </div>

        <div class="table-cell px-1 py-3">
          {{
            item.buyorsell == "Buy"
              ? (
                  item.price *
                  (PropStrategy.lotsize * item.quantity) *
                  -1
                ).toFixed(2)
              : (item.price * (PropStrategy.lotsize * item.quantity)).toFixed(2)
          }}
        </div>
        <div class="table-cell px-1">
          <div class="space-x-1">
            <button class="btn tooltip view" @click="onInlineEditTrade(item)">
              <i class="material-icons">edit</i>
              <tooltip :Value="txtEditTrade" />
            </button>
            <button class="btn tooltip edit" @click="onInlineSaveTrade(item)">
              <i class="material-icons">save</i>
              <tooltip :Value="txtSaveTrade" />
            </button>
            <button
              class="btn tooltip view"
              v-show="!item.isexit"
              @click="onInlineExitTrade(item)"
            >
              <i class="material-icons">logout</i>
              <tooltip :Value="txtExitTrade" />
            </button>
            <button
              class="btn tooltip text-red-600 dark:text-red-700"
              @dblclick="onDeleteTrade(PropStrategy._id, item._id)"
            >
              <i class="material-icons">delete</i>
              <tooltip :Value="txtDeleteTrade" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="table-row-group">
      <div class="table-row text-right border-t border-yellow-500">
        <div class="table-cell"></div>
        <div class="table-cell"></div>
        <div class="table-cell"></div>
        <div class="table-cell"></div>
        <div class="table-cell"></div>
        <div class="table-cell">
          <span class="text-xs block text-gray-500">P&L</span>
        </div>
        <div class="table-cell px-1 py-4">
          {{ TotalAmount }}
        </div>
        <div class="table-cell"></div>
        <div class="table-cell"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import myMixins from "../shared/utilitymixins";
// import tableDrag from "../shared/index";
import SwitchButton from "../components/ui/SwitchButton";
// import TradeListRow from "./TradeListRow";
export default {
  name: "TradeList",
  mixins: [myMixins],

  components: {
    SwitchButton,
    // TradeListRow,
  },
  data: function () {
    return {
      selectedIDs: [],
      editTrade: null,
      txtEditTrade: this.$getConst("editTrade"),
      txtSaveTrade: this.$getConst("saveTrade"),
      txtExitTrade: this.$getConst("exitTrade"),
      txtDeleteTrade: this.$getConst("deleteTrade"),
    };
  },
  props: {
    PropStrategy: {},
    PropSelectedTraded: { type: Array },
    EditTradeForExternal: {},
  },
  methods: {
    ...mapActions({
      AddEditTrade: "tradeModule/AddEditTrade",
      DeleteTrade: "tradeModule/DeleteTrade",
      CheckStateChanged: "tradeModule/CheckStateChanged",
    }),
    onDeleteTrade: function (sid, tid) {
      this.DeleteTrade({ sid, tid });
    },
    onInlineEditTrade: function (trade) {
      this.editTrade = trade;
    },
    onInlineSaveTrade: function (trade) {
      this.editTrade = null;
      this.AddEditTrade(trade).then(() => {
        this.$emit("onItemEnterKeyPressed");
      });
    },
    onDrag(trade, e) {
      e.preventDefault();

      const row = e.srcElement.closest(".table-row");
      row.addEventListener("dragstart", () => {
        console.log("DragStart :>> ");
        row.classList.add("dragging");
      });

      row.addEventListener("dragend", () => {
        row.classList.remove("dragging");
      });
      //row.classList.toggle("absolute");
    },
    onInlineExitTrade: function (trade) {
      var _exitTrade = { ...trade };
      _exitTrade.buyorsell = _exitTrade.buyorsell == "Buy" ? "Sell" : "Buy";
      _exitTrade.isexit = true;
      _exitTrade.partnerid = _exitTrade._id;
      _exitTrade._id = null;

      _exitTrade.sid = this.PropStrategy._id;
      this.AddEditTrade(_exitTrade);
    },

    onCheckStateChanged: function (trade) {
      trade.checked = !trade.checked;
      this.CheckStateChanged(this.PropStrategy);
      this.GenerateChart(this.PropStrategy);
    },
  },
  mounted() {
    this.SelectAll = true;
    console.log("Mounted :>> ");
  },

  computed: {
    ...mapState(["TradeSelectChange"]),
    SelectAll: {
      ///ref: https://stackoverflow.com/questions/33571382/check-all-checkboxes-vuejs
      get: function () {
        return this.PropStrategy.trades
          ? this.PropStrategy.trades.length == this.selectedIDs.length
          : false;
      },
      set: function (value) {
        var selected = [];
        this.PropStrategy.trades.forEach(function (t) {
          if (value) {
            selected.push(t._id);
          }
          t.checked = value;
        });
        this.selectedIDs = selected;
        this.CheckStateChanged(this.PropStrategy);
        this.GenerateChart(this.PropStrategy);
      },
    },

    TotalAmount: function () {
      if (this.selectedIDs) {
        var price = 0;
        this.PropStrategy.trades.forEach((_e) => {
          this.selectedIDs.forEach((_f) => {
            if (_e._id == _f) {
              price =
                _e.buyorsell == "Buy"
                  ? price - _e.price * (this.PropStrategy.lotsize * _e.quantity)
                  : price +
                    _e.price * (this.PropStrategy.lotsize * _e.quantity);
            }
          });
        });
        return price.toFixed(2);
      }
      return 0;
    },
  },
};
</script>
<style scoped>
[v-cloak] {
  display: none;
}
.edit {
  display: none;
}
.isTradeEdit .edit {
  display: inline-block;
}
.isTradeEdit .view {
  display: none;
}
</style>
