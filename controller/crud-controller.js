var Userdb = require('../model/crud-model')
var AuthModel = require('../model/auth-model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// create and save new user in CRUD API
exports.create = (req, res) => {
  // validate request
  if (!req.body) {
    res.status(400).send({ message: 'Content can not be empty!' })
    return
  }
  // new User
  const user = new Userdb({
    name: req.body.name,
    email: req.body.email,
    gender: req.body.gender,
    status: req.body.status
  })
  // save user in the database
  user
    .save(user)
    .then(data => {
      res.send(data)
      // res.redirect('/');
    })
    .catch(err => {
      res
        .status(500)
        .send({
          message:
            err.message ||
            'Some error occured while creating a create operation'
        })
    })
}

// retrive and return all users/retrive and return a single user
exports.find = (req, res) => {
  if (req.query.id) {
    const id = req.query.id
    Userdb.findById(id)
      .then(data => {
        if (!data) {
          return res.status(400).send({ message: `Not Found with id ${id}` })
        } else {
          res.send(data)
        }
      })
      .catch(err => {
        res
          .status(500)
          .send({
            message:
              err.message || 'Error Occured while retriving user information'
          })
      })
  } else {
    Userdb.find()
      .then(user => {
        res.send(user)
      })
      .catch(err => {
        res
          .status(500)
          .send({
            message:
              err.message || 'Error Occured while retriving user information'
          })
      })
  }
}
// update a new idetified user by user id
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: 'Data to update can not be empty' })
  }

  const id = req.params.id
  Userdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false, new: true })
    .then(data => {
      if (!data) {
        res
          .status(404)
          .send({
            message: `Cannot Update user with ${id}. Maybe user not found!`
          })
      } else {
        res.send(data)
      }
    })
    .catch(err => {
      res.status(500).send({ message: 'Error Update user information' })
    })
}

// Delete a user with specified user id in the request
exports.delete = (req, res) => {
  const id = req.params.id
  Userdb.findByIdAndDelete(id, req.body)
    .then(data => {
      if (!data) {
        res
          .status(404)
          .send({
            message: `cannot Delete user with ${id} Maybe user not found!`
          })
      } else {
        res.send('User was deleted Successfuly!')
      }
    })
    .catch(err => {
      res.send(500).send({ message: `Could not delete user with id ${id}` })
    })
}
