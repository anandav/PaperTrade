<template>
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
      <tr v-for="item in PropStrategy.trades" :key="item._id">
        <td v-show="PropStrategy.ismultiplesymbol">{{ item.symbol }}</td>
        <td>{{ item.lotsize }}</td>
        <td>{{ item.buyorsell }}</td>
        <td>{{ item.tradetype }}</td>
        <td>{{ item.quantity }}</td>
        <td>{{ item.selectedstrike }}</td>
        <td>{{ item.spotprice }}</td>
        <td>
          {{
            item.buyorsell == "Buy"
              ? -(item.spotprice * item.lotsize)
              : item.spotprice * item.lotsize
          }}
        </td>
        <td hidden>{{ item.note }}</td>

        <td>
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
        <td>
        </td>
      </tr>
    </tfoot>
  </table>
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
  },
  computed: {
    TotalAmount: function () {
      var price = 0;
      this.PropStrategy.trades.forEach((_e) => {
        if (_e.buyorsell == "Buy") {
          price -= _e.spotprice * _e.lotsize;
        } else {
          price += _e.spotprice * _e.lotsize;
        }
      });
      return price;
    },
  },
};
</script>
