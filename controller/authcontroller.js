var AuthModel = require('../model/auth')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Auth API
exports.userSignup = async (req, res) => {
  const { name, email, password, password_confirmation, tc } = req.body
  // check Spanning
  const user = await AuthModel.findOne({ email: email })
  if (user) {
    res.status(400).send({ status: 'failed', message: 'Email already exists' })
  } else {
    if (name && email && password && password_confirmation && tc) {
      //    check for password and password confirmation
      if (password === password_confirmation) {
        try {
          const salt = await bcrypt.genSalt(10)
          const hashPassword = await bcrypt.hash(password, salt)
          const newUser = new AuthModel({
            name: name,
            email: email,
            password: hashPassword,
            tc: tc
          })
          await newUser.save()
          // Get the current saved user
          const saved_user = await AuthModel.findOne({ email: email })
          //  Generate JWT token
          const token = jwt.sign(
            { userID: saved_user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '5d' }
          )
          res.status(201).send({
            status: 'success',
            message: 'User Registration Successfuly!',
            token: token
          })
        } catch (err) {
          console.log(err)
          res
            .status(400)
            .send({ status: 'failed', message: 'Unabel to Register' })
        }
      } else {
        res.status(400).send({
          status: 'failed',
          message: "Password and Confirm Password doesn't match"
        })
      }
    } else {
      res
        .status(400)
        .send({ status: 'failed', message: 'All fields are required' })
    }
  }
}

// User Login

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    if (email && password) {
      const user = await AuthModel.findOne({ email: email })
      if (user != null) {
        const isMatch = await bcrypt.compare(password, user.password)
        if (user.email === email && isMatch) {
          //  Generate JWT token
          const token = jwt.sign(
            { userID: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '5d' }
          )
          res
            .status(200)
            .send({
              status: 'success',
              message: 'Login Successfuly!',
              token: token
            })
        } else {
          res.status(400).send({
            status: 'failed',
            message: 'Email or Password is not Valid'
          })
        }
      } else {
        res
          .status(400)
          .send({ status: 'failed', message: 'You are not registerd user' })
      }
    } else {
      res
        .status(400)
        .send({ status: 'failed', message: 'All fields are required' })
    }
  } catch (error) {
    res.status(400).send({ status: 'failed', message: 'Unabel to Login' })
  }
}
