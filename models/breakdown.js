const mongoose = require('mongoose')
const { DateTime } = require('luxon')

const Schema = mongoose.Schema

const BreakdownSchema = new Schema({
  orderNumber: { type: String },
  line: { type: Schema.Types.ObjectId, ref: 'Line' },
  devicetype: { type: Schema.Types.ObjectId, ref: 'Devicetype' },
  device: { type: Schema.Types.ObjectId, ref: 'Device' },
  dateBegin: { type: Date },
  dateEnd: { type: Date },
  diagnostics: { type: String },
  treatment: { type: String },
  status: { type: Number },
  partsUsed: { type: String },
  partsToOrder: { type: String },
  plannedAction: { type: String },
})

// Virtual for user's URL
BreakdownSchema.virtual('url').get(function () {
  return '/api/breakdown/' + this._id
})

BreakdownSchema.virtual('full_duration').get(function () {
  return (
    DateTime.fromJSDate(this.dateBegin).toFormat('HH:mm') +
    '  —   ' +
    DateTime.fromJSDate(this.dateEnd).toFormat(' HH:mm')
  )
})

//Export model
module.exports = mongoose.model('Breakdown', BreakdownSchema)
