const mongoose = require('mongoose');
const schema = mongoose.Schema,
      model = mongoose.model.bind(mongoose);

const splitPlanItemSchema = schema({
  symbol: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  lasttradedprice: {
    type: Number,
    default: 0
  },
  included: {
    type: Boolean,
    default: true
  }
});

const splitPlanSchema = schema({
  name: {
    type: String
  },
  amount: {
    type: Number,
    default: 0
  },
  useleftover: {
    type: Boolean,
    default: true
  },
  items: [splitPlanItemSchema],
  isactive: {
    type: Boolean,
    default: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdon: {
    type: Date,
    default: Date.now
  },
  modifiedon: {
    type: Date,
    default: Date.now
  }
});

module.exports = model("SplitPlan", splitPlanSchema);
