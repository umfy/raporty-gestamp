const Plan = require('../models/plan')
const User = require('../models/user')

const { body, validationResult } = require('express-validator')

// Display list of all plans.
exports.plan_list = function (req, res, next) {
   Plan.find()
      .sort([['date_execution', 'ascending']])
      .exec(function (err, list_plans) {
         if (err) {
            return next(err)
         }
         res.render('plan_list', {
            title: 'Lista prac planowanych',
            plan_list: list_plans,
         })
      })
}

// Display detail page for a specific plan.
exports.plan_detail = function (req, res, next) {
   Plan.findById(req.params.id)
      .populate('user')
      .exec(function (err, plan) {
         if (err) {
            return next(err)
         }
         if (plan == null) {
            let err = new Error('Nie znaleziono takiego planu')
            err.status(404)
            return next(err)
         }
         res.render('plan_detail', { title: 'Zaplanowane zadanie', plan: plan })
      })
}

// Display plan create form on GET.
exports.plan_create_get = function (req, res, next) {
   User.find().exec(function (err, users) {
      if (err) {
         return next(err)
      }
      res.render('plan_form', {
         title: 'Zaplanuj pracę',
         user_list: users,
         shift_names: ['Poranna', 'Popołudniowa', 'Nocna'],
      })
   })
}

// Handle plan create on POST.
exports.plan_create_post = [
   body('desc', 'Opis jest wymagany').isLength({ min: 1 }).escape(),
   body('date_created').optional({ checkFalsy: true }).isISO8601().toDate(),
   body('date_execution').optional({ checkFalsy: true }).isISO8601().toDate(),
   body('shift').escape().toInt(),
   body('isDone').escape().toBoolean(),
   body('comments').escape(),

   (req, res, next) => {
      const errors = validationResult(req)

      let plan = new Plan({
         desc: req.body.desc,
         date_created: new Date(),
         date_execution: req.body.date_execution,
         shift: req.body.shift,
         isDone: false,
         comments: req.body.comments,
         user: req.body.user,
      })

      if (!errors.isEmpty()) {
         User.find().exec(function (err, users) {
            if (err) {
               return next(err)
            }
            res.render('plan_form', {
               title: 'Zaplanuj pracę',
               user_list: users,
               plan: plan,
               shift_names: ['Poranna', 'Popołudniowa', 'Nocna'],
               errors: errors.array(),
            })
         })

         return
      } else {
         plan.save(function (err) {
            if (err) {
               return next(err)
            }
            res.redirect(plan.url)
         })
      }
   },
]

// Display plan delete form on GET.
exports.plan_delete_get = function (req, res) {
   res.send('NOT IMPLEMENTED: plan delete GET')
}

// Handle plan delete on POST.
exports.plan_delete_post = function (req, res) {
   res.send('NOT IMPLEMENTED: plan delete POST')
}

// Display plan update form on GET.
exports.plan_update_get = function (req, res) {
   res.send('NOT IMPLEMENTED: plan update GET')
}

// Handle plan update on POST.
exports.plan_update_post = function (req, res) {
   res.send('NOT IMPLEMENTED: plan update POST')
}
