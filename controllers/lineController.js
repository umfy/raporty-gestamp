const Line = require('../models/line')
const async = require('async')

const { body, validationResult } = require('express-validator')

// Display list of all lines.
exports.line_list = function (req, res, next) {
   Line.find().exec(function (err, list_lines) {
      if (err) {
         return next(err)
      }
      res.render('line_list', {
         title: 'Lista Linii',
         line_list: list_lines,
      })
   })
}

// Display detail page for a specific line.
// (low prioriy implementation)
exports.line_detail = function (req, res) {
   res.send('NOT IMPLEMENTED: line detail: ' + req.params.id)
}

// Display line create form on GET.
exports.line_create_get = function (req, res, next) {
   res.render('line_form', { title: 'Utwórz linię' })
}

// Handle line create on POST.
// It's an Array !
exports.line_create_post = [
   body('name', 'Nazwa linii jest wymagana.')
      .trim()
      .isLength({ min: 1 })
      .escape(),

   // custom validator that checks if a line with given name already exists
   body('name').custom((value) => {
      return Line.findOne({ name: value }).then((line) => {
         if (line) {
            return Promise.reject('Nazwa już jest w użyciu')
         }
      })
   }),
   //process request after validation and sanitization
   (req, res, next) => {
      // extract the validation errors from a request
      const errors = validationResult(req)

      var line = new Line({ name: req.body.name })

      if (!errors.isEmpty()) {
         // if there are errors, render the form
         res.render('line_form', {
            title: 'Utwórz linię',
            line: line,
            errors: errors.array(),
         })
         return
      } else {
         // if there are no errors, save line and redirect to 'view all lines' route
         line.save(function (err) {
            if (err) {
               return next(err)
            }
            res.redirect('/api/line')
         })
      }
   },
]

// Display line delete form on GET.
exports.line_delete_get = function (req, res, next) {
   res.send('NOT IMPLEMENTED: line delete GET')
}

// Handle line delete on POST.
exports.line_delete_post = function (req, res) {
   res.send('NOT IMPLEMENTED: line delete POST')
}

// Display line update form on GET.
exports.line_update_get = function (req, res) {
   res.send('NOT IMPLEMENTED: line update GET')
}

// Handle line update on POST.
exports.line_update_post = function (req, res) {
   res.send('NOT IMPLEMENTED: line update POST')
}
