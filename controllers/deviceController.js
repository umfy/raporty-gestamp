const Device = require('../models/device')
const Devicetype = require('../models/devicetype')
const Line = require('../models/line')

const async = require('async')
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
exports.device_detail = function (req, res) {
   res.send('NOT IMPLEMENTED: device detail: ' + req.params.id)
}

// Display device create form on GET.
exports.device_create_get = function (req, res) {
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
// HERE
exports.book_create_post = [
   // Convert the genre to an array.
   (req, res, next) => {
      if (!(req.body.genre instanceof Array)) {
         if (typeof req.body.genre === 'undefined') req.body.genre = []
         else req.body.genre = new Array(req.body.genre)
      }
      next()
   },

   // Validate and sanitise fields.
   body('title', 'Title must not be empty.')
      .trim()
      .isLength({ min: 1 })
      .escape(),
   body('author', 'Author must not be empty.')
      .trim()
      .isLength({ min: 1 })
      .escape(),
   body('summary', 'Summary must not be empty.')
      .trim()
      .isLength({ min: 1 })
      .escape(),
   body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }).escape(),
   body('genre.*').escape(),

   // Process request after validation and sanitization.
   (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req)

      // Create a Book object with escaped and trimmed data.
      var book = new Book({
         title: req.body.title,
         author: req.body.author,
         summary: req.body.summary,
         isbn: req.body.isbn,
         genre: req.body.genre,
      })

      if (!errors.isEmpty()) {
         // There are errors. Render form again with sanitized values/error messages.

         // Get all authors and genres for form.
         async.parallel(
            {
               authors: function (callback) {
                  Author.find(callback)
               },
               genres: function (callback) {
                  Genre.find(callback)
               },
            },
            function (err, results) {
               if (err) {
                  return next(err)
               }

               // Mark our selected genres as checked.
               for (let i = 0; i < results.genres.length; i++) {
                  if (book.genre.indexOf(results.genres[i]._id) > -1) {
                     results.genres[i].checked = 'true'
                  }
               }
               res.render('book_form', {
                  title: 'Create Book',
                  authors: results.authors,
                  genres: results.genres,
                  book: book,
                  errors: errors.array(),
               })
            }
         )
         return
      } else {
         // Data from form is valid. Save book.
         book.save(function (err) {
            if (err) {
               return next(err)
            }
            //successful - redirect to new book record.
            res.redirect(book.url)
         })
      }
   },
]

// Display device delete form on GET.
exports.device_delete_get = function (req, res) {
   res.send('NOT IMPLEMENTED: device delete GET')
}

// Handle device delete on POST.
exports.device_delete_post = function (req, res) {
   res.send('NOT IMPLEMENTED: device delete POST')
}

// Display device update form on GET.
exports.device_update_get = function (req, res) {
   res.send('NOT IMPLEMENTED: device update GET')
}

// Handle device update on POST.
exports.device_update_post = function (req, res) {
   res.send('NOT IMPLEMENTED: device update POST')
}
