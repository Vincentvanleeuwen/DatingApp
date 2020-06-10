const router = require('express').Router();
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

  console.log('current user matches.js/', req.session.user);

  res.render('matches', {

    title: 'Logged in as ' + req.body.name,
    style: 'matches.css',
    match: req.session.matches,

  });

});

router.post('/:id/chat', async (req, res) => {

  const allMessages = await Message.getAllMessages();

    console.log('matches.js/:id/chat', Message.getMessages(allMessages, req.session.user.email, req.body.email));

    res.render('chat', {

      title: 'Chatting with ' + req.session.selected.name,
      style: 'chat.css',
      selected: req.session.selected,
      message: Message.getMessages(allMessages, req.session.user.email, req.body.email)
      // Returns an array with all their messages.
    });

});

router.post('/:id/chat/noJS', (req, res) => {

  let newMessage = Message.create([{
    sendFrom: req.session.user.email,
    sendTo: req.session.selected.email,
    message: req.body.message,
    receiver: req.session.user.email,
    date: new Date()
      .toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' })

    }]);


  res.render('noJS', {
    layout: 'empty',
    style: 'noJS.css',
    message: req.body.message,
    date: new Date().toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' }),
    id: newMessage._id

  });

});

router.get('/:id/chat/noJS', (req, res) => {

  res.send('Javascript is disabled. Please enable Javascript for the best experience.');

});

// Export the router so it can be required in other files.
module.exports = router;
