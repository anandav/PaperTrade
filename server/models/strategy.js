require("./trade");
require('./portfolio');
const mongoose = require('mongoose');
const schema = mongoose.Schema,
      model = mongoose.model.bind(mongoose),
      tradeSchema = mongoose.model("Trade").schema,
      portfolioSchema = mongoose.model("Portfolio").schema;

const startegySchema = schema({
  Name: {
    type : String
  },
  Description:{
    type : String
  },
  Symbol:{
    type: String
  },
  CreatedOn : {
    type: Date,
    default : Date.now()
  },
  Trades : [tradeSchema],
  Porfolios : [portfolioSchema]	
});

module.exports = model("Startegy", startegySchema);
