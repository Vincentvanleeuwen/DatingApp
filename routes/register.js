const router = require('express').Router();
const Dog = require('../data/dogModel');

// Show all the dogs on localhost:4000/
router.get('/', async (req, res) => {
  const allDogs = await Dog.find({}, {_id: 0, email: 1});
  // console.log('allDogs = ', typeof(allDogs));
  req.session.user = null;

  res.render('register', {

    layout: 'noNavigation',
    title: 'Login as',
    style: 'register.css',
    register: true,
    allDogs: allDogs,

  });

 

});

module.exports = router;
