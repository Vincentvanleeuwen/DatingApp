/*eslint-disable */

const socket = io();

/*eslint-enable */

// Chat elements
const chatContainer = document.querySelector('.chat-container');
const chatInput = document.getElementById('chat-input');
const chatBulbContainer = document.querySelector('.chat-bulbs');
const bulb = document.querySelectorAll('.bulb');

// Block dog elements
const dogSettingMenu = document.querySelector('.dropdown-menu');
const dogSettingButton = document.getElementsByClassName('dog-settings')[0];
const blockButton = document.querySelector('.block');
const thisDog = document.querySelector('.this-dog');

// Toggles the dog chat info menu
if (dogSettingButton) {

  dogSettingButton.addEventListener('click', () => {

    dogSettingMenu.classList.toggle('show-menu');

    if (!dogSettingMenu.classList.contains('show-menu')) {

      dogSettingMenu.classList.toggle('hide-menu');

      setTimeout(() => {

        dogSettingMenu.classList.toggle('hide-menu');

      }, 400);

    }

  });

}
if (chatBulbContainer) {

  // Scroll to bottom to always see newest chat message
  chatBulbContainer.scrollTop = chatBulbContainer.scrollHeight - chatBulbContainer.clientHeight;


}

// Delete a message
if (bulb.length !== 0) {

  bulb.forEach(bulb => {

    bulb.addEventListener('click', () => {

      if (confirm('Do you really want to delete this message?')) {

        socket.emit('delete-message', bulb.id);
        bulb.remove();

      } else {

        console.log('cancelled deletion');

      }


    });

  });

}

// Eventlistener for the block button
if (blockButton) {

  blockButton.addEventListener('click', () => {

    console.log('Dog to block = ', thisDog.value, '@default.js:38');

    // Emit the dog you want to block
    socket.emit('block-user', thisDog.value);

  });

}

socket.on('block-user', data => {

  console.log(data);

});

socket.on('message', message => {

  if (message.length === 0) {

    console.log('Empty input');

  } else {

    addNewMessage(message);

    if (document.querySelector('.is-typing')) {

      document.querySelector('.is-typing').remove();

    }


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

  if (!document.querySelector('.is-typing')) {

    chatContainer.appendChild(isTyping);

  }

});


if (chatContainer) {

  const email = chatContainer.getAttribute('data-room');

  // socket.emit('match-room', email);

  chatContainer.addEventListener('submit', e => {

    e.preventDefault();

    const message = chatInput.value;

    socket.emit('match-room', email);

    if (message.length === 0) {

      console.log('Empty input');

    } else {

      console.log('message in DefaultJs 164 === ', message);
      // Show message to the view
      addNewMessage(message, ' self');

      // Save the message to the database
      socket.emit('message-to-db', {
        message: message,
        date: new Date()
        .toLocaleTimeString('en-GB', {hour: 'numeric', minute: 'numeric'})
      });

    }

    console.log('Clientside Socket Room ID',  socket);

    socket.once('send-room-id', room => {

      console.log('room in default.js@181', room.room);

      socket.emit('dog-message', room.room, message);

    });

    // Clear the input when someone sends their message
    chatInput.value = '';


  });


}

//Create HTML element of a chatbubble.
function addNewMessage(message, receiver) {

  const chatBulb = document.createElement('div');
  chatBulb.classList += ' single-bulb';

  if (receiver) {

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
  .toLocaleTimeString('en-GB', {hour: 'numeric', minute: 'numeric'});

  chatBulb.appendChild(bulb);
  bulb.appendChild(bulbContent);
  bulb.appendChild(bulbTime);

  chatBulbContainer.appendChild(chatBulb);

  // Scroll to bottom to always see newest chat message
  chatBulbContainer.scrollTop = chatBulbContainer.scrollHeight - chatBulbContainer.clientHeight;

}


