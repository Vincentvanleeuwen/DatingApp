const router = require('express').Router();
const passport = require('passport');

// Show all the dogs on localhost:4000/
router.get('/', async (req, res) => {

  req.session.user = null;
  console.log(req.session.errMsg);
  res.render('login', {
    layout: 'noNavigation',
    title: 'Login as',
    style: 'register.css',
    register: false,
    errMsg: req.session.errMsg
  });

});


router.post('/', passport.authenticate('local-login', {

  successRedirect: '/match',
  failureRedirect: '/',
  failureFlash: true,

}));

router.get('/logout', (req, res) => {

  req.logout();
  res.redirect('/');

});


module.exports = router;
