const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PresenceSchema = new Schema({
  raport: { type: Schema.Types.ObjectId, ref: 'Raport', required: true },
  userPresent: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  userMissing: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
})

// Virtual for presence's URL
PresenceSchema.virtual('url').get(function () {
  return '/api/presence/' + this._id
})

//Export model
module.exports = mongoose.model('Presence', PresenceSchema)
