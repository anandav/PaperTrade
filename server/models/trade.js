const mongoose = require('mongoose');
const schema = mongoose.Schema,
      model = mongoose.model.bind(mongoose);

const tradeSchema = schema({
  Name :{
    type : String
  },
  Symbol: {
    type : String
  },
  TradeType:{
    type : String
  },
  SymbolType : {
    type : String
  },
  QTY : {
    type : String
  },
  StrikePrice : {
    type : String
  },
  SpotPricke : {
    type : String
  }
});

module.exports = model("Trade", tradeSchema);
