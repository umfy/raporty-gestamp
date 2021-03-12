var mongoose = require('mongoose')

var Schema = mongoose.Schema

var DeviceSchema = new Schema({
   name: { type: String, required: true, maxlength: 100 },
   ip: { type: String, maxlength: 50 },
   line: { type: Schema.Types.ObjectId, ref: 'Line', required: true },
   devicetype: {
      type: Schema.Types.ObjectId,
      ref: 'Devicetype',
      required: true,
   },
   desc: { type: String, required: true },
})

// Virtual for plan's URL
DeviceSchema.virtual('url').get(function () {
   return '/api/device/' + this._id
})

//Export model
module.exports = mongoose.model('Device', DeviceSchema)
