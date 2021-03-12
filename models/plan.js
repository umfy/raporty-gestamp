var mongoose = require('mongoose')

var Schema = mongoose.Schema

var PlanSchema = new Schema({
   desc: { type: String, required: true },
   date_created: { type: Date, required: true },
   date_execution: { type: Date },
   shift: { type: Number },
   isDone: { type: Boolean, required: true },
   comments: { type: String },
   created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
})

// Virtual for plan's URL
PlanSchema.virtual('url').get(function () {
   return '/api/plan/' + this._id
})

//Export model
module.exports = mongoose.model('Plan', PlanSchema)
