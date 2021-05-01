const Devicetype = require('../models/devicetype')
const Device = require('../models/device')

const async = require('async')
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
  Devicetype.findById(req.params.id).exec(function (err, devicetype) {
    if (err) {
      return next(err)
    }
    if (devicetype == null) {
      let err = new Error('Nie znaleziono takiego Typu Urządzenia')
      err.status(404)
      return next(err)
    }
    res.render('devicetype_detail', {
      title: 'Typ Urządzenia',
      devicetype: devicetype,
    })
  })
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
        title: 'Utwórz Typ Urządzenia',
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
exports.devicetype_delete_get = function (req, res, next) {
  async.parallel(
    {
      devicetype: function (callback) {
        Devicetype.findById(req.params.id).exec(callback)
      },
      devicetype_devices: function (callback) {
        Device.find({ devicetype: req.params.id }).exec(callback)
      },
    },
    function (err, results) {
      if (err) {
        return next(err)
      }
      if (results.devicetype == null) {
        // No results.
        res.redirect('/api/devicetype')
      }
      // Successful, so render.
      res.render('devicetype_delete', {
        title: 'Usuń Typ Urządzenia',
        devicetype: results.devicetype,
        devicetype_devices: results.devicetype_devices,
      })
    }
  )
}
// Handle devicetype delete on POST.
exports.devicetype_delete_post = function (req, res) {
  async.parallel(
    {
      devicetype: function (callback) {
        Devicetype.findById(req.body.devicetypeid).exec(callback)
      },
      devicetype_devices: function (callback) {
        Device.find({ devicetype: req.body.devicetypeid }).exec(callback)
      },
    },
    function (err, results) {
      if (err) {
        return next(err)
      }
      // Success
      if (results.devicetype_devices.length > 0) {
        // devicetype has devices. Render in same way as for GET route.
        res.render('devicetype_delete', {
          title: 'Usuń Typ Urządzenia',
          devicetype: results.devicetype,
          devicetype_devices: results.devicetype_devices,
        })
        return
      } else {
        // Author has no books. Delete object and redirect to the list of authors.
        Devicetype.findByIdAndRemove(
          req.body.devicetypeid,
          function deleteDevicetype(err) {
            if (err) {
              return next(err)
            }
            // Success - go to author list
            res.redirect('/api/devicetype')
          }
        )
      }
    }
  )
}
// Display devicetype update form on GET.
exports.devicetype_update_get = function (req, res) {
  Devicetype.findById(req.params.id).exec(function (err, devicetype) {
    if (err) {
      return next(err)
    }
    if (devicetype == null) {
      var err = new Error('Devicetype not found')
      err.status = 404
      return next(err)
    }
    // success
    res.render('devicetype_form', {
      title: 'Stwórz urządzenie',
      devicetype: devicetype,
    })
  })
}

// Handle devicetype update on POST.
exports.devicetype_update_post = [
  body('name', 'Nazwa typu urządzenia jest wymagana.')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req)

    let devicetype = new Devicetype({
      name: req.body.name,
      _id: req.params.id,
    })

    if (!errors.isEmpty()) {
      res.render('devicetype_form', {
        title: 'Stwórz Typ Urządzenia',
        devicetype: devicetype,
      })
    } else {
      Devicetype.findByIdAndUpdate(
        req.params.id,
        devicetype,
        {},
        function (err, thedevicetype) {
          if (err) {
            return next(err)
          }
          res.redirect(thedevicetype.url)
        }
      )
    }
  },
]
