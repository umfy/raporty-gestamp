const mongoose = require('mongoose')

const Schema = mongoose.Schema

const LineSchema = new Schema({
   name: { type: String, required: true, maxlength: 100 },
})

// Virtual for plan's URL
LineSchema.virtual('url').get(function () {
   return '/api/line/' + this._id
})

//Export model
module.exports = mongoose.model('Line', LineSchema)
