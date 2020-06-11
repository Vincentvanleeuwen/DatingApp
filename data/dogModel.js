const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dogSchema = new Schema({
  email: String,
  name: String,
  images: Array,
  status: String,
  lastMessage: String,
  description: String,
  breed: String,
  favToy: String,
  age: String,
  personality: String,
  matches: Array,
  dislikes: Array
}, {collection: 'dogs'});


dogSchema.statics = {

  //just return the plain javascript object. instead of mongoose
  getDogs: async () => mongoose.model('dogModel', dogSchema).find()
                                                                  .lean(),

  updateDog: async (dog) => {

    await Dog.updateOne(

      {'email': dog.email},
      {'name': dog.name},
      {'matches': dog.matches},
      {'description': dog.description},
      {'images': dog.images},
      {'breed': dog.breed},
      {'favToy': dog.favToy},
      {'age': dog.age},
      {'personality': dog.personality},
      {'dislikes': dog.dislikes}

    );

  },

  blockMatch: (match, currentDog) => {

    return currentDog.filter(dog => {

      if (dog !== match) {

        return dog;

      }

    });

  },

  dogMatches: (dogs, currentDog) => {

    // Get the logged in dog object
    let loggedInDog = mongoose.model('dogModel', dogSchema).getDogFromEmail(dogs, currentDog);

    if (!loggedInDog[0]) {

      return;

    }

    // Check if logged in dog has matches, return those dogs
    return dogs.filter(dog => {

      if (loggedInDog[0].matches.includes(dog.email)) {

        return dog;

      }

    });

  },

  getDogFromEmail: (dogs, currentDog) => {

    return dogs.filter( dog => {

      if (dog.email === currentDog.email) {

        return dog;

      }

    });

  },

  selectedConversation: (dogs, currentDog, index) => {

    // Get first dog in array to open instantly.
    return mongoose.model('dogModel', dogSchema).dogMatches(dogs, currentDog)[index];

  }
};


const Dog = mongoose.model('dogModel', dogSchema);

module.exports =  Dog;