const authcontroller = require('../controller/auth-controller')
var AuthModel = require('../model/auth-model')


const jwt = require('jsonwebtoken')

// checkuser Auth
// for change password we need to get token for password reset

// Auth Middleware to check user Auth
exports.checkUserAuth = async (req, res, next) => {
    let token
    const { authorization } = req.headers
    if (authorization && authorization.startsWith('Bearer')) {
      try {
        // Get Token from header
        token = authorization.split(' ')[1]
        // console.log("Token",token)
        // Verify Token
        const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY)
        // console.log(userID)
        // Get User from Token
        req.user = await AuthModel.findById(userID).select('-password')
        console.log(req.user)
        next()
      } catch (error) {
        // console.log(error)
        res.status(401).send({ "status": "failed", "message": "Unauthorized User" })
      }
    }
    if (!token) {
      res.status(401).send({ "status": "failed", "message": "Unauthorized User, No Token" })
    }
}