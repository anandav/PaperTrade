require("./trade");
require('./portfolio');
const mongoose = require('mongoose');
const schema = mongoose.Schema,
      model = mongoose.model.bind(mongoose),
      tradeSchema = mongoose.model("Trade").schema,
      portfolioSchema = mongoose.model("Portfolio").schema;

const startegySchema = schema({
  name: {
    type : String
  },
  description:{
    type : String
  },
  symbol:{
    type: String
  },
  createdOn : {
    type: Date,
    default : Date.now()
  },
  trades : [tradeSchema],
  porfolios : [portfolioSchema]	
});

module.exports = model("Startegy", startegySchema);
