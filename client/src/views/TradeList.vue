<template>
  <div class="trade-list">
    <div
      class="trade-scroll"
      v-if="!this.PropStrategy.isarchive"
      @dragover.prevent
      @dragenter.prevent
    >
      <div class="table trade-table w-full shadow border-collapse rounded-lg">
        <div class="table-row-group">
          <div
            class="table-row text-xs text-right text-gray-900 dark:text-white"
          >
            <div class="1"></div>
            <div class="2 table-cell px-1 py-3 w-12">
              <label class="block ">
                <input
                  type="checkbox"
                  class="mini-checkbox"
                  aria-label="Select all trades"
                  v-model="SelectAll"
                />
              </label>
            </div>
            <div
              class="3 table-cell px-1 py-4"
              v-if="PropStrategy.symboltype != 'Equity'"
            >
              Stike Price
            </div>
            <div class="4 table-cell px-1 py-4">Trade Type</div>
            <div class="5 table-cell px-1 py-4">B/S</div>
            <div class="6 table-cell px-1 py-4">Qty</div>
            <div class="7 table-cell px-1 py-4">Spot Price</div>
            <div class="8 table-cell px-1 py-4" v-if="Portfolio.exchange">
              LTP
            </div>
            <div class="9 table-cell px-1 py-4">Total Price</div>
            <div class="10 table-cell px-1 trade-actions-col">
              <div class="trade-actions trade-actions-header">
                <button
                  class="btn dark:text-orange-400 tooltip view"
                  type="button"
                  :aria-label="getLableConst.addTrade"
                  @click="onBindAddEditTrade()"
                  v-if="!this.PropStrategy.isarchive"
                >
                  <i class="material-icons" aria-hidden="true">playlist_add</i>
                  <tooltip
                    :Value="getLableConst.addTrade"
                    Location="bottom end"
                  />
                </button>

                <button
                  class="btn tooltip"
                  type="button"
                  aria-label="Exit All Trades"
                  @click="onExitAllTrade()"
                >
                  <i class="material-icons" aria-hidden="true">exit_to_app</i>
                  <tooltip Value="Exit All Trades" Location="bottom end" />
                </button>
                <dropdown
                  class="text-red-600 inline-block view tooltip"
                  Tooltip="Get LTP"
                  TooltipLocation="bottom end"
                  :Icon="`currency_rupee`"
                  :Items="LTPAction"
                  :Type="`Menu`"
                  :MinItem="2"
                  @itemclicked="onLTPDropDownItemClicked"
                >
                </dropdown>
              </div>
            </div>
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
              item && editTrade && item._id == editTrade._id
                ? `isTradeEdit`
                : ``,
              item.color,
            ]"
            v-cloak
          >
            <div class="1 table-cell" v-show="!item.ismove">
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
                aria-hidden="true"
              >
                <path
                  id="rect2026"
                  style="stroke-width: 0.264583"
                  d="M 1.7134726,6.3056817 H 2.4866974 V 7.0479501 H 1.7134726 Z m -1.48504562,0 H 1.0016518 V 7.0479501 H 0.22842698 Z M 1.7134726,5.1017156 H 2.4866974 V 5.8439839 H 1.7134726 Z m -1.48504562,0 H 1.0016518 V 5.8439839 H 0.22842698 Z M 1.7067486,3.9151924 H 2.4799734 V 4.6574607 H 1.7067486 Z m -1.48504561,0 H 0.99492782 V 4.6574607 H 0.22170299 Z M 1.7067486,2.7112265 H 2.4799734 V 3.4534948 H 1.7067486 Z m -1.48504561,0 H 0.99492782 V 3.4534948 H 0.22170299 Z M 1.704524,1.4995462 H 2.4777489 V 2.2418146 H 1.704524 Z m -1.48504551,0 H 0.99270332 V 2.2418146 H 0.21947849 Z M 1.704524,0.29558012 H 2.4777489 V 1.0378485 H 1.704524 Z m -1.48504551,0 H 0.99270332 V 1.0378485 H 0.21947849 Z"
                />
              </svg>
            </div>
            <div class="2 table-cell px-1 py-2 trade-select-cell">
              <div class="trade-select-row">
                <button
                  class="btn-mini dark:text-yellow-500 tooltip view"
                  type="button"
                  aria-label="Change row color"
                  @click="onChangeColor(item)"
                >
                  <i class="material-icons" aria-hidden="true">category</i>
                </button>
                <label class="trade-check-label">
                  <input
                    type="checkbox"
                    class="mini-checkbox view"
                    :value="item._id"
                    :aria-label="'Select trade ' + item._id"
                    v-model="selectedIDs"
                    @change="onCheckStateChanged(item)"
                  />
                </label>
              </div>
            </div>
            <div
              class="3 table-cell px-1 py-2"
              v-if="PropStrategy.symboltype != 'Equity'"
            >
              <div
                v-show="item.tradetype == 'Call' || item.tradetype == 'Put'"
                class="view strike-controls"
              >
                <button
                  class="tooltip"
                  type="button"
                  aria-label="Decrement strike"
                  @click="onIncrementDecrement(-1, item)"
                >
                  <i class="font13px material-icons" aria-hidden="true"
                    >arrow_downward</i
                  >
                  <tooltip Value="Decrement" />
                </button>
                <span>
                  {{ item.selectedstrike }}
                </span>
                <button
                  class="tooltip"
                  type="button"
                  aria-label="Increment strike"
                  @click="onIncrementDecrement(1, item)"
                >
                  <i class="font13px material-icons" aria-hidden="true"
                    >arrow_upward</i
                  >
                  <tooltip Value="Increment" />
                </button>
              </div>
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
                    class="text-right mini-edit"
                  />
                </div>
              </div>
            </div>
            <div class="4 table-cell px-1 py-2">
              <span class="view">
                {{ item.tradetype }}
              </span>
              <div class="">
                <select
                  class="btn edit"
                  :id="'tt-' + item._id"
                  v-model="item.tradetype"
                  aria-label="Trade type"
                >
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
            <div class="5 table-cell px-1 py-2">
              <span class="view">
                {{ item.buyorsell }}
              </span>
              <SwitchButton
                :PropTrade="item"
                AriaLabel="Buy or Sell"
              />
            </div>
            <div class="6 table-cell px-1 py-2">
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
            <div class="7 table-cell px-1 py-2">
              <span class="view">
                {{ $filters.decimal2(item.price) }}
              </span>
              <input
                v-model="item.price"
                type="text"
                class="mini-edit edit text-right"
                @keydown.enter="onInlineSaveTrade(item)"
              />
            </div>
            <div v-if="Portfolio.exchange" class="8 table-cell px-1 py-2">
              <div v-if="item.lasttradedprice >= 0" class="ltp-cell">
                <button
                  class="tooltip"
                  type="button"
                  aria-label="Assign LTP to Spot Price"
                  @click="onLTPClick(item)"
                >
                  <i class="font13px material-icons" aria-hidden="true">west</i>
                  <tooltip
                    Value="Assign LTP to Spot Price"
                    Location="above end"
                  />
                </button>

                <span>
                  {{ $filters.decimal2(item.lasttradedprice) }}
                </span>
              </div>
            </div>
            <div class="9 table-cell px-1 py-2">
              {{
                item.buyorsell == "Buy"
                  ? (
                      item.price *
                      (PropStrategy.lotsize * item.quantity) *
                      -1
                    ).toFixed(2)
                  : (
                      item.price *
                      (PropStrategy.lotsize * item.quantity)
                    ).toFixed(2)
              }}
            </div>
            <div class="10 table-cell px-1">
              <div class="trade-actions">
                <button
                  class="btn tooltip view"
                  type="button"
                  :aria-label="getLableConst.editTrade"
                  @click="onInlineEditTrade(item)"
                >
                  <i class="material-icons" aria-hidden="true">edit</i>
                  <tooltip
                    :Value="getLableConst.editTrade"
                    Location="above end"
                  />
                </button>
                <button
                  class="btn tooltip edit"
                  type="button"
                  :aria-label="getLableConst.saveTrade"
                  @click="onInlineSaveTrade(item)"
                >
                  <i class="material-icons" aria-hidden="true">save</i>
                  <tooltip
                    :Value="getLableConst.saveTrade"
                    Location="above end"
                  />
                </button>
                <button
                  class="btn tooltip view"
                  type="button"
                  :aria-label="getLableConst.exitTrade"
                  v-show="!item.isexit"
                  @click="onInlineExitTrade(item)"
                >
                  <i class="material-icons" aria-hidden="true">logout</i>
                  <tooltip
                    :Value="getLableConst.exitTrade"
                    Location="above end"
                  />
                </button>
                <button
                  class="btn tooltip text-red-600 dark:text-red-700"
                  type="button"
                  :aria-label="getLableConst.deleteTrade"
                  @click="onDeleteTrade(PropStrategy._id, item._id)"
                >
                  <i class="material-icons" aria-hidden="true"
                    >delete_forever</i
                  >
                  <tooltip
                    :Value="getLableConst.deleteTrade"
                    Location="above end"
                  />
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
              {{ $filters.decimal2(TotalAmount) }}
            </div>
            <div class="table-cell"></div>
            <div class="table-cell"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="this.PropStrategy.isarchive" class="text-xs">
      This strategy is archived with P&L
      <span :class="FgColor">
        {{ $filters.decimal2(TotalAmount) }}
      </span>
    </div>
  </div>
