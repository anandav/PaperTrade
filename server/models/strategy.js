const mongoose = require('mongoose');
const schema = mongoose.Schema,
      model = mongoose.model.bind(mongoose),
      objectid = mongoose.Schema.Types.ObjectId;
      
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
  Trades : [{
    type : objectid,
    ref: "Trade"

  }]
});

module.exports = model("Startegy", startegySchema);
