const assert = require('assert');
const Dog = require('../data/dogModel');

async function makeDog() {

  let newDog = new Dog({

    email: 'bobby@gmail.com',
    password: 'test123',
    name: 'Bobby',
    breed: 'Labrador',
    description: 'A silly goofball',
    images: ['bobby-pup.jpg'],
    status: '',
    lastMessage: '',
    favToy: 'Tennis ball',
    age: '8',
    personality: 'Active',
    matches: [],
    dislikes: []

  });

  Dog.createDog(newDog, (err, dog) => {

    if (err) throw err;

    return dog;

  });

}


// Check the dog functions
describe('Dogs', () => {

  // Check if you can succesfully create a dog
  it('Should create a new dog', () => {

    makeDog().then(dog => {
      assert(dog.email === 'bobby@gmail.com');
      assert(dog.name === 'Bobby');
      assert(dog.description === 'A silly goofball');
      assert(dog.breed === 'Labrador');
      assert(dog.favToy === 'Tennis ball');
      assert(dog.age === '8');
      assert(dog.personality === 'Active');
      assert(dog.matches.length === 0);
      assert(dog.dislikes.length === 0);

    })
    .catch(err => console.log(err));

  });

  // Check if you can receive a dog from the database
  it('find a dog', () => {

    Dog.findOne({email: 'bobby@gmail.com'})
    .then(dog => dog)
    .catch(err => assert(!err));

  });

  // Check if you can remove a dog from the database
  it('removes a dog', () => {

    Dog.findOneAndDelete({ email: 'bobby@gmail.com' }, (err) => {

      if (err) throw err;

      assert(true);

    });

  });



});


