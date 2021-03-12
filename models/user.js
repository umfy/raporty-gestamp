var mongoose = require('mongoose')

var Schema = mongoose.Schema

var UserSchema = new Schema({
   name: { type: String, required: true, maxlength: 100 },
   surname: { type: String, required: true, maxlength: 100 },
   email: { type: String, required: true, maxlength: 100 },
   spec: { type: String, maxlength: 100 },
   isTech: { type: Boolean },
   isAdmin: { type: Boolean },
})

// Virtual for user's full name
UserSchema.virtual('displayname').get(function () {
   return this.name + ', ' + this.surname
})

// Virtual for user's URL
UserSchema.virtual('url').get(function () {
   return '/api/user/' + this._id
})

//Export model
module.exports = mongoose.model('User', UserSchema)
