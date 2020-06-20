const router = require('express').Router();
const Dog = require('../data/dogModel');
const Message = require('../data/messageModel');


router.get('/', (req, res) => {

  console.log('current user matches.js/', req.session.user);
  console.log('req.matches', req.session.matches);
  // const realMatches = req.session.matches.filter


  res.render('matches', {

    title: 'All your chats',
    style: 'matches.css',
    match: req.session.matches,

  });

});


// Show your matches on http://localhost:4000/matches
router.post('/', (req, res) => {

  req.session.user = {

    email: req.body.email,
    name: req.body.name

  };

  res.render('matches', {

    title: 'Logged in as ' + req.body.name,
    style: 'matches.css',
    match: req.session.matches,

  });

});

// Show a chat
router.post('/:id/chat', async (req, res) => {

  const allMessages = await Message.getAllMessages();

  await Dog.findOne({ 'email': req.body.email }).then(result => {

    req.session.selected = result.toObject();

    res.render('chat', {

      title: 'Chatting with ' + req.session.selected.name,
      style: 'chat.css',
      selected: req.session.selected,
      message: Message.getMessages(allMessages, req.session.user.email, req.session.selected.email)
      // Returns an array with all their messages.
    });

  })
  .catch(err => console.log(err));

});

// Show a chat without js
router.post('/:id/chat/noJS', async (req, res) => {

  console.log(req.body.email);
  await Dog.findOne({ 'email': req.body.email }).then(result => {

    req.session.selected = result.toObject();
    console.log('reqsessionseleceed', req.session.selected);
    let newMessage = Message.create([{
      sendFrom: req.session.user.email,
      sendTo: req.session.selected[0].email,
      message: req.body.message,
      receiver: req.session.user.email,
      date: new Date()
      .toLocaleTimeString('en-GB', {hour: 'numeric', minute: 'numeric'})

    }]);

    res.render('noJS', {
      layout: 'empty',
      style: 'noJS.css',
      message: newMessage[0].message,
      date: newMessage[0].date,
      id: newMessage[0]._id
    });

  })
  .catch(err => console.log(err));




});

router.get('/:id/chat/noJS', (req, res) => {
  // res.redirect('/:id/chat');
  res.send('Javascript is disabled. Please enable Javascript for the best experience.');

});

// Export the router so it can be required in other files.
module.exports = router;
