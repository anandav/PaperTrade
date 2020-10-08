//require("./strategy");
const mongoose = require('mongoose');
const schema = mongoose.Schema,
      model = mongoose.model.bind(mongoose);
     // strategySchema = mongoose.model("Startegy").schema;

const portfolioSchema = schema({
  name: {
    type : String
  },
  description:{
    type : String
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
