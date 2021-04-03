const User = require('../models/user')
const Plan = require('../models/plan')

const async = require('async')

const { body, validationResult } = require('express-validator')

exports.user_team_get = function (req, res, next) {
  User.find()
    .sort([['spec', 'ascending']])
    .exec(function (err, list_users) {
      if (err) {
        return next(err)
      }
      res.render('user_team', {
        title: 'Skład zmany',
        user_list: list_users,
      })
    })
}

exports.user_team_post = function (req, res, next) {
  const transferedUsers = JSON.parse(req.body.transfered)
  for (i = 0; i < transferedUsers.length; i++) {
    User.findByIdAndUpdate(
      transferedUsers[i][0],
      { shift: transferedUsers[i][1] },
      {},
      function (err, theuser) {
        if (err) {
          return next(err)
        }
      }
    )
  }

  res.redirect('/api/user/team')
}

// Display list of all userss.
exports.user_list = function (req, res, next) {
  User.find()
    .sort([['surname', 'ascending']])
    .exec(function (err, list_users) {
      if (err) {
        return next(err)
      }
      res.render('user_list', {
        title: 'Lista Pracowników',
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
exports.user_create_get = function (req, res, next) {
  res.render('user_form', { title: 'Dodaj Pracownika' })
}

// Handle users create on POST.
exports.user_create_post = [
  // Validate and sanitise fields.

  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Imię jest wymagane')
    .bail(),
  body('surname')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Nazwisko jest wymagane')
    .bail(),
  body('email', 'Adres email jest nieprawidłowy')
    .optional({ checkFalsy: true })
    .isEmail()
    .normalizeEmail(),
  body('phone').escape(),
  body('spec').escape(),
  body('isTech').toBoolean(),
  body('isAdmin').toBoolean(),

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
        shift: 0,
        phone: req.body.phone,
        isTech: req.body.isTech,
        isAdmin: req.body.isAdmin,
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
exports.user_delete_get = function (req, res, next) {
  async.parallel(
    {
      user: function (callback) {
        User.findById(req.params.id).exec(callback)
      },
      user_plans: function (callback) {
        Plan.find({ user: req.params.id }).exec(callback)
        // user_raports !
      },
    },
    function (err, results) {
      if (err) {
        return next(err)
      }
      if (results.user == null) {
        // No results.
        res.redirect('/api/user')
      }
      // Successful, so render.
      res.render('user_delete', {
        title: 'Usuń użytkownika',
        user: results.user,
        user_plans: results.user_plans,
      })
    }
  )
}
// Handle user delete on POST.
exports.user_delete_post = function (req, res) {
  async.parallel(
    {
      user: function (callback) {
        User.findById(req.body.userid).exec(callback)
      },
      user_plans: function (callback) {
        Plan.find({ user: req.body.userid }).exec(callback)
      },
    },
    function (err, results) {
      if (err) {
        return next(err)
      }
      // Success
      if (results.user_plans.length > 0) {
        // user has devices. Render in same way as for GET route.
        res.render('user_delete', {
          title: 'Usuń użytkownika',
          user: results.user,
          user_plans: results.user_plans,
        })
        return
      } else {
        // Author has no books. Delete object and redirect to the list of authors.
        User.findByIdAndRemove(req.body.userid, function deleteUser(err) {
          if (err) {
            return next(err)
          }
          // Success - go to author list
          res.redirect('/api/user')
        })
      }
    }
  )
}

// Display user update form on GET.
exports.user_update_get = function (req, res) {
  User.findById(req.params.id).exec(function (err, user) {
    console.log('usr: ', user)
    if (err) {
      return next(err)
    }
    if (user == null) {
      var err = new Error('User not found')
      err.status = 404
      return next(err)
    }
    // success
    res.render('user_form', {
      title: 'Edytuj użytkownika',
      user: user,
    })
  })
}

// Handle user update on POST.
exports.user_update_post = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Imię jest wymagane')
    .bail(),
  body('surname')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Nazwisko jest wymagane')
    .bail(),
  body('email', 'Adres email jest nieprawidłowy')
    .optional({ checkFalsy: true })
    .isEmail()
    .normalizeEmail(),
  body('phone').escape(),
  body('spec').escape(),
  body('isTech').toBoolean(),
  body('isAdmin').toBoolean(),

  (req, res, next) => {
    const errors = validationResult(req)

    let user = new User({
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      phone: req.body.phone,
      spec: req.body.spec,
      shift: 0,
      isTech: req.body.isTech,
      isAdmin: req.body.isAdmin,
      _id: req.params.id,
    })

    if (!errors.isEmpty()) {
      res.render('user_form', {
        title: 'Edytuj użytkownika',
        user: user,
      })
    } else {
      User.findByIdAndUpdate(req.params.id, user, {}, function (err, theuser) {
        if (err) {
          return next(err)
        }
        res.redirect(theuser.url)
      })
    }
  },
]
