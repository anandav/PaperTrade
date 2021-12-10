<template>
  <!-- <div class="rounded-xl overflow-hidden bg-gradient-to-r from-pink-50 to-pink-100 p-10"></div> -->
  <div>
    <div
      class="table w-full shadow border-collapse rounded-lg"
      v-if="!this.PropStrategy.isarchive"
      @dragover.prevent
      @dragenter.prevent
    >
      <div class="table-row-group">
        <div class="table-row text-xs text-right text-gray-900 dark:text-white">
          <div class=""></div>
          <div class="table-cell px-1 py-3 w-12">
            <label class="block"
              ><input
                type="checkbox"
                class="mini-checkbox"
                v-model="SelectAll"
              />
            </label>
          </div>
          <!-- <div class="hidden px-1 py-4 ">Symbol</div>
        <div class="hidden px-1 py-4">Lot Size</div>
        <div class="hidden px-1 py-4">Step</div> -->
          <div class="table-cell px-1 py-4">Strike Price</div>
          <div class="table-cell px-1 py-4">Trade Type</div>
          <div class="table-cell px-1 py-4">B/S</div>
          <div class="table-cell px-1 py-4">Qty</div>
          <div class="table-cell px-1 py-4">Spot Price</div>
          <div
            class="table-cell px-1 py-4 text-yellow-400"
            v-if="Portfolio.exchange"
          >
            LTP
          </div>
          <div class="table-cell px-1 py-4">Total Price</div>
          <div class="table-cell px-1 w-28">Action</div>
        </div>
      </div>
      <div class="table-row-group" @drop="onDrop($event)">
        <div
          class="
            table-row
            text-right
            border-t border-gray-300
            dark:border-gray-600
          "
          draggable="true"
          @dragover="onDragOver($event, index)"
          @dragstart="onDragStart($event, item, index)"
          @keyup.113="onInlineEditTrade(item)"
          v-for="(item, index) in PropStrategy.trades"
          :key="item._id"
          :data-id="item._id"
          :data-order="item.order"
          :class="[
            item && editTrade && item._id == editTrade._id ? `isTradeEdit` : ``,
            item.color,
          ]"
          v-cloak
        >
          <div class="table-cell" v-show="!item.ismove">
            <svg
              class="
                cursor-move
                pt-1
                view
                fill-current
                text-gray-400
                dark:text-gray-500
              "
              width="10"
              height="15"
              viewBox="0 0 2 5"
              version="1.1"
            >
              <path
                id="rect2026"
                style="stroke-width: 0.264583"
                d="M 1.7134726,6.3056817 H 2.4866974 V 7.0479501 H 1.7134726 Z m -1.48504562,0 H 1.0016518 V 7.0479501 H 0.22842698 Z M 1.7134726,5.1017156 H 2.4866974 V 5.8439839 H 1.7134726 Z m -1.48504562,0 H 1.0016518 V 5.8439839 H 0.22842698 Z M 1.7067486,3.9151924 H 2.4799734 V 4.6574607 H 1.7067486 Z m -1.48504561,0 H 0.99492782 V 4.6574607 H 0.22170299 Z M 1.7067486,2.7112265 H 2.4799734 V 3.4534948 H 1.7067486 Z m -1.48504561,0 H 0.99492782 V 3.4534948 H 0.22170299 Z M 1.704524,1.4995462 H 2.4777489 V 2.2418146 H 1.704524 Z m -1.48504551,0 H 0.99270332 V 2.2418146 H 0.21947849 Z M 1.704524,0.29558012 H 2.4777489 V 1.0378485 H 1.704524 Z m -1.48504551,0 H 0.99270332 V 1.0378485 H 0.21947849 Z"
              />
            </svg>
          </div>
          <div class="table-cell px-1 py-3">
            <button
              class="btn-mini text-xxs mr-2 dark:text-yellow-500 tooltip view"
              @click="onChangeColor(item)"
            >
              <i class="material-icons">category</i>
            </button>

            <!-- <DropDown
              class="inline-block view tooltip"
              :Icon="`menu`"
              :Items="TradeAction"
              :Type="`Menu`"
              @itemclicked="onTradeDropDownItemClicked"order
              Tooltip="Action"order
            >
            </DropDown> -->

            <label class="">
              <input
                type="checkbox"
                class="mini-checkbox view"
                :value="item._id"
                v-model="selectedIDs"
                @change="onCheckStateChanged(item)"
              />
            </label>
          </div>
          <div class="table-cell px-1 py-3">
            <span
              v-show="item.tradetype == 'Call' || item.tradetype == 'Put'"
              class="view"
            >
              {{ item.selectedstrike }}
            </span>

            <div class="edit">
              <div
                v-show="item.tradetype == 'Call' || item.tradetype == 'Put'"
                class="flex flex-col"
              >
                <input
                  v-model="item.selectedstrike"
                  :step="PropStrategy.strikepricestep"
                  @keydown.enter="onInlineSaveTrade(item)"
                  type="number"
                  class="text-right mini-edit-nonrounded"
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
          <div
            v-if="Portfolio.exchange"
            class="table-cell px-1 py-3 text-yellow-500"
          >
            <span class="" @dblclick="onLTPClick(item)">
              {{ item.lasttradedprice }}
            </span>
          </div>

          <div class="table-cell px-1 py-3">
            {{
              item.buyorsell == "Buy"
                ? (
                    item.price *
                    (PropStrategy.lotsize * item.quantity) *
                    -1
                  ).toFixed(2)
                : (item.price * (PropStrategy.lotsize * item.quantity)).toFixed(
                    2
                  )
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
                <i class="material-icons">delete_forever</i>
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
          <div class="table-cell"></div>
          <div class="table-cell" v-if="Portfolio.exchange"></div>
          <div class="table-cell">
            <span class="text-xs block text-gray-500">P&L</span>
          </div>
          <div class="table-cell px-1 py-2">
            {{ TotalAmount }}
          </div>
          <div class="table-cell"></div>
          <div class="table-cell"></div>
        </div>
      </div>
    </div>
    <div v-if="this.PropStrategy.isarchive" class="text-xs">
      This strategy is archived with P&L
      <span :class="FgColor">
        {{ TotalAmount }}
      </span>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState, mapGetters } from "vuex";
import myMixins from "../shared/chart";
import SwitchButton from "../components/ui/SwitchButton";
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
      bgColor: ["bg-red-100", "bg-green-100", "bg-orange-200"],
      TradeAction: [
        { _id: "1", name: "Exit", icon: "archive", click: "" },
        { _id: "2", name: "Duplicate", icon: "content_copy", click: "" },
        { _id: "3", name: "Delete", icon: "archive", click: "" },
      ],
    };
  },
  props: {
    PropStrategy: {},
    PropSelectedTraded: { type: Array },
    EditTradeForExternal: {},
  },
  methods: {
    ...mapActions({
      EditStrategy: "strategyModule/EditStrategy",
      AddEditTrade: "tradeModule/AddEditTrade",
      DeleteTrade: "tradeModule/DeleteTrade",
      CheckStateChanged: "tradeModule/CheckStateChanged",
    }),
    onDeleteTrade: function (sid, tid) {
      this.DeleteTrade({ sid, tid }).then(() => {
        this.GenerateChart(this.PropStrategy);
      });
    },
    onInlineEditTrade: function (trade) {
      this.editTrade = trade;
    },
    onInlineSaveTrade: function (trade) {
      this.editTrade = null;
      trade.selectedstrike =
        trade.tradetype == "Call" || trade.tradetype == "Put"
          ? trade.selectedstrike
          : undefined;
      this.AddEditTrade(trade).then(() => {
        this.$emit("onItemEnterKeyPressed");
        this.GenerateChart(this.PropStrategy);
      });



    },
    onDragStart: function (e) {
      ///Ref:// https://github.com/WebDevSimplified/Drag-And-Drop
      const row = e.target;
      row.classList.add("dragging");
      row.classList.add("bg-pink-100");
    },
    onDragOver: function (e) {
      const row = e.target.parentElement;
      if (row.classList.contains("table-row")) {
        const container = row.parentElement;
        const afterElement = this.getDragAfterElement(container, e.clientY);
        const draggable = document.querySelector(".dragging");
        if (afterElement == null) {
          container.appendChild(draggable);
        } else {
          container.insertBefore(draggable, afterElement);
        }
      }
    },
    onDrop: function (e) {
      e.preventDefault();
      const row = document.querySelector(".dragging");
      row.classList.remove("dragging");
      row.classList.remove("bg-pink-100");
      const tableRowsGroup = row.closest(".table-row-group");
      const tableRows = tableRowsGroup.querySelectorAll(".table-row");
      let i = 0;
      tableRows.forEach((row) => {
        this.PropStrategy.trades.forEach((y) => {
          const x = row.getAttribute("data-id");
          if (x == y._id) {
            y.order = i;
          }
        });
        i += 1;
      });
      this.EditStrategy(this.PropStrategy);
    },
    onInlineExitTrade: function (trade) {
      var _exitTrade = { ...trade };
      _exitTrade.buyorsell = _exitTrade.buyorsell == "Buy" ? "Sell" : "Buy";
      _exitTrade.isexit = true;
      _exitTrade.partnerid = _exitTrade._id;
      _exitTrade._id = null;

      _exitTrade.sid = this.PropStrategy._id;
      this.AddEditTrade(_exitTrade).then(() => {
        this.GenerateChart(this.PropStrategy);
      });
    },
    onCheckStateChanged: function (trade) {
      trade.checked = !trade.checked;
      this.CheckStateChanged(this.PropStrategy).then(()=>{
        this.GenerateChart(this.PropStrategy);
      });
    },
    onChangeColor: function (trade) {
      const findNextColor = (val) => {
        let index = -1;
        for (let i = 0; i < this.bgColor.length; i++) {
          if (this.bgColor[i] == val) {
            index = i;
          }
        }
        if (index == -1) {
          return this.bgColor[0];
        } else {
          return this.bgColor[index + 1];
        }
      };
      trade.color = findNextColor(trade.color);
      this.AddEditTrade(trade);
    },
    onLTPClick: function (trade) {
      trade.price = trade.lasttradedprice;
      this.AddEditTrade(trade).then(() => {
        this.GenerateChart(this.PropStrategy);
      });
    },
    getDragAfterElement: function (container, y) {
      const draggableElements = [
        ...container.querySelectorAll(".table-row:not(.dragging)"),
      ];

      return draggableElements.reduce(
        (closest, child) => {
          const box = child.getBoundingClientRect();
          const offset = y - box.top - box.height / 2;

          if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
          } else {
            return closest;
          }
        }, 
        { offset: Number.NEGATIVE_INFINITY }
      ).element;
    },
    getSortedTrades: function () {
      const compare = function (a, b) {
        if (a.order < b.order) return -1;
        if (a.order > b.order) return 1;
        return 0;
      };
      if (this.PropStrategy.trades.length > 0) {
        return this.PropStrategy.trades.sort(compare);
      } else {
        return this.PropStrategy.trades;
      }
    },
  },
  mounted() {
    this.SelectAll = true;
  },

  computed: {
    ...mapGetters({
      Portfolio: "portfolioModule/Portfolio",
    }),

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
        this.PropStrategy?.trades?.forEach(function (t) {
          if (value) {
            selected.push(t._id);
          }
          t.checked = value;
        });
        this.selectedIDs = selected;

        if (!this.PropStrategy.isarchive) {
          this.CheckStateChanged(this.PropStrategy);
          this.GenerateChart(this.PropStrategy);
        }
      },
    },

    TotalAmount: function () {
      if (this.selectedIDs) {
        var price = 0;
        this.PropStrategy?.trades?.forEach((_trade) => {
          this.selectedIDs.forEach((_f) => {
            if (_trade._id == _f) {
              price =
                _trade.buyorsell == "Buy"
                  ? price -
                    _trade.price * (this.PropStrategy.lotsize * _trade.quantity)
                  : price +
                    _trade.price *
                      (this.PropStrategy.lotsize * _trade.quantity);
            }
          });
        });
        return price.toFixed(2);
      }
      return 0;
    },
    FgColor: function () {
      return {
        "text-green-700": this.TotalAmount >= 0,
        "text-red-700": this.TotalAmount < 0,
      };
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
