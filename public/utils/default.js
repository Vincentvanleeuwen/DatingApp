/*eslint-disable */

const socket = io();
let dogConnection = io.connect();

/*eslint-enable */

// Chat elements
const chatContainer = document.querySelector('.chat-container');
const chatInput = document.getElementById('chat-input');
const chatBulbContainer = document.querySelector('.chat-bulbs');
const chatButtons = document.querySelectorAll('.single-match');
const bulb = document.querySelectorAll('.bulb');

// Block dog elements
const dogSettingMenu = document.querySelector('.dropdown-menu');
const dogSettingButton = document.getElementsByClassName('dog-settings')[0];
const blockButton = document.querySelector('.block');
const thisDog = document.querySelector('.this-dog');

// Toggles the dog chat info menu
if(dogSettingButton) {

  dogSettingButton.addEventListener('click', (e) => {

    dogSettingMenu.classList.toggle('show-menu');

    if(!dogSettingMenu.classList.contains('show-menu')) {

      dogSettingMenu.classList.toggle('hide-menu');

      setTimeout(() => {
        dogSettingMenu.classList.toggle('hide-menu');
      }, 400);

    }

  });

}

// Delete a message
if (bulb.length !== 0) {

  bulb.forEach(bulb => {

    bulb.addEventListener('click', () => {
      if (confirm("Do you really want to delete this message?")) {

        socket.emit('delete-message', bulb.id);
        bulb.remove();
      } else {
        console.log('cancelled deletion');
      }


    });

  });

}

if(blockButton) {

  blockButton.addEventListener('click', () => {

    console.log('Dog to block = ', thisDog.value, "@default.js:38");

    // Emit the dog you want to block
    socket.emit('block-user', thisDog.value);

  });

}

socket.on('block-user', data => {

  console.log(data);

  deleteDogFromChat(data);

});

socket.on('message', message => {

  if (message.length === 0) {

    console.log('Empty input');

  } else {

    addNewMessage(message);
    document.querySelector('.is-typing').remove();
    socket.emit('message', message);

  }

});

// Listen for keypress to show the typing message.
if (chatInput) {

  chatInput.addEventListener('keypress', () => {

    socket.emit('typing');

  });

}

// When user is typing, show the other user that he is typing.
socket.on('typing', data => {

  const isTyping = document.createElement('p');
  const typingMessage = document.createTextNode(`${data.username} is typing...`);
  isTyping.classList += ' is-typing';
  isTyping.appendChild(typingMessage);

  if(!document.querySelector('.is-typing')) {

    chatContainer.appendChild(isTyping);

  }

});



if(chatContainer) {

  chatContainer.addEventListener('submit', e => {

    e.preventDefault();

    const message = chatInput.value;


    if (message.length === 0) {

      console.log('Empty input');

    } else {

      // Show message to the view
      addNewMessage(message, ' self');

      // Save the message to the database
      socket.emit('message-to-db', {
        message: message,
        date: new Date()
        .toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' })
      })

    }

    console.log(socket.id);

    socket.emit('dog-message', socket.id, message);

    // Clear the input when someone sends their message
    chatInput.value = '';

  });

}


if (chatButtons.length !== 0) {

  let currentlyActive = chatButtons[0];

  let room = chatButtons[0].getAttribute('data-room');
  // Set chat index to 0
  socket.emit('chat-index', 0);
  socket.emit('match-room', room);

  currentlyActive.classList.add('active-chat');

  chatButtons.forEach(button => {


    button.addEventListener('click', () => {

      // Get the room
      const room = button.getAttribute('data-room');

      // Remove the active class
      currentlyActive.classList.remove('active-chat');

      // Add active class to clicked element
      button.classList.add('active-chat');

      // Set clicked element to current active element.
      currentlyActive = button;

      socket.emit('chat-index', getIndexOfChat(button));

      console.log('room', room);

      socket.emit('match-room', room);



    });

  });

}


function getIndexOfChat(button) {

  const chats = Array.prototype.slice.call(chatButtons);

  return chats.indexOf(button);

}


//Create HTML element of a chatbubble.
function addNewMessage(message, receiver) {

  const chatBulb = document.createElement('div');
  chatBulb.classList += ' single-bulb';

  if(receiver){

    chatBulb.classList += `${receiver}`;

  }

  const bulb = document.createElement('div');
  bulb.classList += 'bulb ';

  const bulbContent = document.createElement('div');
  bulbContent.classList += 'bulb-content ';

  const bulbTime = document.createElement('span');
  bulbTime.classList += 'bulb-timestamp ';

  bulbContent.innerText = message;
  bulbTime.innerText = new Date()
    .toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' });

  chatBulb.appendChild(bulb);
  bulb.appendChild(bulbContent);
  bulb.appendChild(bulbTime);

  chatBulbContainer.appendChild(chatBulb);

  // Scroll to bottom to always see newest chat message
  chatBulbContainer.scrollTop = chatBulbContainer.scrollHeight - chatBulbContainer.clientHeight;

}


