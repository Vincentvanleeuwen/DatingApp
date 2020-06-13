const router = require('express').Router();
const Dog = require('../data/dogModel');
const multer  = require('multer');

let upload = multer({ dest: '../public/media/images/dogs/' });

// Show all the dogs on localhost:4000/
router.get('/', async (req, res) => {

  req.session.user = null;

  req.session.allDogs =  await Dog.find().lean();

  res.render('home', {
    layout: 'noNavigation',
    title: 'Login as',
    style: 'register.css',
    dogs: req.session.allDogs

  });

});

router.get('/', (req, res) => res.render('register'))
router.post('/', upload.single('profilePicture'), async (req,res) => {  
  req.session.user = {
    name: req.body.firstName,
    email: req.body.email,
    birthday: req.body.birthday,
    gender: req.body.gender,
    preference: req.body.preference,
    picture: req.file,
    description: req.body.description,
    // matches: [],
    // dislikes: []
  };


  // email: String,
  // name: String,
  // images: Array,
  // status: String,
  // lastMessage: String,
  // description: String,
  // breed: String,
  // favToy: String,
  // age: String,
  // personality: String,
  // matches: Array,
  // dislikes: Array

  // Push new message to the database
  Dog.create([{
    name: req.session.user.name,
    email: req.session.user.email,
    birthday: req.session.user.birthday,
    gender: req.session.user.gender,
    preference: req.session.user.preference,
    picture: req.session.user.picture,
    description: req.session.user.description,
    // matches: [],
    // dislikes: []
  }]);

});


// router.post('/', async (req, res) => {

//   if (req.session.allDogs.length !== 1) {

//     req.session.allDogs.shift();

//   }

//   // De huidige dog matches updaten naar de nieuwe match
//   // Session dog
//   // req.dog
//   // req.matches = ['1', 'bobby@gmail.com']

//   // []                         [...]


//   res.render('home', {

//     title: 'Login as',
//     style: 'match.css',
//     dogs: req.session.allDogs

//   });

// });

module.exports = router;
