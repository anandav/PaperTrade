<template>
  <table class="table text-light">
    <thead>
      <tr>
        <th v-show="PropStrategy.ismultiplesymbol" scope="col">Symbol</th>
        <th scope="col">Lot Size</th>
        <th scope="col" class="d-none" >Strike Step</th>
        <th scope="col">Selected Strike</th>
        <th scope="col">Trade Type</th>
        <th scope="col">Buy/Sell</th>
        <th scope="col">Quantity</th>
        <th scope="col">Spot Price</th>
        <th scope="col">Total Price</th>
        <th scope="col" hidden>Note</th>
        <th scope="col"></th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in PropStrategy.trades"
        :key="item._id"
        :class="{ isTradeEdit: item == editTrade }"
        v-cloak
      >
        <td v-show="PropStrategy.ismultiplesymbol">
          <span class="view">
            {{ item.symbol }}
          </span>
          <input type="text" class="form-control edit" v-model="item.symbol" />
        </td>

        <td>
          <span class="view">
            {{ item.lotsize }}
          </span>
          <input v-model="item.lotsize" type="text" class="form-control edit" />
        </td>
        <td class="d-none">
          <span class="view">
            {{ item.strikepricestep }}
          </span>
          <input
            v-model="item.strikepricestep"
            type="number"
            class="form-control edit"
          />
        </td>

        <td>
          <span class="view">
            {{ item.selectedstrike }}
          </span>

          <div class="edit">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <a class="input-group-text text-dark" @click="onDec(item)">-</a>
              </div>
              <input
                v-model="item.selectedstrike"
                type="text"
                class="form-control"
              />
              <div class="input-group-append">
                <a class="input-group-text text-dark" @click="onInc(item)">+</a>
              </div>
            </div>

            <input
              v-model="item.selectedstrike"
              type="range"
              class="edit"
              :min="item.strikepricemin"
              :max="item.strikepricemax"
              :step="item.strikepricestep"
            />
          </div>
        </td>

        <td>
          <span class="view">
            {{ item.tradetype }}
          </span>
          <div class="col-sm btn-group btn-group-toggle">
            <label
              class="btn btn-secondary text-white edit"
              v-for="(value, key) in TRADETYPE"
              :key="key"
              :class="{ active: value == [item.tradetype] }"
            >
              <input
                type="radio"
                :name="TRADETYPE"
                :value="value"
                :id="'tradeSymbol_' + value"
                v-model="item.tradetype"
              />
              {{ value }}
            </label>
          </div>
        </td>

        <td>
          <span class="view">
            {{ item.buyorsell }}
          </span>
          <div class="btn-group btn-group-toggle edit">
            <label
              class="btn btn btn-secondary"
              v-for="(value, key) in BUYORSELL"
              :key="key"
              :class="{
                'text-success': key == 1,
                'text-danger': key == 2,
                active: value == [item.buyorsell],
              }"
            >
              <input
                type="radio"
                name="tradeTypename"
                :value="value"
                :id="'trade_' + value"
                v-model="item.buyorsell"
              />
              {{ value }}
            </label>
          </div>
        </td>
        <td>
          <span class="view">
            {{ item.quantity }}
          </span>
          <input
            v-model="item.quantity"
            type="text"
            class="form-control edit"
          />
        </td>

        <td>
          <span class="view">
            {{ item.price }}
          </span>
          <input v-model="item.price" type="text" class="form-control edit" />
        </td>
        <td>
          {{
            item.buyorsell == "Buy"
              ? -(item.price * (item.lotsize * item.quantity)).toFixed(2)
              : (item.price * (item.lotsize * item.quantity)).toFixed(2)
          }}
        </td>
        <td hidden>{{ item.note }}</td>

        <td class="text-white">
          <a
            class="btn btn-secondary  ml-2 view"
            @click="onInlineExitTrade(item)"
          >
            <i class="bi bi-box-arrow-right"></i>
          </a>
          <a
            class="btn btn-secondary text-warning ml-2 view"
            @click="onInlineEditTrade(item)"
          >
            <i class="bi bi-pencil"></i>
          </a>
          <a
            class="btn btn-secondary text-warning ml-2 edit"
            @click="onInlineSaveTrade(item)"
          >
            <i class="bi bi-plus-square"></i>
          </a>

          <a
            class="btn btn-secondary ml-2 text-danger"
            @click="onDeleteTrade(PropStrategy._id, item._id)"
          >
            <i class="bi bi-trash"></i>
          </a>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td v-show="PropStrategy.ismultiplesymbol"></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>
          {{ TotalAmount }}
        </td>
        <td hidden></td>
        <td></td>
      </tr>
    </tfoot>
  </table>
</template>
<script>
import { mapActions } from "vuex";
import myMixins from "../shared/utilitymixins";
export default {
  name: "TradeList",
  mixins: [myMixins],
  props: { PropStrategy: {} },
  methods: {
    ...mapActions(["AddEditTrade", "DeleteTrade"]),
    onDeleteTrade: function (sid, tid) {
      console.log("sid,tid :>> ", sid, tid);
      this.DeleteTrade({ sid, tid });
    },
    onInlineEditTrade: function (trade) {
      this.editTrade = trade;
    },
    onInlineSaveTrade: function (trade) {
      this.editTrade = null;
      this.AddEditTrade(trade);
    },
    onInlineExitTrade: function (trade) {
      var _exitTrade = { ...trade };
      _exitTrade.buyorsell = _exitTrade.buyorsell == "Buy" ? "Sell" : "Buy";
      _exitTrade._id = null;
      _exitTrade.sid = this.PropStrategy._id;
      console.log(trade);
      console.log(_exitTrade);
      this.AddEditTrade(_exitTrade);
    },
    onInc(trade) {
      trade.selectedstrike += parseFloat(trade.strikepricestep);
    },
    onDec(trade) {
      trade.selectedstrike -= parseFloat(trade.strikepricestep);
    },
  },
  data: function () {
    return {
      editTrade: null,
    };
  },
  computed: {
    TotalAmount: function () {
      var price = 0;
      this.PropStrategy.trades.forEach((_e) => {
        price =
          _e.buyorsell == "Buy"
            ? price - _e.price * (_e.lotsize * _e.quantity)
            : price + _e.price * (_e.lotsize * _e.quantity);
      });
      return price.toFixed(2);
    },
  },
};
</script>
<style scoped>
.form-control {
  width: 100px;
}
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
