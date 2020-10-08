const mongoose = require("mongoose");
const schema = mongoose.Schema,
  model = mongoose.model.bind(mongoose);
const BUYORSELL = {
  BUY: 0,
  SELL: 1,
};

const tradeSchema = schema({
  buyorsell: {
    type: BUYORSELL,
  },
  quantity: {
    type: Number,
  },
  tradeType: {
    type: String,
  },
  daytoexpiry: {
    type: Number,
  },
  strikeprice: {
    type: Number,
  },
  premiumprice: {
    type: Number,
  }
});

module.exports = model("Trade", tradeSchema);
