const mongoose = require("mongoose");
const schema = mongoose.Schema,
  model = mongoose.model.bind(mongoose);
const BUYORSELL = {
  BUY: 0,
  SELL: 1,
};
const CALLPUTFUT = {
  CALL: 0,
  PUT: 1,
  FUT: 2,
};

const tradeSchema = schema({
  issell: {
    type: Boolean,
  },
  isfuture: {
    type: Boolean,
  },
  iscall :{
    type: Boolean,
  },
  // callorputorfut: {
  //   type: CALLPUTFUT,
  // },
  quantity: {
    type: Number,
  },
  tradeType: {
    type: String,
  },
  daystoexpiry: {
    type: Number,
  },
  strikeprice: {
    type: Number,
  },
  premiumprice: {
    type: Number,
  },
});

module.exports = model("Trade", tradeSchema);
