<template>
  <div>
    <table class="table text-light">
      <thead>
        <tr>
          <th v-show="PropStrategy.ismultiplesymbol" scope="col">Symbol</th>
          <th scope="col">Lot Size</th>
          <th scope="col">Buy/Sell</th>
          <th scope="col">Trade Type</th>
          <th scope="col">Quantity</th>
          <th scope="col">Selected Strike</th>
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
          :class="{ isEditing: item == editTrade }"
          v-cloak
        >
          <td v-show="PropStrategy.ismultiplesymbol">{{ item.symbol }}</td>
          <td>
            <span class="view">
              {{ item.lotsize }}
            </span>
            <div class="edit">edit</div>
          </td>
          <td>
            <span>
              {{ item.buyorsell }}
            </span>
            <div></div>
          </td>
          <td>
            <span>
              {{ item.tradetype }}
            </span>
            <div></div>
          </td>
          <td>
            <span>
              {{ item.quantity }}
            </span>
            <div></div>
          </td>
          <td>
            <span>
              {{ item.selectedstrike }}
            </span>
            <div></div>
          </td>
          <td>
            <span>
              {{ item.spotprice }}
            </span>
            <div></div>
          </td>
          <td>
            {{
              item.buyorsell == "Buy"
                ? -(item.spotprice * (item.lotsize * item.quantity))
                : item.spotprice * (item.lotsize * item.quantity)
            }}
          </td>
          <td hidden>{{ item.note }}</td>

          <td>
            <a
              class="btn btn-warning ml-2 text-dark view"
              @click="inlineEditTrade(item)"
            >
              <i class="bi bi-pencil"></i>
            </a>
            <a
              class="btn btn-warning ml-2 text-dark edit"
              @click="inlineSaveTrade(item)"
            >
              <i class="bi bi-plus-square"></i>
            </a>

            <a
              class="btn btn-danger ml-2 text-dark"
              @click="deleteTrade(PropStrategy._id, item._id)"
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
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "TradeList",
  props: { PropStrategy: {} },
  methods: {
    ...mapActions(["DeleteTrade"]),
    deleteTrade: function (sid, tid) {
      this.DeleteTrade({ sid, tid });
    },

    inlineEditTrade: function (trade) {
      this.editTrade = trade;
    },
    inlineSaveTrade : function(trade, pid){
      this.editTrade = null;
    }
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
            ? price - _e.spotprice * (_e.lotsize * _e.quantity)
            : price + _e.spotprice * (_e.lotsize * _e.quantity);
      });
      return price;
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
.isEditing .edit {
  display: block;
}
.isEditing .view {
  display: none;
}
</style>
