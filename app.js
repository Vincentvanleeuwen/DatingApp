'use strict';

// Get Express
const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');

const app = express();
const server = require('http').createServer(app);
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');

// Import Socket IO and Mongoose
const { initializeSocketIO } = require('./data/socket');
const { db, dogVariables } = require('./data/mongo');

// Handlebars helpers
const { notEqualCheck, equalCheck } = require('./public/utils/handleHelpers');

// Make .env file usable
require('dotenv').config();

// Set the port
const port = 4000 || process.env.PORT;

// Define the session
let newSession = session({

  name: 'sid', // Session ID
  resave: false, // Don't send data back to the store
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 * 2,
    sameSite: true,
    secure: false
  },
  store: new MongoStore({mongooseConnection: db})

});

// Require the routes
let register = require('./routes/register');
let match = require('./routes/match');
let matches = require('./routes/matches');


// Assign handlebars as the view engine
app.engine('hbs', handlebars({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
  helpers: {
    equal: equalCheck,
    notEqual: notEqualCheck
  }
}))

.set('view engine', 'hbs')

.use(cookieParser(process.env.SESSION_SECRET))

// Initialize a session
.use(newSession)

// Make files public
.use('/public', express.static('public'))

// Supports parsing of Json
.use(bodyParser.json())

// Supports parsing of x-www-form-urlencoded
.use(bodyParser.urlencoded({extended: true}))

.use('/register', register)

.use('/match',
  dogVariables,
  match
)

// Show all matches & chats
.use('/matches',
  dogVariables,
  matches
);

// Initialize the chat function with Socket.io
initializeSocketIO(server, newSession);


// Listen on http://localhost:4000
server.listen(port, () => console.log('Running on Port', port));



