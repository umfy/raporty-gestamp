var mongoose = require('mongoose')

var Schema = mongoose.Schema

var DevicetypeSchema = new Schema({
   name: { type: String, required: true, maxlength: 100 },
})

// Virtual for plan's URL
DeviceSchema.virtual('url').get(function () {
   return '/api/device/' + this._id
})

//Export model
module.exports = mongoose.model('Device', LineSchema)
