var express = require('express')
var router = express.Router()

var plan_controller = require('../controllers/planController')
var raport_controller = require('../controllers/raportController')
var search_controller = require('../controllers/searchController')
var users_controller = require('../controllers/userController')
var device_controller = require('../controllers/deviceController')

/// DEVICE ROUTES ///

// GET request for list of all device items
router.get('/device', device_controller.device_list)

// GET request for one device item
router.get('/device/:id', device_controller.device_detail)

// GET request for creating new device
router.get('/device/create', device_controller.device_create_get)

// POST request for creating new device
router.post('/device/create', device_controller.device_create_post)

// GET request to delete device
router.get('/device/:id/delete', device_controller.device_delete_get)

// POST request to delete device
router.post('/device/:id/delete', device_controller.device_delete_post)

// GET request to update device
router.get('/device/:id/update', device_controller.device_update_get)

// POST request to update device
router.post('/device/:id/update', device_controller.device_update_post)

/// PLAN-OWANE PRACE ROUTES ///

// GET request for list of all prace plan-owane items
router.get('/plan', plan_controller.plan_list)

// GET request for one plan item
router.get('/plan/:id', plan_controller.plan_detail)

// GET request for creating new plan
router.get('/plan/create', plan_controller.plan_create_get)

// POST request for creating new plan
router.post('/plan/create', plan_controller.plan_create_post)

// GET request to delete plan
router.get('/plan/:id/delete', plan_controller.plan_delete_get)

// POST request to delete plan
router.post('/plan/:id/delete', plan_controller.plan_delete_post)

// GET request to update plan
router.get('/plan/:id/update', plan_controller.plan_update_get)

// POST request to update plan
router.post('/plan/:id/update', plan_controller.plan_update_post)

/// RAPORT ROUTES ///

// GET request for list of all raport items
// pagination later ! -> view 10 latest raports
router.get('/raport', raport_controller.raport_list)

// GET request for one raport item
router.get('/raport/:id', raport_controller.raport_detail)

// GET request for creating new raport
router.get('/raport/create', raport_controller.raport_create_get)

// POST request for creating new raport
router.post('/raport/create', raport_controller.raport_create_post)

// GET request to delete raport
router.get('/raport/:id/delete', raport_controller.raport_delete_get)

// POST request to delete raport
router.post('/raport/:id/delete', raport_controller.raport_delete_post)

// GET request to update raport
router.get('/raport/:id/update', raport_controller.raport_update_get)

// POST request to update raport
router.post('/raport/:id/update', raport_controller.raport_update_post)

/// SEARCH ROUTES ///

// GET request for search page
router.get('/search', search_controller.search_page_get)

// POST route to search for specific items
router.post('/search', search_controller.search_page_post)

/// USERS  ROUTES ///

// GET request for list of all users items
router.get('/users', users_controller.users_list)

// GET request for one users item
router.get('/users/:id', users_controller.users_detail)

// GET request for creating new users
router.get('/users/create', users_controller.users_create_get)

// POST request for creating new users
router.post('/users/create', users_controller.users_create_post)

// GET request to delete users
router.get('/users/:id/delete', users_controller.users_delete_get)

// POST request to delete users
router.post('/users/:id/delete', users_controller.users_delete_post)

// GET request to update users
router.get('/users/:id/update', users_controller.users_update_get)

// POST request to update users
router.post('/users/:id/update', users_controller.users_update_post)

module.exports = router
