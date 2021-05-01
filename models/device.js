const mongoose = require('mongoose')

const Schema = mongoose.Schema

const DeviceSchema = new Schema({
  name: { type: String, required: true, maxlength: 100 },
  ip: { type: String, maxlength: 50 },
  line: { type: Schema.Types.ObjectId, ref: 'Line', required: true },
  operation: { type: Schema.Types.ObjectId, ref: 'Operation' },
  devicetype: {
    type: Schema.Types.ObjectId,
    ref: 'Devicetype',
    required: true,
  },
  desc: { type: String },
})

// Virtual for plan's URL
DeviceSchema.virtual('url').get(function () {
  return '/api/device/' + this._id
})

//Export model
module.exports = mongoose.model('Device', DeviceSchema)
