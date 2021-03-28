const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: { type: String, required: true, maxlength: 100 },
  surname: { type: String, required: true, maxlength: 100 },
  email: { type: String, maxlength: 100 },
  phone: { type: String, maxlength: 100 },
  spec: { type: String, maxlength: 100 },
  shift: { type: Number },
  isTech: { type: Boolean },
  isAdmin: { type: Boolean },
})

// Virtual for user's full name
UserSchema.virtual('fullname').get(function () {
  return this.surname + ', ' + this.name
})

// Virtual for user's URL
UserSchema.virtual('url').get(function () {
  return '/api/user/' + this._id
})

//Export model
module.exports = mongoose.model('User', UserSchema)
