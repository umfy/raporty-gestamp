var User = require('../models/user.js')

// Display list of all userss.
exports.users_list = function (req, res) {
   res.send('NOT IMPLEMENTED: users list')
}

// Display detail page for a specific users.
exports.users_detail = function (req, res) {
   res.send('NOT IMPLEMENTED: users detail: ' + req.params.id)
}

// Display users create form on GET.
exports.users_create_get = function (req, res) {
   res.send('NOT IMPLEMENTED: users create GET')
}

// Handle users create on POST.
exports.users_create_post = function (req, res) {
   res.send('NOT IMPLEMENTED: users create POST')
}

// Display users delete form on GET.
exports.users_delete_get = function (req, res) {
   res.send('NOT IMPLEMENTED: users delete GET')
}

// Handle users delete on POST.
exports.users_delete_post = function (req, res) {
   res.send('NOT IMPLEMENTED: users delete POST')
}

// Display users update form on GET.
exports.users_update_get = function (req, res) {
   res.send('NOT IMPLEMENTED: users update GET')
}

// Handle users update on POST.
exports.users_update_post = function (req, res) {
   res.send('NOT IMPLEMENTED: users update POST')
}
