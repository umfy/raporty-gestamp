const Devicetype = require('../models/devicetype')

const { body, validationResult } = require('express-validator')
// Display list of all devicetypes.
exports.devicetype_list = function (req, res, next) {
   Devicetype.find().exec(function (err, list_devicetypes) {
      if (err) {
         return next(err)
      }
      res.render('devicetype_list', {
         title: 'Lista typów urządzeń',
         devicetype_list: list_devicetypes,
      })
   })
}

// Display detail page for a specific devicetype.
exports.devicetype_detail = function (req, res) {
   res.send('NOT IMPLEMENTED: devicetype detail: ' + req.params.id)
}

// Display devicetype create form on GET.
exports.devicetype_create_get = function (req, res) {
   res.render('devicetype_form', { title: 'Utwórz typ urządzenia' })
}

// Handle devicetype create on POST.
exports.devicetype_create_post = [
   body('name', 'Nazwa urządzenia jest wymagana.')
      .trim()
      .isLength({ min: 1 })
      .escape(),

   // custom validator that checks if a devicetype with given name already exists
   body('name').custom((value) => {
      return Devicetype.findOne({ name: value }).then((devicetype) => {
         if (devicetype) {
            return Promise.reject('Nazwa już jest w użyciu')
         }
      })
   }),
   //process request after validation and sanitization
   (req, res, next) => {
      // extract the validation errors from a request
      const errors = validationResult(req)

      var devicetype = new Devicetype({ name: req.body.name })

      if (!errors.isEmpty()) {
         // if there are errors, render the form
         res.render('devicetype_form', {
            title: 'Utwórz linię',
            devicetype: devicetype,
            errors: errors.array(),
         })
         return
      } else {
         // if there are no errors, save devicetype and redirect to 'view all devicetypes' route
         devicetype.save(function (err) {
            if (err) {
               return next(err)
            }
            res.redirect('/api/devicetype')
         })
      }
   },
]

// Display devicetype delete form on GET.
exports.devicetype_delete_get = function (req, res) {
   res.send('NOT IMPLEMENTED: devicetype delete GET')
}

// Handle devicetype delete on POST.
exports.devicetype_delete_post = function (req, res) {
   res.send('NOT IMPLEMENTED: devicetype delete POST')
}

// Display devicetype update form on GET.
exports.devicetype_update_get = function (req, res) {
   res.send('NOT IMPLEMENTED: devicetype update GET')
}

// Handle devicetype update on POST.
exports.devicetype_update_post = function (req, res) {
   res.send('NOT IMPLEMENTED: devicetype update POST')
}
