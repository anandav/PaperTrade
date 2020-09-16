require("./trade");
const mongoose = require('mongoose');
const schema = mongoose.Schema,
      model = mongoose.model.bind(mongoose),
      tradeSchema = mongoose.model("Trade").schema;

const startegySchema = schema({
  Name: {
    type : String
  },
  Description:{
    type : String
  },
  CreatedOn : {
    type: Date,
    default : Date.now()
  },
  Trades : [tradeSchema]
});

module.exports = model("Startegy", startegySchema);
