const express = require('express')
const router = express.Router()

const plan_controller = require('../controllers/planController')
const raport_controller = require('../controllers/raportController')
const search_controller = require('../controllers/searchController')
const user_controller = require('../controllers/userController')
const device_controller = require('../controllers/deviceController')
const devicetype_controller = require('../controllers/devicetypeController')
const line_controller = require('../controllers/lineController')

/// DEVICE ROUTES ///

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

// GET request for list of all device items
router.get('/device', device_controller.device_list)

// GET request for one device item
router.get('/device/:id', device_controller.device_detail)

/// DEVICETYPE ROUTES ///

// GET request for creating new devicetype
router.get('/devicetype/create', devicetype_controller.devicetype_create_get)

// POST request for creating new devicetype
router.post('/devicetype/create', devicetype_controller.devicetype_create_post)

// GET request to delete devicetype
router.get(
  '/devicetype/:id/delete',
  devicetype_controller.devicetype_delete_get
)

// POST request to delete devicetype
router.post(
  '/devicetype/:id/delete',
  devicetype_controller.devicetype_delete_post
)

// GET request to update devicetype
router.get(
  '/devicetype/:id/update',
  devicetype_controller.devicetype_update_get
)

// POST request to update devicetype
router.post(
  '/devicetype/:id/update',
  devicetype_controller.devicetype_update_post
)

// GET request for list of all device items
router.get('/devicetype', devicetype_controller.devicetype_list)

// GET request for one devicetype item
router.get('/devicetype/:id', devicetype_controller.devicetype_detail)

/// LINE ROUTES ///

// GET request for creating new line
router.get('/line/create', line_controller.line_create_get)

// POST request for creating new line
router.post('/line/create', line_controller.line_create_post)

// GET request to delete line
router.get('/line/:id/delete', line_controller.line_delete_get)

// POST request to delete line
router.post('/line/:id/delete', line_controller.line_delete_post)

// GET request to update line
router.get('/line/:id/update', line_controller.line_update_get)

// POST request to update line
router.post('/line/:id/update', line_controller.line_update_post)

// GET request for list of all device items
router.get('/line', line_controller.line_list)

// GET request for one device item
router.get('/line/:id', line_controller.line_detail)

/// PLAN-OWANE PRACE ROUTES ///

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

// GET request for list of all prace plan-owane items
router.get('/plan', plan_controller.plan_list)

// GET request for one plan item
router.get('/plan/:id', plan_controller.plan_detail)

/// RAPORT ROUTES ///

// GET request for list of all raport items

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

// pagination later ! -> view 10 latest raports
router.get('/raport', raport_controller.raport_list)

// GET request for one raport item
router.get('/raport/:id', raport_controller.raport_detail)

/// SEARCH ROUTES ///

// GET request for search page
router.get('/search/raport', search_controller.search_raport_get)

// POST route to search for specific items
router.post('/search/raport', search_controller.search_raport_post)

// GET request for search page
router.get('/search/breakdown', search_controller.search_breakdown_get)

// POST route to search for specific items
router.post('/search/breakdown', search_controller.search_breakdown_post)

/// USERS  ROUTES ///

router.get('/user/team', user_controller.user_team)
// GET request for creating new user
router.get('/user/create', user_controller.user_create_get)

// POST request for creating new user
router.post('/user/create', user_controller.user_create_post)

// GET request to delete user
router.get('/user/:id/delete', user_controller.user_delete_get)

// POST request to delete user
router.post('/user/:id/delete', user_controller.user_delete_post)

// GET request to update user
router.get('/user/:id/update', user_controller.user_update_get)

// POST request to update user
router.post('/user/:id/update', user_controller.user_update_post)

// GET request for list of all user items
router.get('/user', user_controller.user_list)

// GET request for one user item
router.get('/user/:id', user_controller.user_detail)

module.exports = router
