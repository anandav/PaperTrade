<template>
  <table class="min-w-full divide-y divide-gray-400">
    <thead>
      <tr class="text-left">
        <th class="w-1/12 view">
          <label><input type="checkbox" /> </label>
        </th>
        <th class="w-1/12" v-show="PropStrategy.ismultiplesymbol">Symbol</th>
        <th class="w-1/12">Lot Size</th>
        <th class="w-1/12" v-show="!PropStrategy.ismultiplesymbol">
          Strike Step
        </th>
        <th class="w-1/12">Selected Strike</th>
        <th class="w-1/12">Type</th>
        <th class="w-1/12">Buy/Sell</th>
        <th class="w-1/12">Qty</th>
        <th class="w-1/12">Spot Price</th>
        <th class="w-1/12">Total Price</th>
        <th class="w-1/12" hidden>Note</th>
        <th class="w-5/12"></th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in PropStrategy.trades"
        :key="item._id"
        :class="{ isTradeEdit: item == editTrade }"
        v-cloak
      >
        <td class="w-1/12 view">
          <label>
            <input type="checkbox" name="" id="" />
          </label>
        </td>
        <td v-show="PropStrategy.ismultiplesymbol">
          <span class="view">
            {{ item.symbol }}
          </span>
          <input type="text" class="w-10 edit" v-model="item.symbol" />
        </td>

        <td>
          <span class="view">
            {{ item.lotsize }}
          </span>
          <input v-model="item.lotsize" type="text" class="mini-edit edit" />
        </td>
        <td v-show="!PropStrategy.ismultiplesymbol" class="d-none">
          <span class="view">
            {{ item.strikepricestep }}
          </span>
          <input
            v-model="item.strikepricestep"
            type="number"
            class="mini-edit edit"
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
                class="mini-edit"
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
          <switchbutton :Trade="item" />
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
          <input v-model="item.quantity" type="text" class="mini-edit edit" />
        </td>

        <td>
          <span class="view">
            {{ item.price }}
          </span>
          <input v-model="item.price" type="text" class="mini-edit edit" />
        </td>
        <td>
          {{
            item.buyorsell == "Buy"
              ? -(item.price * (item.lotsize * item.quantity)).toFixed(2)
              : (item.price * (item.lotsize * item.quantity)).toFixed(2)
          }}
        </td>
        <td hidden>{{ item.note }}</td>

        <td class="">
          <a class="btn ml-2 view" @click="onInlineExitTrade(item)">
            <i class="material-icons">close</i>
          </a>
          <a class="btn ml-2 view" @click="onInlineEditTrade(item)">
            <i class="material-icons">edit</i>
          </a>
          <a class="btn ml-2 edit" @click="onInlineSaveTrade(item)">
            <i class="material-icons">save</i>
          </a>

          <a
            class="btn ml-2 text-red-600"
            @click="onDeleteTrade(PropStrategy._id, item._id)"
          >
            <i class="material-icons">delete</i>
          </a>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td></td>
        <td v-show="PropStrategy.ismultiplesymbol"></td>
        <td></td>
        <td></td>
        <td v-show="!PropStrategy.ismultiplesymbol"></td>
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
import switchbutton from "./ui/switchbutton";
export default {
  name: "TradeList",
  mixins: [myMixins],
  components: {
    switchbutton
    
  },
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
