const Line = require('../models/line')
const Device = require('../models/device')
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
  Line.findById(req.params.id).exec(function (err, line) {
    if (err) {
      return next(err)
    }
    if (line == null) {
      let err = new Error('Nie znaleziono takiej linii')
      err.status(404)
      return next(err)
    }
    res.render('line_detail', { title: 'Linia', line: line })
  })
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

    let line = new Line({ name: req.body.name })

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
  async.parallel(
    {
      line: function (callback) {
        Line.findById(req.params.id).exec(callback)
      },
      line_devices: function (callback) {
        Device.find({ line: req.params.id }).exec(callback)
      },
    },
    function (err, results) {
      if (err) {
        return next(err)
      }
      if (results.line == null) {
        // No results.
        res.redirect('/api/line')
      }
      // Successful, so render.
      res.render('line_delete', {
        title: 'Usuń linię',
        line: results.line,
        line_devices: results.line_devices,
      })
    }
  )
}
// Handle line delete on POST.
exports.line_delete_post = function (req, res) {
  async.parallel(
    {
      line: function (callback) {
        Line.findById(req.body.lineid).exec(callback)
      },
      line_devices: function (callback) {
        Device.find({ line: req.body.lineid }).exec(callback)
      },
    },
    function (err, results) {
      if (err) {
        return next(err)
      }
      // Success
      if (results.line_devices.length > 0) {
        // line has devices. Render in same way as for GET route.
        res.render('line_delete', {
          title: 'Usuń linię',
          line: results.line,
          line_devices: results.line_devices,
        })
        return
      } else {
        // Author has no books. Delete object and redirect to the list of authors.
        Line.findByIdAndRemove(req.body.lineid, function deleteLine(err) {
          if (err) {
            return next(err)
          }
          // Success - go to author list
          res.redirect('/api/line')
        })
      }
    }
  )
}
// Display line update form on GET.
exports.line_update_get = function (req, res) {
  Line.findById(req.params.id).exec(function (err, line) {
    if (err) {
      return next(err)
    }
    if (line == null) {
      var err = new Error('Line not found')
      err.status = 404
      return next(err)
    }
    // success
    res.render('line_form', {
      title: 'Edytuj linię',
      line: line,
    })
  })
}

// Handle line update on POST.
exports.line_update_post = [
  body('name', 'Nazwa linii jest wymagana.')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req)

    let line = new Line({ name: req.body.name, _id: req.params.id })

    if (!errors.isEmpty()) {
      res.render('line_form', {
        title: 'Edytuj linię',
        line: line,
      })
    } else {
      Line.findByIdAndUpdate(req.params.id, line, {}, function (err, theline) {
        if (err) {
          return next(err)
        }
        res.redirect(theline.url)
      })
    }
  },
]
