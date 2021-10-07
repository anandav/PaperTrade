<template>
  <!-- <div class="rounded-xl overflow-hidden bg-gradient-to-r from-pink-50 to-pink-100 p-10"></div> -->
  <div class="table w-full shadow-md border-collapse">
    <div class="table-row-group">
      <div class="table-row text-xs text-white text-center ">
        <div class="table-cell px-1 py-4">
          <label><input type="checkbox" v-model="SelectAll" /> </label>
        </div>
        <div class="px-1 py-4 hidden">Symbol</div>
        <div class="table-cell px-1 py-4">Lot Size</div>
        <div class="table-cell px-1 py-4">Step</div>
        <div class="table-cell px-1 py-4">Strike Price</div>
        <div class="table-cell px-1 py-4">Type</div>
        <div class="table-cell px-1 py-4">B/S</div>
        <div class="table-cell px-1 py-4">Qty</div>
        <div class="table-cell px-1 py-4">Spot Price</div>
        <div class="table-cell px-1 py-4">Total Price</div>
        <div class="table-cell px-1 w-28">Action</div>
      </div>
    </div>
    <div class="table-row-group">
      <div
        class="table-row text-right border-t border-gray-600"
        v-for="item in PropStrategy.trades"
        :key="item._id"
        :class="{ isTradeEdit: item == editTrade }"
        v-cloak
      >
        <!-- <div class="table-cell px-1 py-4">
          <svg viewBox="0 0 24 24" role="presentation">
            <path
              d="M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z"
              style="fill: currentcolor; --darkreader-inline-fill: currentcolor"
              data-darkreader-inline-fill=""
            ></path>
          </svg>
        </div> -->
        <div class="table-cell px-1 py-4">
          <label
            ><input
              type="checkbox"
              :value="item._id"
              v-model="selectedIDs"
              @change="onCheckStateChanged(item)"
            />
          </label>
        </div>
        <div class="px-1 py-4 hidden">{{ item.symbol }}</div>
        <div class="table-cell px-1 py-4">
          <span class="view">
            {{ item.lotsize }}
          </span>
          <input v-model="item.lotsize" type="text" class="mini-edit edit" />
        </div>
        <div class="table-cell px-1 py-4">
          <span class="view">
            {{ item.strikepricestep }}
          </span>
          <input
            v-model="item.strikepricestep"
            type="number"
            class="mini-edit edit"
          />
        </div>
        <div class="table-cell px-1 py-4">
          <span class="view">
            {{ item.selectedstrike }}
          </span>

          <div class="edit">
            <div v-show="item.tradetype != 'Future'" class="flex flex-col">
              <!-- <div class="btn-nonrounded rounded-t-sm w-12">
                <a class="" @click="onDec(item)">-</a>
              </div> -->
              <input
                v-model="item.selectedstrike"
                @keydown.up="onInc(item)"
                @keydown.down="onDec(item)"
                type="text"
                class="mini-edit text-right mini-edit-nonrounded"
              />
              <!-- <div class="btn-nonrounded rounded-b-sm w-12">
                <a class="" @click="onInc(item)">+</a>
              </div> -->
            </div>
          </div>
        </div>
        <div class="table-cell px-1 py-4">
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

            <!-- <label
              class="btn-mini edit"
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
            </label> -->
          </div>
        </div>
        <div class="table-cell px-1 py-4">
          <span class="view">
            {{ item.buyorsell }}
          </span>
          <SwitchButton :PropTrade="item" />
        </div>
        <div class="table-cell px-1 py-4">
          <span class="view">
            {{ item.quantity }}
          </span>
          <input v-model="item.quantity" type="text" class="mini-edit edit" />
        </div>
        <div class="table-cell px-1 py-4">
          <span class="view">
            {{ item.price }}
          </span>
          <input v-model="item.price" type="text" class="mini-edit edit" @keydown.enter="onInlineSaveTrade(item)" />
        </div>
        <div class="table-cell px-1 py-4">
          {{
            item.buyorsell == "Buy"
              ? -(item.price * (item.lotsize * item.quantity)).toFixed(2)
              : (item.price * (item.lotsize * item.quantity)).toFixed(2)
          }}
        </div>
        <div class="table-cell px-1">
          <div class="space-x-1">
            <a class="btn inline-block view" @click="onInlineExitTrade(item)">
              <i class="material-icons">door_back</i>
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
        </div>
      </div>
    </div>
    <div class="table-row-group">
      <div class="table-row text-right border-t-2 border-gray-500">
        <div class="table-cell"></div>
        <div class="hidden"></div>
        <div class="table-cell"></div>
        <div class="table-cell"></div>
        <div class="table-cell"></div>
        <div class="table-cell"></div>
        <div class="table-cell"></div>
        <div class="table-cell"></div>
        <div class="table-cell"></div>
        <div class="table-cell px-1 py-4">{{ TotalAmount }}</div>
        <div class="table-cell"></div>
        <div class="table-cell"></div>
      </div>
    </div>
  </div>

  <!-- <div class="table text-right w-full border-collapse">
    <div class="table-row-group">
      <div class="table-row border-b-2 border-gray-600">
        <div class="table-cell">
          <label><input type="checkbox" v-model="SelectAll" /> </label>
        </div>
        <div class="table-cell hidden">Symbol</div>
        <div class="table-cell">Lot Size</div>
        <div class="table-cell">Step</div>
        <div class="table-cell">Strike Price</div>
        <div class="table-cell">Type</div>
        <div class="table-cell">B/S</div>
        <div class="table-cell">Qty</div>
        <div class="table-cell">Spot Price</div>
        <div class="table-cell">Total Price</div>
        <div class="table-cell">Action</div>
      </div>
    </div>

    <div class="table-row-group">
      <div
        class="table-row border-b-2 border-gray-600"
        v-for="item in PropStrategy.trades"
        :key="item._id"
        :class="{ isTradeEdit: item == editTrade }"
        v-cloak
      >
        <div class="table-cell">
          <input
            type="checkbox"
            :value="item._id"
            v-model="selectedIDs"
            @change="onCheckStateChanged(item)"
          />
        </div>
        <div class="table-cell hidden">
          <span class="view">
            {{ item.symbol }}
          </span>
        </div>
        <div class="table-cell">
          <span class="view">
            {{ item.lotsize }}
          </span>
          <input v-model="item.lotsize" type="text" class="mini-edit edit" />
        </div>
        <div class="table-cell">
          <span class="view">
            {{ item.strikepricestep }}
          </span>
          <input
            v-model="item.strikepricestep"
            type="number"
            class="mini-edit edit"
          />
        </div>
        <div class="table-cell">
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
        </div>
        <div class="table-cell">
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
        </div>
        <div class="table-cell">
          <span class="view">
            {{ item.buyorsell }}
          </span>
          <SwitchButton :PropTrade="item" />
        </div>
        <div class="table-cell">
          <span class="view">
            {{ item.quantity }}
          </span>
          <input v-model="item.quantity" type="text" class="mini-edit edit" />
        </div>
        <div class="table-cell">
          <span class="view">
            {{ item.price }}
          </span>
          <input v-model="item.price" type="text" class="mini-edit edit" />
        </div>
        <div class="table-cell">
          {{
            item.buyorsell == "Buy"
              ? -(item.price * (item.lotsize * item.quantity)).toFixed(2)
              : (item.price * (item.lotsize * item.quantity)).toFixed(2)
          }}
        </div>
        <div class="table-cell">
          <div class="space-x-1">
            <a class="btn inline-block view" @click="onInlineExitTrade(item)">
              <i class="material-icons">door_back</i>
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
        </div>
      </div>
      <div class="table-row">
        <div class="table-cell"></div>
        <div class="table-cell hidden"></div>
        <div class="table-cell"></div>
        <div class="table-cell"></div>
        <div class="table-cell"></div>
        <div class="table-cell"></div>
        <div class="table-cell"></div>
        <div class="table-cell"></div>
        <div class="table-cell"></div>
        <div class="table-cell">{{ TotalAmount }}</div>
        <div class="table-cell"></div>
        <div class="table-cell"></div>
      </div>
    </div>
  </div> -->

  <!--<table class="min-w-full divide-y divide-gray-500">
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
         
          </label>
        </td>
        <td v-show="PropStrategy.ismultiplesymbol">
          <span class="view">
            {{ item.symbol }}
          </span>
     
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
            
              <i class="material-icons">door_back</i>
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
  </table> -->
</template>
<script>
import { mapActions, mapState } from "vuex";
import myMixins from "../shared/utilitymixins";
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
    };
  },
  props: {
    PropStrategy: {},
    PropSelectedTraded: { type: Array },
    editTrade: null,
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
