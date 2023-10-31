const express = require('express')
const route = express.Router()
const services = require('../services/render')
const controller = require('../controller/crud-controller')
const authcontroller = require('../controller/auth-controller')
const authmiddleware=require('../middleware/auth-middleware')
const imgcontroller=require('../controller/image-controller')
const imgModel = require('../model/image-model')
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
// Use the middleware for changing password
// route.use('/changepassword', authmiddleware.checkUserAuth);

// Public Routes
route.post('/signin', services.userLogin);
// Route for Upload Image
route.post('/upload-image',imgcontroller.UploadImage);
// API Route for Upload Image
route.post('/api/img/upload-image',imgcontroller.UploadImage);


// API Public Routes
route.post('/api/auth/signup', authcontroller.userSignup);
route.post('/api/auth/signin', authcontroller.userLogin);
//sendPasswordResetEmail 
route.post('/password-reset-email',authcontroller.sendUserPasswordResetEmail)
route.post('/api/auth/password-reset-email',authcontroller.sendUserPasswordResetEmail)
// password Reset
route.post('/password-reset/:id/:token',authcontroller.userPasswordReset)
route.post('/api/auth/password-reset/:id/:token',authcontroller.userPasswordReset)
// Protected Routes
// Apply middleware only to the specific route you want to protect
route.post('/changepassword', authmiddleware.checkUserAuth, authcontroller.changePassword);
route.get('/LoggedUser',authmiddleware.checkUserAuth,authcontroller.loggedUser);
// API Protected Routes (consistent with the middleware path)
route.post('/api/auth/changepassword', authmiddleware.checkUserAuth, authcontroller.changePassword);
// Get Loggedin User Route
route.get('/api/auth/LoggedUser', authmiddleware.checkUserAuth, authcontroller.loggedUser);
// Password Reset 


//API Routes
route.post('/api/users', controller.create)
route.get('/api/users', controller.find)
route.put('/api/users/:id', controller.update)
route.delete('/api/users/:id', controller.delete)

module.exports = route
