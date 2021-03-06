const Raport = require('../models/raport')
const User = require('../models/user')
const Plan = require('../models/plan')
const Line = require('../models/line')
const Devicetype = require('../models/devicetype')
const Device = require('../models/device')
const Inspection = require('../models/inspection')
const Breakdown = require('../models/breakdown')
const async = require('async')
const path = require('path')
const puppeteer = require('puppeteer')

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
function saveDayArray(list_raports) {
  let dayArray = []
  for (let i = 0; i < list_raports.length; i++) {
    if (list_raports[i].shift === 1) {
      dayArray[1] = list_raports[i]._id
    }
    if (list_raports[i].shift === 2) {
      dayArray[2] = list_raports[i]._id
    }
    if (list_raports[i].shift === 3) {
      dayArray[3] = list_raports[i]._id
    }
  }
  return dayArray
}
function createRaport(dateStart, dateEnd) {
  inspection = createEmptyInspection()
  dayArray = []
  for (let shift_num = 1; shift_num <= 3; shift_num++) {
    async.parallel(
      {
        user: function (callback) {
          User.find({ shift: shift_num }).exec(callback)
        },
        plan: function (callback) {
          Plan.find({
            date_execution: {
              $gte: dateStart,
              $lt: dateEnd,
            },
            shift: shift_num,
          }).exec(callback)
        },
      },
      function (err, results) {
        if (err) {
          return next(err)
        }
        // Successful
        let raport = new Raport({
          date: dateStart,
          shift: shift_num,
          usersMissing: results.user,
          usersPresent: [],
          plan: results.plan,
          inspection: inspection,
        })
        raport.save(function (err) {
          if (err) {
            return next(err)
          }
        })
        dayArray[shift_num] = raport._id
      }
    )
  }
  return dayArray
}
// Display the HUB
exports.raport_list = function (req, res, next) {
  let raportYesterday = []
  let raportTomorrow = []
  let raportToday = []
  let tomorrow0 = new Date()
  let tomorrow24 = new Date()
  tomorrow0.setHours(30, 0, 0, 0)
  tomorrow24.setHours(53, 59, 0, 0)
  let today0 = new Date()
  let today24 = new Date()
  today0.setHours(6, 0, 0, 0)
  today24.setHours(29, 59, 0, 0)
  let yesterday0 = new Date()
  let yesterday24 = new Date()
  yesterday0.setHours(-18, 0, 0, 0)
  yesterday24.setHours(5, 59, 0, 0)

  //find report for TOMORROW
  Raport.find(
    {
      date: {
        $gte: tomorrow0,
        $lt: tomorrow24,
      },
    },
    ['_id', 'shift']
  ).exec(function (err, list_raports_tomorrow) {
    if (err) {
      return next(err)
    }
    if (Object.keys(list_raports_tomorrow).length === 0) {
      // no reports found
      raportTomorrow = createRaport(tomorrow0, tomorrow24)
    } else {
      // raports for tomorrow were found so
      raportTomorrow = saveDayArray(list_raports_tomorrow)
    }

    //find report for TODAY
    Raport.find(
      {
        date: {
          $gte: today0,
          $lt: today24,
        },
      },
      ['_id', 'shift']
    ).exec(function (err, list_raports_today) {
      if (err) {
        return next(err)
      }
      if (Object.keys(list_raports_today).length === 0) {
        // no reports found
        raportToday = createRaport(today0, today24)
      } else {
        // raports for today were found so
        raportToday = saveDayArray(list_raports_today)
      }
      //find report for YESTERDAY
      console.log(yesterday0)
      console.log(yesterday24)
      Raport.find(
        {
          date: {
            $gte: yesterday0,
            $lt: yesterday24,
          },
        },
        ['_id', 'shift']
      ).exec(function (err, list_raports_yesterday) {
        if (err) {
          return next(err)
        }
        if (Object.keys(list_raports_yesterday).length !== 0) {
          // Raports FOUND so:
          raportYesterday = saveDayArray(list_raports_yesterday)
          // I don't care about those that don't exist
        }
        // todd = new Date()
        // todd.setHours(30, 0, 0, 0)
        res.render('raport_pick', {
          raportToday: raportToday,
          raportTomorrow: raportTomorrow,
          raportYesterday: raportYesterday,
        })
      })
    })
  })
}

