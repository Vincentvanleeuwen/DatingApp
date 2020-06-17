const router = require('express').Router();
const Dog = require('../data/dogModel');

// Show all the dogs on localhost:4000/
router.get('/', async (req, res) => {

  req.session.user = null;

  res.render('register', {
    layout: 'noNavigation',
    title: 'Login as',
    style: 'register.css',
    register: true,

  });

});

module.exports = router;
