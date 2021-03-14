const Device = require('../models/device')
const Devicetype = require('../models/devicetype')
const Line = require('../models/line')
const Plan = require('../models/plan')

const async = require('async')
const { body, validationResult } = require('express-validator')
// Display list of all devices.
exports.device_list = function (req, res, next) {
   Device.find().exec(function (err, list_devices) {
      if (err) {
         return next(err)
      }
      res.render('device_list', {
         title: 'Lista Urządzeń',
         device_list: list_devices,
      })
   })
}

// Display detail page for a specific device.
exports.device_detail = function (req, res, next) {
   Device.findById(req.params.id)
      .populate('line')
      .populate('devicetype')
      .exec(function (err, device) {
         if (err) {
            return next(err)
         }
         if (device == null) {
            // No results.
            var err = new Error('Device not found')
            err.status = 404
            return next(err)
         }
         // Successful, so render.
         res.render('device_detail', {
            title: device.name,
            device: device,
         })
      })
}

// Display device create form on GET.
exports.device_create_get = function (req, res, next) {
   async.parallel(
      {
         lines: function (callback) {
            Line.find(callback)
         },
         devicetypes: function (callback) {
            Devicetype.find(callback)
         },
      },
      function (err, results) {
         if (err) {
            return next(err)
         }
         res.render('device_form', {
            title: 'Dodaj urządzenie',
            lines: results.lines,
            devicetypes: results.devicetypes,
         })
      }
   )
}

// Handle device create on POST.
exports.device_create_post = [
   // Validate and sanitise fields.
   body('name', 'Nazwa urządzenia musi być podana.')
      .isLength({ min: 1 })
      .escape(),
   body('ip', 'Błędne IP').trim().escape(),
   body('line', 'Linia musi zostać podana.').isLength({ min: 1 }).escape(),
   body('devicetype', 'Typ urządzenia musi być podany.')
      .isLength({ min: 1 })
      .escape(),
   body('desc', 'Nieprawidłowy opis').escape(),

   // Process request after validation and sanitization.
   (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req)

      // Create a Book object with escaped and trimmed data.
      let device = new Device({
         name: req.body.name,
         ip: req.body.ip,
         line: req.body.line,
         devicetype: req.body.devicetype,
         desc: req.body.desc,
      })

      if (!errors.isEmpty()) {
         // There are errors. Render form again with sanitized values/error messages.

         // Get all ips and genres for form.
         async.parallel(
            {
               lines: function (callback) {
                  Line.find(callback)
               },
               devicetypes: function (callback) {
                  Devicetype.find(callback)
               },
            },
            function (err, results) {
               if (err) {
                  return next(err)
               }
               res.render('device_form', {
                  title: 'Dodaj urządzenie',
                  device: device,
                  lines: results.lines,
                  devicetypes: results.devicetypes,
                  errors: errors.array(),
               })
            }
         )
         return
      } else {
         // Data from form is valid. Save device.
         device.save(function (err) {
            if (err) {
               return next(err)
            }
            //successful - redirect to new device record.
            res.redirect(device.url)
         })
      }
   },
]

// Display device delete form on GET.
exports.device_delete_get = function (req, res, next) {
   async.parallel(
      {
         device: function (callback) {
            Device.findById(req.params.id).exec(callback)
         },
         device_plans: function (callback) {
            Plan.find({ divice: req.params.id }).exec(callback)
         },
         // device_raports: function (callback) {
         //    Raport.find({ device: req.params.id }).exec(callback)
         // },
      },
      function (err, results) {
         if (err) {
            return next(err)
         }
         if (results.device == null) {
            // No results.
            res.redirect('/api/device')
         }
         // Successful, so render.
         res.render('device_delete', {
            title: 'Usuń urządzenie',
            device: results.device,
            device_plans: results.device_plans,
         })
      }
   )
}
// Handle device delete on POST.
exports.device_delete_post = function (req, res) {
   async.parallel(
      {
         device: function (callback) {
            Device.findById(req.body.deviceid).exec(callback)
         },
         device_plans: function (callback) {
            Plan.find({ line: req.body.lineid }).exec(callback)
         },
         //device_raport: function (callback) {
         //   Raport.find({ device: req.body.deviceid }).exec(callback)
         //},
      },
      function (err, results) {
         if (err) {
            return next(err)
         }
         // Success

         Device.findByIdAndRemove(
            req.body.deviceid,
            function deleteDevice(err) {
               if (err) {
                  return next(err)
               }
               // Success - go to author list
               res.redirect('/api/device')
            }
         )
      }
   )
}
// Display device update form on GET.
exports.device_update_get = function (req, res, next) {
   async.parallel(
      {
         device: function (callback) {
            Device.findById(req.params.id)
               .populate('line')
               .populate('devicetype')
               .exec(callback)
         },
         devicetypes: function (callback) {
            Devicetype.find(callback)
         },
         lines: function (callback) {
            Line.find(callback)
         },
      },

      function (err, results) {
         if (err) {
            return next(err)
         }
         if (results.device == null) {
            let err = new Error('Device not found')
            err.status = 404
            return next(err)
         }
         // Success
         res.render('device_form', {
            title: 'Edytuj urządzenie',
            device: results.device,
            lines: results.lines,
            devicetypes: results.devicetypes,
         })
      }
   )
}

// Handle device update on POST.
exports.device_update_post = [
   body('name', 'Nazwa urządzenia musi być podana.')
      .isLength({ min: 1 })
      .escape(),
   body('ip', 'Błędne IP').trim().escape(),
   body('line', 'Linia musi zostać podana.').isLength({ min: 1 }).escape(),
   body('devicetype', 'Typ urządzenia musi być podany.')
      .isLength({ min: 1 })
      .escape(),
   body('desc', 'Nieprawidłowy opis').escape(),

   (req, res, next) => {
      const errors = validationResult(req)

      let device = new Device({
         name: req.body.name,
         ip: req.body.ip,
         line: req.body.line,
         devicetype: req.body.devicetype,
         desc: req.body.desc,
         _id: req.params.id,
      })

      if (!errors.isEmpty()) {
         res.render('device_form', {
            title: 'Edytuj urządzenie',
            device: device,
            lines: results.lines,
            devicetypes: results.devicetypes,
            errors: errors.array(),
         })
      } else {
         Device.findByIdAndUpdate(
            req.params.id,
            device,
            {},
            function (err, thedevice) {
               if (err) {
                  return next(err)
               }
               res.redirect(thedevice.url)
            }
         )
      }
   },
]
