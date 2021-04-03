const mongoose = require('mongoose')

const Schema = mongoose.Schema

const RaportSchema = new Schema({
  date: { type: Date, required: true },
  shift: { type: Number, required: true },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  plan: [{ type: Schema.Types.ObjectId, ref: 'Plan' }],
  inspection: {
    type: Schema.Types.ObjectId,
    ref: 'Inspection',
    required: true,
  },
  breakdown: [{ type: Schema.Types.ObjectId, ref: 'Breakdown' }],
})

// Virtual for Raport's URL
RaportSchema.virtual('url').get(function () {
  return '/api/raport/' + this._id
})

//Export model
module.exports = mongoose.model('Raport', RaportSchema)
