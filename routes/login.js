const router = require('express').Router();
const passport = require('passport');

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


router.post('/', passport.authenticate('local-login', {

  successRedirect: '/match',
  failureRedirect: '/',
  failureFlash: true,

}));

router.get('/logout', (req, res) => {

  req.logout();
  req.redirect('/');

});


module.exports = router;
