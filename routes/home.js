const router = require('express').Router();
const Dog = require('../data/dogModel');

// Show all the dogs on localhost:4000/
router.get('/', async (req, res) => {

  console.log(' ----- Every log on home.js ----- ');
  console.log('All dogs ', req.session.allDogs);
  req.session.user = null;

  console.log('current user home.js/', req.session.user);
  console.log(' ----- End logs on home.js ----- ');

  req.session.allDogs =  await Dog.find().lean();

  res.render('home', {

    title: 'Login as',
    style: 'match.css',
    dogs: req.session.allDogs

  });

});



router.post('/', async (req, res) => {

  console.log(' ----- Every log on home.js ----- ');
  console.log('current user home.js/', req.session.user);

  if (req.session.allDogs.length !== 1) {

    req.session.allDogs.shift();

  }

  console.log(' allDogs ', req.session.allDogs);
  console.log(' ----- End logs on home.js ----- ');

  res.render('home', {

    title: 'Login as',
    style: 'match.css',
    dogs: req.session.allDogs

  });

});

module.exports = router;
