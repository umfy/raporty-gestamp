const mongoose = require('mongoose')

const Schema = mongoose.Schema

const InspectionSchema = new Schema({
   kettle: { type: String },
   compressor: { type: String },
   ice: { type: String },
   electric: { type: String },
   workshop: { type: String },
   isKettle: { type: Boolean, required: true },
   isCompressor: { type: Boolean, required: true },
   isIce: { type: Boolean, required: true },
   isElectric: { type: Boolean, required: true },
   isWorkshop: { type: Boolean, required: true },
})

// Virtual for plan's URL
InspectionSchema.virtual('url').get(function () {
   return '/api/inspection/' + this._id
})

//Export model
module.exports = mongoose.model('Inspection', InspectionSchema)
