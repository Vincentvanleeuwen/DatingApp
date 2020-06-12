const router = require('express').Router();
const Dog = require('../data/dogModel');
const Message = require('../data/messageModel');


router.get('/', (req, res) => {

  console.log('current user matches.js/', req.session.user);

  res.render('matches', {

    title: 'Logged in as ' + req.body.name,
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

  const allDogs = await Dog.getDogs();
  const allMessages = await Message.getAllMessages();

  req.session.selected = Dog.getDogFromEmail(allDogs, req.body);

  res.render('chat', {

    title: 'Chatting with ' + req.session.selected[0].name,
    style: 'chat.css',
    selected: req.session.selected[0],
    message: Message.getMessages(allMessages, req.session.user.email, req.body.email)
    // Returns an array with all their messages.
  });

});

// Show a chat without js
router.post('/:id/chat/noJS', async (req, res) => {

  let newMessage = await Message.create([{
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


});

router.get('/:id/chat/noJS', (req, res) => {
  // res.redirect('/:id/chat');
  res.send('Javascript is disabled. Please enable Javascript for the best experience.');

});

// Export the router so it can be required in other files.
module.exports = router;
