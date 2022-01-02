//require("./strategy");
const mongoose = require('mongoose');
const schema = mongoose.Schema,
      model = mongoose.model.bind(mongoose);

const portfolioSchema = schema({
  name: {
    type : String
  },
  exchange :{
    type : String
  },
  openingbalance :{
    type : Number
  },
  description:{
    type : String
  },
  order:{
    type: Number
  },
  createdon : {
    type: Date,
    default : Date.now()
  },
  modifiedon : {
    type: Date,
    default : Date.now()
  }
 // Strategies : [strategySchema]
});

module.exports = model("Portfolio", portfolioSchema);
