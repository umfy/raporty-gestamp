const mongoose = require('mongoose')

const Schema = mongoose.Schema

const DevicetypeSchema = new Schema({
   name: { type: String, required: true, maxlength: 100 },
})

// Virtual for plan's URL
DevicetypeSchema.virtual('url').get(function () {
   return '/api/device/' + this._id
})

//Export model
module.exports = mongoose.model('Devicetype', DevicetypeSchema)
