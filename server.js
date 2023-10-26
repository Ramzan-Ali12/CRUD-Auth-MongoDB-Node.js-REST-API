const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const connectDB = require('./database/connection')
dotenv.config({ path: 'config/config.env' })
//Loads the handlebars module
const {engine}= require('express-handlebars');
const handlebars = require('handlebars');

const PORT = process.env.PORT || 8080
const app = express()
// this will print the log request
app.use(morgan('tiny'))
// call the databases
connectDB()
// body parser
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('views', 'views');

//Sets handlebars configurations (we will go through them later on)
app.engine('hbs', engine({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname +'/views/layouts'),
  //new configuration parameter
  extname: 'hbs',
  partialsDir: __dirname + '/views/partials/'
}));
//Sets our app to use the handlebars engine
app.set('view engine', 'hbs');
app.use(express.static('public'))

// app.set('view engine', 'ejs')


// app.engine('handlebars', handlebars({
//   defaultlayout:'main',
//   layoutsDir: __dirname + '/views/emails/',
//   }));
// always add the morgan before any Get request
// load assets
app.use('/css', express.static(path.resolve(__dirname, 'assests/css')))
app.use('/img', express.static(path.resolve(__dirname, 'assests/img')))
app.use('/js', express.static(path.resolve(__dirname, 'assests/js')))

// load Routers
app.use('/', require('./routes/router'))
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
