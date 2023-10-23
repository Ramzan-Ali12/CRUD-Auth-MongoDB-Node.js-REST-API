const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const connectDB = require('./database/connection')
dotenv.config({ path: 'config/config.env' })

const PORT = process.env.PORT || 8080
const app = express()

// always add the morgan before any Get request
// this will print the log request
app.use(morgan('tiny'))
// call the databases
connectDB()
// body parser
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// set the view engine
app.set('view engine', 'ejs')

// load assets
app.use('/css', express.static(path.resolve(__dirname, 'assests/css')))
app.use('/img', express.static(path.resolve(__dirname, 'assests/img')))
app.use('/js', express.static(path.resolve(__dirname, 'assests/js')))

// load Routers
app.use('/', require('./routes/router'))
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
