const mongoose = require('mongoose');
const schema = mongoose.Schema,
      model = mongoose.model.bind(mongoose);
const tradeSchema = schema({
  Symbol: String,
  TradeType:String,
  SymbolType : String,
  QTY : Number,
  StrikePrice : Number,
  SpotPricke : Number

});

module.exports = model("Trade", tradeSchema);
