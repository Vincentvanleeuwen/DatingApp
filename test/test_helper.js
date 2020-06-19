// Set up a connection for the unit test
const mongoose = require('mongoose');
require('dotenv').config();

// Initialize MongoDB
const dbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@playdate-npesr.mongodb.net/playdatedatabase?retryWrites=true&w=majority`;


//tell mongoose to use es6 implementation of promises
mongoose.Promise = global.Promise;

mongoose.connect(dbUrl, {

  // Prevent connection error
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false

});

mongoose.connection
.once('open', () => console.log('Connected!'))
.on('error', (error) => {

  console.warn('Error : ',error);

});

// This function is called before each test
beforeEach((done) => {

     // Delete dog collection
  // mongoose.connection.db.dropCollection('messages', (err, result) => {
  //
  //   console.log(result);
  //   console.log(err);
  //
  //   done();
  //
  // });

});