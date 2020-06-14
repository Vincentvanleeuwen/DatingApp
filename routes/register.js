const router = require('express').Router();
const Dog = require('../data/dogModel');

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

module.exports = router;