// Display detail page for a specific raport.
exports.raport_detail = function (req, res, next) {
  let inspectionPlaces = [
    ['kettle', 'isKettle', 'Kot??ownia'],
    ['compressor', 'isCompressor', 'Kompresownia'],
    ['ice', 'isIce', 'Wie??a Ch??odu'],
    ['electric', 'isElectric', 'Rozdzielnia'],
    ['workshop', 'isWorkshop', 'Warsztat'],
  ]
  Raport.findById(req.params.id)
    .populate('usersPresent')
    .populate('usersMissing')
    .populate('inspection')
    .populate('plan')
    .populate({
      path: 'breakdown',
      populate: { path: 'line' },
    })
    .populate({
      path: 'breakdown',
      populate: { path: 'devicetype' },
    })
    .populate({
      path: 'breakdown',
      populate: { path: 'device' },
    })
    .exec(function (err, raport) {
      if (err) {
        return next(err)
      }
      if (raport == null) {
        let err = new Error('Nie znaleziono takiego raportu')
        err.status = 404
        return next(err)
      }
      res.render('raport_detail', {
        raport: raport,
        inspectionPlaces: inspectionPlaces,
      })
    })
}
exports.raport_detail_pdf = function (req, res, next) {
  let inspectionPlaces = [
    ['kettle', 'isKettle', 'Kot??ownia'],
    ['compressor', 'isCompressor', 'Kompresownia'],
    ['ice', 'isIce', 'Wie??a Ch??odu'],
    ['electric', 'isElectric', 'Rozdzielnia'],
    ['workshop', 'isWorkshop', 'Warsztat'],
  ]
  Raport.findById(req.params.id)
    .populate('usersPresent')
    .populate('usersMissing')
    .populate('inspection')
    .populate('plan')
    .populate({
      path: 'breakdown',
      populate: { path: 'line' },
    })
    .populate({
      path: 'breakdown',
      populate: { path: 'devicetype' },
    })
    .populate({
      path: 'breakdown',
      populate: { path: 'device' },
    })
    .exec(function (err, raport) {
      if (err) {
        return next(err)
      }
      if (raport == null) {
        let err = new Error('Nie znaleziono takiego raportu')
        err.status = 404
        return next(err)
      }
      res.render('raport_pdf', {
        raport: raport,
        inspectionPlaces: inspectionPlaces,
      })
    })
}
exports.raport_detail_download = function (req, res, next) {
  ;(async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(
      'http://localhost:3000/api/raport/' + req.params.id + '/pdf',
      {
        waitUntil: 'networkidle2',
      }
    )
    await page.pdf({ path: 'raport.pdf', format: 'a4' })

    await browser.close()
    res.sendFile(path.join(__dirname, '../', 'raport.pdf'))
  })()
}

// Display raport create form on GET.
exports.raport_create_get = function (req, res, next) {
  let inspectionPlaces = [
    ['kettle', 'isKettle', 'Kot??ownia'],
    ['compressor', 'isCompressor', 'Kompresownia'],
    ['ice', 'isIce', 'Wie??a Ch??odu'],
    ['electric', 'isElectric', 'Rozdzielnia'],
    ['workshop', 'isWorkshop', 'Warsztat'],
  ]
  // modify raport route -- works when valid _id is passed in request url
  async.parallel(
    {
      raport: function (callback) {
        Raport.findById(req.params.id)
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
      if (theresult == null) {
        var err = new Error('Raport not found')
        err.status = 404
        return next(err)
      }
      // success
      res.render('raport_form', {
        raport: theresult.raport,
        inspectionPlaces: inspectionPlaces,
        lineList: theresult.line,
        devicetypeList: theresult.devicetype,
        deviceList: theresult.device,
      })
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
  Raport.findById(req.params.id).exec(function (err, raport) {
    if (err) {
      return next(err)
    }
    if (raport == null) {
      let err = new Error('Nie znaleziono takiego raportu')
      err.status = 404
      return next(err)
    }
    res.render('raport_delete.pug', { raport: raport })
  })
}

// Handle raport delete on POST.
exports.raport_delete_post = function (req, res) {
  Raport.findByIdAndRemove(req.body.raportId, function (err) {
    if (err) {
      return next(err)
    }
    // Success - go to author list
    res.redirect('/api/raport')
  })
}

// Display raport update form on GET.
exports.raport_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: raport update GET')
}

// Handle raport update on POST.
exports.raport_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: raport update POST')
}
