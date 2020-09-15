require("./strategy");
const mongoose = require('mongoose');
const schema = mongoose.Schema,
      model = mongoose.model.bind(mongoose),
      strategySchema = mongoose.model("Startegy").schema;

const portfolioSchema = schema({
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
  ModifiedOn : {
    type: Date,
    default : Date.now()
  },
  Strategies : [strategySchema]
});

module.exports = model("Portfolio", portfolioSchema);
