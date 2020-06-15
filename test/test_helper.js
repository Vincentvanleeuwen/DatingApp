const mongoose = require('mongoose');


require('dotenv').config();


// Initialize MongoDB
const dbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@playdate-npesr.mongodb.net/playdatedatabase?retryWrites=true&w=majority`;

// Connect to the Database


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
// beforeEach((done) => {
//
//   // mongoose.connection.collections.dogs.drop(() => {
//   //
//   //   //this function runs after the drop is completed
//   //   done();
//   //
//   // });
//
// });