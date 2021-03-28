const Raport = require('../models/raport')
const Inspection = require('../models/inspection')

const async = require('async')

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
exports.raport_detail = function (req, res) {
  res.send('NOT IMPLEMENTED: raport detail: ' + req.params.id)
}

// Display raport create form on GET.
exports.raport_create_get = function (req, res) {
  res.send('NOT IMPLEMENTED: raport create GET')
}

// Handle raport create on POST.
exports.raport_create_post = function (req, res) {
  res.send('NOT IMPLEMENTED: raport create POST')
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
