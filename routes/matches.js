const router = require('express').Router();
const Message = require('../data/messageModel');

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
    message: req.session.messages

  });

});

router.post('/:id/chat', async (req, res) => {

  const allMessages = await Message.getAllMessages();

    console.log('matches.js/:id/chat', req.session.user);

    res.render('chat', {

      title: 'Chatting with ' + req.session.selected.name,
      style: 'chat.css',
      selected: req.session.selected,
      message: Message.getMessages(allMessages, req.session.user.email, req.body.email)

    });

});


// Export the router so it can be required in other files.
module.exports = router;