</template>
<script>
import { inject } from "vue";
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

      // txtAddTrade: this.$getConst("addTrade"),
      // txtEditTrade: this.$getConst("editTrade"),
      // txtSaveTrade: this.$getConst("saveTrade"),
      // txtExitTrade: this.$getConst("exitTrade"),
      // txtDeleteTrade: this.$getConst("deleteTrade"),
      // txtGetLiveData: this.$getConst("getLiveData"),

      bgColor: ["bg-red-100", "bg-green-100", "bg-orange-200"],
      TradeAction: [
        { _id: "1", name: "Exit", icon: "logout", click: "" },
        { _id: "2", name: "Duplicate", icon: "content_copy", click: "" },
        {
          _id: "3",
          name: "Delete",
          icon: "delete_forever",
          click: "",
          color: "text-red-600 dark:text-red-700",
        },
      ],
      LTPAction: [
        { _id: "updateltp", name: "Update LTP", icon: "get_app", click: "" },
        { _id: "updateexit", name: "Update Exit", icon: "vertical_align_bottom", click: "" },
        { _id: "updateall", name: "Update All", icon: "save_alt", click: "" }
      ],
      pnlpercentage: 0,
    };
  },
  props: {
    PropStrategy: {},
    PropSelectedTraded: { type: Array },
    EditTradeForExternal: {},
    TTL: { value: 0 },
    //pnlpercentage : {type : int, value :0},
  },
  methods: {
    ...mapActions({
      EditStrategy: "strategyModule/EditStrategy",
      AddEditTrade: "tradeModule/AddEditTrade",
      BindAddEditTrade: "tradeModule/BindAddEditTrade",
      DeleteTrade: "tradeModule/DeleteTrade",
      CheckStateChanged: "tradeModule/CheckStateChanged",
      GetLiveData: "dataModule/GetLiveData",
    }),
    onDeleteTrade: function (sid, tid) {
      if (
        !window.confirm("Delete this trade? This cannot be undone.")
      ) {
        return;
      }
      this.DeleteTrade({ sid, tid }).then(() => {
        this.GenerateChart(this.PropStrategy);
      });
    },
    onGetLiveData: function (action) {
      console.log('action :>> ', action);

      this.GetLiveData({
        portfolio: this.Portfolio,
        strategy: this.PropStrategy,
        action: action
      }).then(() => {
        //this.EditStrategy(this.PropStrategy);
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
        //this.GenerateChart(this.PropStrategy);
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
      var _exitTrade = this.getOppositeTrade(trade);
      this.AddEditTrade(_exitTrade).then(() => {
        this.GenerateChart(this.PropStrategy);
      });
    },
    onExitAllTrade: function () {
      var parMethod = this.AddEditTrade;
      var trades = this.PropStrategy.trades;
      var oppositetrade = this.getOppositeTrade;
      for (let _i = 0, _len = trades.length; _i < _len; _i++) {
        setTimeout(function () {
          var _trade = trades[_i];
          var _exitTrade = oppositetrade(_trade);
          parMethod(_exitTrade);
        }, _i * 200);
      }
    },
    onCheckStateChanged: function (trade) {
      trade.checked = !trade.checked;
      this.CheckStateChanged(this.PropStrategy).then(() => {
        this.GenerateChart(this.PropStrategy);
      });
    },
    onBindAddEditTrade: function () {
      this.BindAddEditTrade(this.PropStrategy);
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
    onActionDropDownItemClicked: function (
      control,
      actionid,
      actionname,
      item
    ) {
      // if (actionid == 1) {
      // } else 
      if (actionid == 3) {
        this.onInlineExitTrade(item);
      }
    },
    onLTPDropDownItemClicked: function (control,
      action,
    ) {
      this.onGetLiveData(action);
    },
    onIncrementDecrement(incdec, trade) {
      trade.selectedstrike = (trade.selectedstrike + (incdec * this.PropStrategy.strikepricestep));
      this.AddEditTrade(trade).then(() => {
        this.$emit("onItemEnterKeyPressed");
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
    getOppositeTrade: function (trade) {
      var _exitTrade = { ...trade };
      _exitTrade.buyorsell = _exitTrade.buyorsell == "Buy" ? "Sell" : "Buy";
      _exitTrade.isexit = true;
      _exitTrade.partnerid = _exitTrade._id;
      _exitTrade._id = null;
      _exitTrade.sid = this.PropStrategy._id;
      return _exitTrade;
    }
    ,
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
        let price = 0;
        // buyprice = 0,
        // sellprice = 0;

        this.PropStrategy?.trades?.forEach((_trade) => {
          this.selectedIDs.forEach((_f) => {
            if (_trade._id == _f) {
              if (_trade.buyorsell == "Buy") {
                price =
                  price -
                  _trade.price * (this.PropStrategy.lotsize * _trade.quantity);

                // buyprice +=
                //   _trade.price * (this.PropStrategy.lotsize * _trade.quantity);
              } else {
                price =
                  price +
                  _trade.price * (this.PropStrategy.lotsize * _trade.quantity);

                // sellprice +=
                //   _trade.price * (this.PropStrategy.lotsize * _trade.quantity);
              }
            }
          });
        });
        //this.pnlpercentage = ((sellprice - buyprice) / buyprice) * 100;
        return price;
      }
      return 0;
    },
    PnLPercnet: {
      get: function () {
        return this.pnlpercentage;
      },
      set: function (value) {
        this.pnlpercentage = value;
      },
    },
    FgColor: function () {
      return {
        "text-green-700": this.TotalAmount >= 0,
        "text-red-700": this.TotalAmount < 0,
      };
    },
  },
  watch: {
    TTL(val) {
      this.pnlpercentage = val;
    }
  },
  setup() {
    let getLableConst = inject('GETCONST');
    return { getLableConst };
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
  display: inline-flex;
}

.isTradeEdit .view {
  display: none;
}

.trade-scroll {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  overflow-y: visible;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 0.25rem;
}

.trade-table {
  min-width: 720px;
}

.trade-actions {
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.2rem;
  position: relative;
  z-index: 1;
}

.trade-actions-header {
  z-index: 2;
}

.trade-actions-col {
  min-width: 6.5rem;
  overflow: visible;
}

.trade-actions .tooltip,
.trade-actions .dropdown {
  overflow: visible;
}

.trade-actions .btn,
.trade-actions .dropdown {
  vertical-align: middle;
}

.trade-select-cell {
  vertical-align: middle;
  white-space: nowrap;
  width: 1%;
  min-width: 3.5rem;
}

.trade-select-row {
  display: inline-flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  gap: 0.25rem;
  height: 1.75rem;
}

.trade-select-row .btn-mini {
  flex: 0 0 auto;
}

.trade-check-label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 1.75rem;
  margin: 0;
  line-height: 1;
}

.trade-check-label .mini-checkbox {
  margin: 0;
  vertical-align: middle;
}

.strike-controls,
.ltp-cell {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.1rem;
}

.strike-controls button,
.ltp-cell button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 1.75rem;
  width: 1.75rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
}
</style>
