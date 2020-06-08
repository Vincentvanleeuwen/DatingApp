const router = require('express').Router();

// Show your matches on http://localhost:4000/matches
router.get('/', (req, res) => {

  res.render('matches', {

    title: 'Your Matches',
    style: 'matches.css',
    match: req.session.matches,
    selected: req.session.selected,
    user: req.session.user,
    message: req.session.messages

  });

});

router.post('/', (req, res) => {
  console.log('matchesjs', req.session.next);


  console.log('matches', req.session.selected);
  res.render('matches', {

    title: 'Logged in as ' + req.body.name,
    style: 'matches.css',
    match: req.session.matches,
    selected: req.session.selected,
    user: req.body.email,
    message: req.session.messages
  });

});

// Export the router so it can be required in other files.
module.exports = router;
