const Raport = require('../models/raport')
const User = require('../models/user')
const Plan = require('../models/plan')
const Line = require('../models/line')
const Devicetype = require('../models/devicetype')
const Device = require('../models/device')
const Inspection = require('../models/inspection')
const Breakdown = require('../models/breakdown')
const async = require('async')
// Display list of all searchs.
exports.search_raport_get = function (req, res, next) {
  let inspectionPlaces = [
    ['kettle', 'isKettle', 'Kotłownia'],
    ['compressor', 'isCompressor', 'Kompresownia'],
    ['ice', 'isIce', 'Wieża Chłodu'],
    ['electric', 'isElectric', 'Rozdzielnia'],
    ['workshop', 'isWorkshop', 'Warsztat'],
  ]
  async.parallel(
    {
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
      user: function (callback) {
        User.find()
          .sort([['name', 'ascending']])
          .exec(callback)
      },
    },
    function (err, theresult) {
      if (err) {
        return next(err)
      }
      res.render('search_form.pug', {
        inspectionPlaces: inspectionPlaces,
        lineList: theresult.line,
        devicetypeList: theresult.devicetype,
        deviceList: theresult.device,
        userList: theresult.user,
      })
    }
  )
}

// Display detail page for a specific search.
exports.search_raport_post = function (req, res, next) {
  // By default, Mongoose does not cast filter properties that aren't in your schema.
  let queryInspection = {}
  let queryBreakdown = {}
  if (req.body.inspection !== 'defaultvalue') {
    queryInspection[req.body.inspection] = false
  }
  if (req.body.line !== 'defaultvalue') {
    queryBreakdown['line'] = req.body.line
  }
  if (req.body.devicetype !== 'defaultvalue') {
    queryBreakdown['devicetype'] = req.body.devicetype
  }
  if (req.body.device !== 'defaultvalue') {
    queryBreakdown['device'] = req.body.device
  }

  async.parallel(
    {
      inspection: function (callback) {
        Inspection.find(queryInspection, ['_id']).exec(callback)
      },
      breakdown: function (callback) {
        Breakdown.find(queryBreakdown, ['_id']).exec(callback)
      },
    },
    function (err, result) {
      if (err) {
        return next(err)
      }
      res.send(result.breakdown)
    }
  )

  res.send(breakdown)

  // paralell find inspections and breakdowns
  // then find report
  // Raport.find({
  //   date: {
  //     $gte: req.body.dateStart,
  //     $lt: req.body.dateEnd,
  //   },
  //   shift: req.body.shiftnum,
  // }).exec(function (err, raport) {
  //   if (err) {
  //     return next(err)
  //   }
  //   res.send(raport)
  // })
}

// Display list of all breakdowns
exports.search_breakdown_get = function (req, res) {
  res.send('NOT IMPLEMENTED: search page get')
}

// Display detail page for a specific breakdown.
exports.search_breakdown_post = function (req, res) {
  res.render('NOT IMPLEMENTED: search page post')
}
