const { ObjectId } = require("bson");
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
  symbol: {
    type: String
  },
  lotsize: {
    type: Number
  },
  // expiry: {
  //   type: Date
  // },
  buyorsell: {
    type: BUYORSELL,
  },
  tradetype: {
    type: CALLPUTFUT,
  },
  quantity: {
    type: Number,
  },
  selectedstrike: {
    type: Number,
  },
  price: {
    type: Number,
  },
  lasttradedprice:{
    type : Number,
  },
  isexit: {
    type: Boolean,
    default: false,
  },
  partnerid: {
    type: mongoose.Schema.Types.ObjectId,
  },
  note: {
    type: String
  },
  group: {
    type: String,
  },
  order :{
    type: Number
  },
  color:{
    type : String
  },
  createdon: {
    type: Date,
    default: Date.now(),
  },
  modifiedon: {
    type: Date,
    default: Date.now(),
  },


  strikepricemin: {
    type: Number,
    default: 0
  },
  strikepricemax: {
    type: Number,
    default: 0
  },
  strikepricestep: {
    type: Number,
    default: 0
  },


});

module.exports = model("Trade", tradeSchema);
