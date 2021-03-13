const User = require('../models/user')

const async = require('async')

const { body, validationResult } = require('express-validator')
// Display list of all userss.
exports.user_list = function (req, res, next) {
   User.find()
      .sort([['surname', 'ascending']])
      .exec(function (err, list_users) {
         if (err) {
            return next(err)
         }
         res.render('user_list', {
            title: 'Lista Pracaowników',
            user_list: list_users,
         })
      })
}

// Display detail page for a specific users.
exports.user_detail = function (req, res, next) {
   User.findById(req.params.id).exec(function (err, user) {
      if (err) {
         return next(err)
      }
      if (user == null) {
         let err = new Error('Nie znaleziono takiego użytkownika')
         err.status = 404
         return next(err)
      }
      res.render('user_detail', { title: 'Pracownik UR', user: user })
   })
}

// Display users create form on GET.
exports.user_create_get = function (req, res) {
   res.render('user_form', { title: 'Dodaj Pracownika' })
}

// Handle users create on POST.
exports.user_create_post = [
   // Validate and sanitise fields.

   body('name', 'Należy podać imię.').trim().isLength({ min: 1 }).escape(),
   body('surname', 'Należy podać nazwisko.')
      .trim()
      .isLength({ min: 1 })
      .escape(),
   body('email').escape(),
   body('spec').escape(),
   body('isTech').escape(),
   body('isAdmin').escape(),

   // Process request after validation and sanitization.
   (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
         // There are errors. Render form again with sanitized values and error messages.
         res.render('user_form', {
            title: 'Dodaj Pracownika',
            user: req.body,
            errors: errors.array(),
         })

         return
      } else {
         // Create a USER object with escaped and trimmed data.
         // check if isAdmin is truthy or not
         let user = new User({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            spec: req.body.spec,
            isTech: req.body.isTech == true,
            isAdmin: req.body.isAdmin == true,
         })
         user.save(function (err) {
            if (err) {
               return next(err)
            }
            // Successful - redirect to new author record.
            res.redirect(user.url)
         })
      }
   },
]

// Display users delete form on GET.
exports.user_delete_get = function (req, res) {
   res.send('NOT IMPLEMENTED: users delete GET')
}

// Handle users delete on POST.
exports.user_delete_post = function (req, res) {
   res.send('NOT IMPLEMENTED: users delete POST')
}

// Display users update form on GET.
exports.user_update_get = function (req, res) {
   res.send('NOT IMPLEMENTED: users update GET')
}

// Handle users update on POST.
exports.user_update_post = function (req, res) {
   res.send('NOT IMPLEMENTED: users update POST')
}
