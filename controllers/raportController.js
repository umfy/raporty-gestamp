const Raport = require('../models/raport')
const User = require('../models/user')
const Plan = require('../models/plan')
const Line = require('../models/line')
const Devicetype = require('../models/devicetype')
const Device = require('../models/device')
const Inspection = require('../models/inspection')
const Breakdown = require('../models/breakdown')
const async = require('async')

function createEmptyInspection() {
  let inspection = new Inspection({
    kettle: '',
    compressor: '',
    ice: '',
    electric: '',
    workshop: '',
    isKettle: false,
    isCompressor: false,
    isIce: false,
    isElectric: false,
    isWorkshop: false,
  })
  inspection.save(function (err) {
    if (err) {
      return next(err)
    }
  })
  return inspection
}

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
  res.send('NOT IMPLEMENTED: raport detail get')
}

exports.raport_create = function (req, res, next) {
  let today = new Date()
  res.render('raport_pick', { today: today })
}

// Display raport create form on GET.
exports.raport_create_get = function (req, res, next) {
  // read SHIFT NUM from logged user
  let shift_num = req.params.shift
  let today = new Date()
  let tomorrow = new Date()
  today.setHours(0, 0, 0, 0)
  tomorrow.setHours(24, 0, 0, 0)

  let inspectionPlaces = [
    ['kettle', 'isKettle', 'Kotłownia'],
    ['compressor', 'isCompressor', 'Kompresownia'],
    ['ice', 'isIce', 'Wieża Chłodu'],
    ['electric', 'isElectric', 'Rozdzielnia'],
    ['workshop', 'isWorkshop', 'Warsztat'],
  ]

  // check if Report for this day and shift exists

  async.parallel(
    {
      raport: function (callback) {
        Raport.find({
          date: {
            $gte: today,
            $lt: tomorrow,
          },
          shift: shift_num,
        })
          .populate('usersPresent')
          .populate('usersMissing')
          .populate('inspection')
          .populate('plan')
          .populate({
            path: 'breakdown',
            // populat nested array od ids
            populate: { path: 'line' },
          })
          .populate({
            path: 'breakdown',
            // populat nested array od ids
            populate: { path: 'devicetype' },
          })
          .populate({
            path: 'breakdown',
            // populat nested array od ids
            populate: { path: 'device' },
          })
          .exec(callback)
      },
      line: function (callback) {
        Line.find()
          .sort([['name', 'ascending']])
          .exec(callback)
      },
      devicetype: function (callback) {
        Devicetype.find()
          .sort([['name', 'ascending']])
          .exec(callback)
      },
      device: function (callback) {
        Device.find()
          .sort([['name', 'ascending']])
          .exec(callback)
      },
    },
    function (err, theresult) {
      if (err) {
        return next(err)
      }
      if (Object.keys(theresult.raport).length == 0) {
        // no reports found
        // create new Report
        inspection = createEmptyInspection()

        async.parallel(
          {
            user: function (callback) {
              User.find({ shift: shift_num }).exec(callback)
            },
            plan: function (callback) {
              Plan.find({
                date_execution: {
                  $gte: today,
                  $lt: tomorrow,
                },
                shift: shift_num,
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
              usersMissing: results.user,
              usersPresent: [],
              plan: results.plan,
              inspection: inspection,
            })
            console.log('raport: ', raport)
            raport.save(function (err) {
              if (err) {
                return next(err)
              }
              res.render('raport_form', {
                raport: raport,
                inspectionPlaces: inspectionPlaces,
                lineList: theresult.line,
                devicetypeList: theresult.devicetype,
                deviceList: theresult.device,
              })
            })
          }
        )
      } else {
        // Report found
        res.render('raport_form', {
          raport: theresult.raport[0],
          inspectionPlaces: inspectionPlaces,
          lineList: theresult.line,
          devicetypeList: theresult.devicetype,
          deviceList: theresult.device,
        })
      }
    }
  )
}

exports.raport_create_post = function (req, res, next) {
  if (req.body.action === 'postPresence') {
    // save PRESENCE in db
    usersMissing = JSON.parse(req.body.usersMissing)
    usersPresent = JSON.parse(req.body.usersPresent)

    Raport.findByIdAndUpdate(
      req.body.raportId,
      { usersPresent: usersPresent, usersMissing: usersMissing },
      {},
      function (err) {
        if (err) {
          return next(err)
        }
      }
    )
  }

  // save INSPECTION in database
  if (req.body.action === 'postInspection') {
    postPlaces = JSON.parse(req.body.postPlaces)
    Inspection.findByIdAndUpdate(
      req.body.inspectionId,
      postPlaces,
      {},
      function (err) {
        if (err) {
          return next(err)
        }
      }
    )
  }
  if (req.body.action === 'postPlan') {
    postPlans = JSON.parse(req.body.postPlans)
    for (i = 0; i < postPlans.length; i++) {
      Plan.findByIdAndUpdate(
        postPlans[i]._id,
        postPlans[i],
        {},
        function (err) {
          if (err) {
            return next(err)
          }
        }
      )
    }
  }
  if (req.body.action === 'postAdditional') {
    postAdditional = JSON.parse(req.body.postAdditional)
    Raport.findByIdAndUpdate(
      postAdditional._id,
      postAdditional,
      {},
      function (err) {
        if (err) {
          return next(err)
        }
      }
    )
  }
  if (req.body.action === 'postBreakdown') {
    postBreakdown = JSON.parse(req.body.postBreakdown)
    if (postBreakdown._id === undefined) {
      //creating breakdown and updating repo
      breakdown = new Breakdown(postBreakdown)
      breakdown.save(function (err) {
        if (err) {
          return next(err)
        }
        Raport.findByIdAndUpdate(req.body.raportId, {
          $push: { breakdown: { _id: breakdown._id } },
        }).exec(function (err, succ) {
          if (err) {
            return next(err)
          }
          //console.log('succ', succ)
        })
      })
      res.send(breakdown._id)
    } else {
      //updating breakdown
      Breakdown.findByIdAndUpdate(
        postBreakdown._id,
        postBreakdown,
        {},
        function (err) {
          if (err) {
            return next(err)
          }
        }
      )
    }
  }
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
