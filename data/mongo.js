const mongoose = require('mongoose');

// Require the models
const Dog = require('./dogModel');
// const Message = require('./messageModel');
// const Room = require('./roomModel');

require('dotenv').config();

// Define db.
let db;

// Dog.create([{
//   email: 'bobby@dog.com',
//   name: 'Bobby',
//   images: ['bobby-pup.jpg', 'bobby-pup2.jpg', 'bobby-old.jpeg', 'bobby-old2.jpg'],
//   status: 'New Message',
//   lastMessage: 'Hi!',
//   description: 'A fun Description',
//   breed: 'Labrador',
//   favToy: 'Tennisball',
//   age: '8',
//   personality: 'Active',
//   matches: [],
//   dislikes: []
// }]);
// Dog.create([{
//   email: 'luna@dog.com',
//   name: 'Luna',
//   images: ['samoyed-1.jpg', 'samoyed-2.jpg', 'samoyed-3.jpeg', 'samoyed-4.jpg'],
//   status: 'New Message',
//   lastMessage: 'Hello!',
//   description: 'A cool Description',
//   breed: 'Samoyed',
//   favToy: 'Your leg',
//   age: '10',
//   personality: 'Cool',
//   matches: [],
//   dislikes: []
// }]);
// Dog.create([{
//   email: 'shubab@dog.com',
//   name: 'Shubab',
//   images: ['shiba-1.jpg', 'shiba-2.jpg', 'shiba-3.jpeg', 'shiba-4.jpg'],
//   status: 'New Message',
//   lastMessage: 'Heeee!',
//   description: 'A cute Description',
//   breed: 'Shiba',
//   favToy: 'Your arm',
//   age: '5',
//   personality: 'Lazy',
//   matches: [],
//   dislikes: []
// }]);
// Dog.create([{
//   email: 'chester@dog.com',
//   name: 'Chester',
//   images: ['shepherd-1.jpg', 'shepherd-2.jpg', 'shepherd-3.jpeg', 'shepherd-4.jpg'],
//   status: 'New Message',
//   lastMessage: 'Heeee!',
//   description: 'A cute Description',
//   breed: 'German Shepherd',
//   favToy: 'Your head',
//   age: '5',
//   personality: 'Funny',
//   matches: [],
//   dislikes: []
// }]);
// Dog.create([{
//   email: 'bruno@dog.com',
//   name: 'Bruno',
//   images: ['labrador-1.jpg', 'labrador-2.jpg', 'labrador-3.jpeg', 'labrador-4.jpg'],
//   status: 'New Message',
//   lastMessage: 'Haaae!',
//   description: 'A Weird Description',
//   breed: 'Labrador',
//   favToy: 'Your Face',
//   age: '3',
//   personality: 'Weird',
//   matches: [],
//   dislikes: []
// }]);

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

  console.log('DogVariables reqsessionuser: ', req.session.user);

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
