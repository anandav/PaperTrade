const mongoose = require("mongoose");
const schema = mongoose.Schema,
  model = mongoose.model.bind(mongoose);
const BUYORSELL = {
  BUY: 0,
  SELL: 1,
};

const tradeSchema = schema({
  BuyOrSell: {
    type: BUYORSELL,
  },
  Quantity: {
    type: Number,
  },
  TradeType: {
    type: String,
  },
  DayToExpiry: {
    type: Number,
  },
  StrikePrice: {
    type: Number,
  },
  PremiumPrice: {
    type: Number,
  }
});

module.exports = model("Trade", tradeSchema);
