const mongoose = require('mongoose')
const { DateTime } = require('luxon')

const Schema = mongoose.Schema

const PlanSchema = new Schema({
   desc: { type: String, required: true },
   date_created: { type: Date, required: true },
   date_execution: { type: Date },
   shift: { type: Number },
   isDone: { type: Boolean, required: true },
   comments: { type: String },
   user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
})

PlanSchema.virtual('virtual_date_execution').get(function () {
   return DateTime.fromJSDate(this.date_execution).toISODate(DateTime.DATE_MED)
})
PlanSchema.virtual('virtual_num_to_word').get(function () {
   shift_names = ['Poranna', 'Popołudniowa', 'Nocna']
   return shift_names[this.shift - 1]
})

// Virtual for plan's URL
PlanSchema.virtual('url').get(function () {
   return '/api/plan/' + this._id
})

//Export model
module.exports = mongoose.model('Plan', PlanSchema)
