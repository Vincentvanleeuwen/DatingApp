const mongoose = require('mongoose');

// Require the models
const Dog = require('./dogModel');
// const Message = require('./messageModel');
// const Room = require('./roomModel');

require('dotenv').config();

// Define db.
let db;

// Initialize MongoDB
const dbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@playdate-npesr.mongodb.net/playdatedatabase?retryWrites=true&w=majority`;

// Connect to the Database
mongoose.connect(dbUrl, {

  // Prevent connection error
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false

});

// Set db to this connection
db = mongoose.connection;

// When database is connected
db.on('connected', () => {

  console.log(`Connected!`);

});

// Log the error if error
db.on('error', err => console.log(`MongoDB connection error: ${err}`));


// Create a room:
// Room.create([{
//   participants: ['bobby@gmail.com', 'bruno@dog.com']
// }]);

// Get all data from Mongo, set the current user.
async function dogVariables(req, res, next) {

  // Get dogs collection & messages collection from mongoDB
  const allDogs = await Dog.getDogs();

  // Set the session for this user if undefined
  if (!req.session.user) {

    req.session.user = {email: req.body.email, name: req.body.name};

  }

  req.session.matches = Dog.dogMatches(allDogs, req.session.user);
  req.session.allDogs = allDogs;

  // req.session.selected = Dog.selectedConversation(req.session.allDogs,req.session.user, 0);



  next();

}

module.exports = { db, dogVariables };
