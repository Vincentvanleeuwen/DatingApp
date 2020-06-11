const router = require('express').Router();
const Dog = require('../data/dogModel');

// Show all the dogs on localhost:4000/
router.get('/', async (req, res) => {

  req.session.user = null;

  req.session.allDogs =  await Dog.find().lean();

  res.render('home', {

    title: 'Login as',
    style: 'match.css',
    dogs: req.session.allDogs

  });

});



router.post('/', async (req, res) => {

  if (req.session.allDogs.length !== 1) {

    req.session.allDogs.shift();

  }

  // De huidige dog matches updaten naar de nieuwe match
  // Session dog
  // req.dog
  // req.matches = ['1', 'bobby@gmail.com']

  // []                         [...]


  res.render('home', {

    title: 'Login as',
    style: 'match.css',
    dogs: req.session.allDogs

  });

});

module.exports = router;
