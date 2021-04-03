const Raport = require('../models/raport')
const User = require('../models/user')
const Plan = require('../models/plan')
const Inspection = require('../models/inspection')
const Presence = require('../models/presence')
const async = require('async')

const datesAreOnSameDay = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate()

// Display list of all raports.
exports.raport_list = function (req, res, next) {
  Raport.find().exec(function (err, list_raports) {
    if (err) {
      return next(err)
    }
    res.render('raport_list', {
      title: 'Lista Raportów',
      raport_list: list_raports,
    })
  })
}

// Display detail page for a specific raport.
exports.raport_detail = function (req, res, next) {
  res.send('NOT IMPLEMENTED: raport detail: ' + req.params.id)
}

// Display raport create form on GET.
exports.raport_create_get = function (req, res, next) {
  // read SHIFT NUM from logged user
  let shift_num = 1
  let today = new Date()

  // check if Report for this day and shift exists
  Raport.find({
    date: {
      $gte: today.setHours(0, 0, 0, 0),
      $lt: today.setHours(24, 0, 0, 0),
    },
    shift: shift_num,
  })
    .populate('users')
    .exec(function (err, raport) {
      if (err) {
        return next(err)
      }
      if (Object.keys(raport).length == 0) {
        console.log('nie znalazłam :(')

        // create new Report
        let inspection = new Inspection({
          kettle: '',
          compressor: '',
          ice: '',
          electric: '',
          workshop: '',
          isKettle: undefined,
          isCompressor: undefined,
          isIce: undefined,
          isElectric: undefined,
          isWorkshop: undefined,
        })
        async.parallel(
          {
            user: function (callback) {
              User.find({ shift: shift_num }).exec(callback)
            },
            plan: function (callback) {
              Plan.find({
                date_execution: {
                  $gte: today.setHours(0, 0, 0, 0),
                  $lt: today.setHours(24, 0, 0, 0),
                },
              }).exec(callback)
            },
          },
          function (err, results) {
            if (err) {
              return next(err)
            }
            // Successful, so render.

            let raport = new Raport({
              date: new Date(),
              shift: shift_num,
              users: results.user,
              plan: results.plan,
              inspection: inspection,
            })
            raport.save(function (err) {
              if (err) {
                return next(err)
              }
              // Successful
              res.render('raport_form', {
                raport: raport,
              })
            })
          }
        )
      } else {
        // rendering existing rapo
        // because Mongoose 'find' function was used, the result is [{result}]
        res.render('raport_form', {
          raport: raport[0],
        })
      }
    })
}

exports.raport_create_post = function (req, res, next) {
  // save PRESENCE in db
  postUsers = JSON.parse(req.body.postUsers)
  userPresent = []
  userMissing = []
  for (i = 0; i < postUsers.length; i++) {
    if (postUsers[i][1] === true) {
      userPresent.push(postUsers[i][0])
    } else {
      userMissing.push(postUsers[i][0])
    }
  }
  let presence = new Presence({
    raport: req.body.raportId,
    userPresent: userPresent,
    userMissing: userMissing,
  })
  presence.save(function (err) {
    if (err) {
      return next(err)
    }
  })
}
// Display raport delete form on GET.
exports.raport_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: raport delete GET')
}

// Handle raport delete on POST.
exports.raport_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: raport delete POST')
}

// Display raport update form on GET.
exports.raport_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: raport update GET')
}

// Handle raport update on POST.
exports.raport_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: raport update POST')
}
