const mongoose = require('mongoose');
const schema = mongoose.Schema,
      model = mongoose.model.bind(mongoose),
      objectid = mongoose.Schema.Types.ObjectId;

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
  Strategies : [{
    type : objectid,
    ref: "Startegy"
  }]
});

module.exports = model("Portfolio", portfolioSchema);
