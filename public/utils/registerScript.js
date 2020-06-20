const fieldset = document.body.getElementsByTagName('fieldset');
// let nextButton = document.body.getElementsByClassName('btn-next-container');
const button = document.body.getElementsByClassName('btn-next');
const previousButton = document.body.getElementsByClassName('btn-previous');
const buttonContainer = document.body.getElementsByClassName('btn-next-container');
const progressBar = document.getElementById('progress-bar');
const databaseDogEmails = document.getElementById('dogsobject').value; //all dog emails in one string
const emailArray = databaseDogEmails.split(','); //splits dog emails string and makes array
let activeFieldset = 0;
let dogEmailArray = [];

showContent(); //makes all fieldsets invisible, except first one and makes butttons visible

function showContent() {

  let widthProgressBar = activeFieldset / (fieldset.length - 1) * 100; //gives percentage number of progressbar width
  progressBar.style.width = widthProgressBar + '%'; //places the width in css

  for (let i = 0; i < buttonContainer.length; i++) {

    buttonContainer[i].classList.remove('dontDisplay');

  }

  if (activeFieldset === 0) {

    for (let i = 0; i < fieldset.length; i++) {

      fieldset[i].classList.add('dontDisplay');

    }

    fieldset[activeFieldset].classList.remove('dontDisplay');

  } else {

    fieldset[activeFieldset].classList.remove('dontDisplay');
    fieldset[activeFieldset - 1].classList.add('dontDisplay');

  }

}

function previousContent() {

  let widthProgressBar = activeFieldset / (fieldset.length - 1) * 100;
  progressBar.style.width = widthProgressBar + '%';
  fieldset[activeFieldset + 1].classList.add('dontDisplay');
  fieldset[activeFieldset].classList.remove('dontDisplay');

}

function makeEmailArray() { //function makes an array with the email adresses of all dogs

  for (let i = 0; i < emailArray.length; i++) {

    let emailRemovePartOne = emailArray[i].replace('{ email: \'', '');
    let emailRemovePartTwo = emailRemovePartOne.replace('\' }', '');
    dogEmailArray.push(emailRemovePartTwo);

  }

}

function checkInput() {

  let input = fieldset[activeFieldset].getElementsByTagName('input'); //gets the inputs of the active Fieldset
  let valid = true;
  let activeGender = []; //in higher scope, array should't loop

  for (let i = 0; i < input.length; i++) {

    switch (input[i].getAttribute('name')) {

      case 'firstName':
        if (input[i].value.length < 2 || input[i].value.length > 25) {

          document.getElementById('error-name').innerHTML = 'Field must contain between 2-25 characters';
          input[i].classList.add('invalid');
          valid = false;

        } else if (input[i].classList.contains('invalid')) {

          input[i].classList.remove('invalid');
          document.getElementById('error-name').innerHTML = '';

        }
        break;

      case 'email':
        makeEmailArray();
        if (dogEmailArray.includes(input[i].value) === true || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input[i].value) === false) {

          if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input[i].value) === false) {

            document.getElementById('error-email').innerHTML = 'Email should look like: name@examle.com';

          } else if (dogEmailArray.includes(input[i].value) === true) {

            document.getElementById('error-email').innerHTML = 'This email is already being used';

          }

          input[i].classList.add('invalid');
          valid = false;

        } else if (input[i].classList.contains('invalid')) {

          input[i].classList.remove('invalid');
          document.getElementById('error-email').innerHTML = '';

        }
        break;

      case 'password':
        if (input[i].value == false) {

          document.getElementById('error-password').innerHTML = 'Password should contain: ...';
          input[i].classList.add('invalid');
          valid = false;

        } else if (input[i].classList.contains('invalid')) {

          input[i].classList.remove('invalid');
          document.getElementById('error-password').innerHTML = '';

        }
        break;

      case 'age':
        if (isNaN(input[i].value) == true || input[i].value == false) {

          document.getElementById('error-age').innerHTML = 'Enter a number';
          input[i].classList.add('invalid');
          valid = false;

        } else if (input[i].classList.contains('invalid')) {

          input[i].classList.remove('invalid');
          document.getElementById('error-age').innerHTML = '';

        }
        break;

      case 'breed':
        if (input[i].value == false) {

          document.getElementById('error-breed').innerHTML = 'Enter dog breed';
          input[i].classList.add('invalid');
          valid = false;

        } else if (input[i].classList.contains('invalid')) {

          input[i].classList.remove('invalid');
          document.getElementById('error-breed').innerHTML = '';

        }
        break;

      case 'gender':
        let gender = input[i].checked; //checks if input is true or false

        if (gender == false) {

          activeGender.push(gender); //push 'false' to activeGender

        }

        if (activeGender.length == 2) { //if both inputs are false there is no input

          input[i].classList.add('invalid');
          document.getElementById('error-gender').innerHTML = 'Enter a gender';
          valid = false;

        } else if (input[i].classList.contains('invalid')) {

          input[i].classList.remove('invalid');
          document.getElementById('error-gender').innerHTML = '';

        }
        break;


      case 'toy':
        if (input[i].value == false) {

          document.getElementById('error-toy').innerHTML = 'Enter a toy';
          input[i].classList.add('invalid');
          valid = false;

        } else if (input[i].classList.contains('invalid')) {

          input[i].classList.remove('invalid');
          document.getElementById('error-toy').innerHTML = '';

        }
        break;

      case 'personality':
        if (input[i].value == false) {

          document.getElementById('error-personality').innerHTML = 'Describe dogs personality';
          input[i].classList.add('invalid');
          valid = false;

        } else if (input[i].classList.contains('invalid')) {

          input[i].classList.remove('invalid');
          document.getElementById('error-personality').innerHTML = '';

        }
        break;

      case 'images':
        if (input[i].value == false) {

          document.getElementById('error-images').innerHTML = 'Select an image';
          input[i].classList.add('invalid');
          valid = false;

        } else if (input[i].classList.contains('invalid')) {

          input[i].classList.remove('invalid');
          document.getElementById('error-images').innerHTML = '';

        }
        break;

      case 'description':
        //button is not a next button so it doest run call addCounter();
        if (input[i].value == false) {

          document.getElementById('error-description').innerHTML = 'Tell something about yourself';
          input[i].classList.add('invalid');
          valid = false;

        } else if (input[i].classList.contains('invalid')) {

          input[i].classList.remove('invalid');
          document.getElementById('error-description').innerHTML = '';

        }

        break;

    }

  }

  if (valid === true) {

    activeFieldset += 1;
    showContent();

  }

}

function subtractCounter() {

  activeFieldset -= 1;
  previousContent();

}

for (let i = 0; i < fieldset.length; i++) {

  button[i].addEventListener('click', checkInput);

}

for (let i = 0; i < previousButton.length; i++) {

  previousButton[i].addEventListener('click', subtractCounter);

}