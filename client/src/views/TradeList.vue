<template>
  <table class="min-w-full divide-y divide-gray-500">
    <thead>
      <tr class="text-left">
        <th class="w-1/12 view">
          <label><input type="checkbox" v-model="SelectAll" /> </label>
        </th>
        <th class="w-1/12" v-show="PropStrategy.ismultiplesymbol">Symbol</th>
        <th class="w-1/12">Lot Size</th>
        <th class="w-1/12" v-show="!PropStrategy.ismultiplesymbol">Step</th>
        <th class="w-1/12">Strike Price</th>
        <th class="w-1/12">Type</th>
        <th class="w-1/12">B/S</th>
        <th class="w-1/12">Qty</th>
        <th class="w-1/12">Spot Price</th>
        <th class="w-1/12">Total Price</th>
        <th class="w-1/12" hidden>Note</th>
        <th class="w-5/12"></th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-600">
      <tr
        v-for="item in PropStrategy.trades"
        :key="item._id"
        :class="{ isTradeEdit: item == editTrade }"
        v-cloak
        class=""
      >
        <td>
          <label class="view">
            <input
              type="checkbox"
              :value="item._id"
              v-model="selectedIDs"
              @change="onCheckStateChanged(item)"
            />
            <!-- v-model="selectedIDs" -->
          </label>
        </td>
        <td v-show="PropStrategy.ismultiplesymbol">
          <span class="view">
            {{ item.symbol }}
          </span>
          <!-- <input type="text" class="w-10 edit" v-model="item.symbol" /> -->
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
            <div v-show="item.tradetype != 'Future'" class="flex flex-col">
              <div class="btn-nonrounded rounded-t-sm w-12">
                <a class="" @click="onDec(item)">-</a>
              </div>
              <input
                v-model="item.selectedstrike"
                @keydown.up="onInc(item)"
                @keydown.down="onDec(item)"
                type="text"
                class="text-right mini-edit-nonrounded"
              />
              <div class="btn-nonrounded rounded-b-sm w-12">
                <a class="" @click="onInc(item)">+</a>
              </div>
            </div>
          </div>
        </td>

        <td>
          <span class="view">
            {{ item.tradetype }}
          </span>
          <div class="">
            <label
              class="btn w-12 text-center edit"
              v-for="(value, key) in TRADETYPE"
              :key="key"
              :class="{
                'active text-green-400 dark:text-green-400':
                  value == [item.tradetype],
              }"
            >
              <input
                class="hidden"
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
          <SwitchButton :PropTrade="item" />
          <!-- <div class="btn-group btn-group-toggle edit">
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
          </div> -->
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
          <div class="space-x-1">
            <a class="btn inline-block view" @click="onInlineExitTrade(item)">
              <i class="material-icons">close</i>
            </a>
            <a class="btn inline-block view" @click="onInlineEditTrade(item)">
              <i class="material-icons">edit</i>
            </a>
            <a class="btn inline-block edit" @click="onInlineSaveTrade(item)">
              <i class="material-icons">save</i>
            </a>

            <a
              class="btn inline-block text-red-600 dark:text-red-700"
              @click="onDeleteTrade(PropStrategy._id, item._id)"
            >
              <i class="material-icons">delete</i>
            </a>
          </div>
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
import { mapActions, mapState } from "vuex";
import myMixins from "../shared/utilitymixins";
import SwitchButton from "../components/ui/SwitchButton";
export default {
  name: "TradeList",
  mixins: [myMixins],
  components: {
    SwitchButton,
  },
  data: function () {
    return {
      editTrade: null,
      selectedIDs: [],
    };
  },
  props: { PropStrategy: {}, PropSelectedTraded: { type: Array } },
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
    onInc: function (trade) {
      trade.selectedstrike += parseFloat(trade.strikepricestep);
    },
    onDec: function (trade) {
      trade.selectedstrike -= parseFloat(trade.strikepricestep);
    },
    onCheckStateChanged: function (trade) {
      trade.checked = !trade.checked;
      this.CheckStateChanged(this.PropStrategy);
      this.GenerateChart(this.PropStrategy);
    },
  },
  mounted() {
    this.SelectAll = true;
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
                  ? price - _e.price * (_e.lotsize * _e.quantity)
                  : price + _e.price * (_e.lotsize * _e.quantity);
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
