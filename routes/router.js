const express = require('express')
const route = express.Router()
const services = require('../services/render')
const controller = require('../controller/controller')
const authcontroller = require('../controller/authcontroller')
/**
 *  @description Root Route
 *  @method GET/
 */

route.get('/', services.homeRoutes)
/**
 *  @description Add user Route
 *  @method GET/update-user
 */

route.get('/add-user', services.add_user)
/**
 *  @description Update User Route
 *  @method GET/update-user
 */

route.get('/update-user', services.update_user)

/**
 *  @description userRegistraction
 *  @method POST/user-register
 */
route.post('/signUp', services.userSignup)

/**
 *  @description userLogin
 *  @method POST/user-Login
 */
route.post('/signin', services.userLogin)

// API Route
route.post('/api/auth/signup', authcontroller.userSignup)
route.post('/api/auth/signin', authcontroller.userLogin)

//API Routes
route.post('/api/users', controller.create)
route.get('/api/users', controller.find)
route.put('/api/users/:id', controller.update)
route.delete('/api/users/:id', controller.delete)

module.exports = route
