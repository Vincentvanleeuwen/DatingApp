const router = require('express').Router();

// Show all the dogs on localhost:4000/
router.get('/', async (req, res) => {

  req.session.user = null;

  res.render('login', {
    layout: 'noNavigation',
    title: 'Login as',
    style: 'register.css',
    register: false,

  });

});


module.exports = router;
