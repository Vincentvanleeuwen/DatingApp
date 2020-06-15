const assert =require('assert');

const Dog = require('../data/dogModel');


async function createDog() {

  return new Dog({

    email: 'bobby@gmail.com',
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

}

let dog;

// This function is called before each test
beforeEach(async () => {


  dog = await createDog();
  dogs = await Dog.getDogs();
  //this function runs after the drop is completed


});

describe('Dogs', () => {

  it('Should create a new dog', (done) => {
    // console.log(dog.name === 'Bobby', dog.name);

    // assert(!dog.isNew);

    assert(dog.email === 'bobby@gmail.com');
    assert(dog.name === 'Bobby');
    assert(dog.description === 'A silly goofball');
    assert(dog.breed === 'Labrador');
    assert(dog.favToy === 'Tennis ball');
    assert(dog.age === '8');
    assert(dog.personality === 'Active');
    assert(dog.matches.length === 0);
    assert(dog.dislikes.length === 0);



    done();

  });

  it('find a dog', () => {

    Dog.findOne({email: dog.email})
    .then(dog => assert(dog.name === 'Bobby') );




  });

  it('removes a dog', () => {

    Dog.findOneAndRemove({ name: dog.name })
    .then(() => Dog.findOne({ name: 'Bobby' }))
    .then((dog) => {

      assert(dog === null);



    })
    .catch(err => console.log('Error', err));

  });



});


