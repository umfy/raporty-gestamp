const mongoose = require('mongoose')

const Schema = mongoose.Schema

const BreakdownSchema = new Schema({
  orderNumber: { type: String },
  line: { type: Schema.Types.ObjectId, ref: 'Line' },
  devicetype: { type: Schema.Types.ObjectId, ref: 'Devicetype' },
  device: { type: Schema.Types.ObjectId, ref: 'Device' },
  dateBegin: { type: Date },
  dateEnd: { type: Date },
  diagnostics: { type: String },
  causes: { type: String },
  action: { type: String },
  status: { type: Boolean },
  plannedActions: { type: String },
  partsUsed: { type: String },
  partsToOrder: { type: String },
})

// Virtual for user's URL
BreakdownSchema.virtual('url').get(function () {
  return '/api/breakdown/' + this._id
})

//Export model
module.exports = mongoose.model('Breakdown', UserSchema)
