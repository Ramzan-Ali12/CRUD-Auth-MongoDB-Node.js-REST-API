var AuthModel = require('../model/auth')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// const nodemailer = require('nodemailer')
const {transporter}  = require('../config/emailconfig')

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
          res.status(200).send({
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

// changeuserpassword
exports.changePassword = async (req, res) => {
  const { password, password_confirmation } = req.body
  const { _id } = req.user
  if (password && password_confirmation) {
    // check the password & password_confirmation is same
    if (password !== password_confirmation) {
      res.status(400).send({
        status: 'failed',
        message: "New Password and confirm New Password doesn't mathch"
      })
    } else {
      // save the New password in database
      const salt = await bcrypt.genSalt(10)
      const newHashPassword = await bcrypt.hash(password, salt)

      console.log(password_confirmation, newHashPassword)
      await AuthModel.findByIdAndUpdate(req.user._id, {
        password: newHashPassword
      })
      res.send({
        status: 'success',
        message: 'Password changed succesfully for user'
      })
    }
  } else {
    res
      .status(400)
      .send({ status: 'failed', message: 'All fields are Required' })
  }
}

// Get the Logged User
exports.loggedUser = async (req, res) => {
  res.send({ user: req.user })
}

// Forget Password API
exports.sendUserPasswordResetEmail = async (req, res) => {
  const { email } = req.body

  if (email) {
    // check the email is registered or not
    const user = await AuthModel.findOne({ email: email })
    // console.log(user)
    if (user) {
      // send the email to user logic
      const secret = user._id + process.env.JWT_SECRET_KEY
      const token = jwt.sign({ userID: user._id }, secret, {
        expiresIn: '15m'
      })
      // send Link to the user
      const link = `http://127.0.0.1:300/api/user/reset/${user._id}/${token}`
      // console.log(link)
      let info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Authentication-Password Reset Link',
        html: `<a href=${link}>Click Here</a> to Reset Your Password`
      })
      res.send({
        status: 'success',
        message: 'Password Reset Email Sent... Please Check Your Email',
        "info":info
      })
    } else {
      res
        .status(400)
        .send({ status: 'failed', message: "Email doesn't Exist!" })
    }
  } else {
    res
      .status(400)
      .send({ status: 'failed', message: 'Email field is required!' })
  }
}

// UserPasword Reset API
exports.userPasswordReset = async (req, res) => {
  const { password, password_confirmation } = req.body
  const { id, token } = req.params
  const user = await AuthModel.findById(id)
  // get the user ID from Database and generate the new_secret
  const new_secret = user._id + process.env.JWT_SECRET_KEY
  try {
    jwt.verify(token, new_secret)
    if (password && password_confirmation) {
      if (password !== password_confirmation) {
        res
          .status(400)
          .send({
            status: 'failed',
            message: "New Password and Confirm New Password doesn't match!"
          })
      } else {
        const salt = await bcrypt.genSalt(10)
        const newHashPassword = await bcrypt.hash(password, salt)
        // console.log(password_confirmation, newHashPassword)
        await AuthModel.findByIdAndUpdate(user._id, {
          password: newHashPassword
        })
        res.send({
          status: 'success',
          message: 'Password Reset succesfully for user!'
        })
      }
    } else {
      res
        .status(400)
        .send({ status: 'failed', message: 'All fields are required!' })
    }
  } catch (error) {
    //  console.log(error)
    res.status(400).send({ status: 'failed', message: 'Invalid Token!' })
  }
}
