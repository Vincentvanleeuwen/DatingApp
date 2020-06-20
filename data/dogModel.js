const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const dogSchema = new Schema({
  email: String,
  name: String,
  password: String,
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


// Staticss can be used like so
// Directly on the Dog mongoose object
// Dog.createDog( .. .., () => {})
dogSchema.statics = {

  // https://medium.com/gomycode/authentication-with-passport-js-73ca65b25feb
  createDog: (newDog, callback) => {

    bcrypt.genSalt(10, (err, salt) => {

      bcrypt.hash(newDog.password, salt, (err, hash) => {

        newDog.password = hash;
        newDog.save(callback);

      });

    });

  },

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
  
  blockMatch: (match, currentDog) => currentDog.filter(dog => {

      if (dog !== match) {

        return dog;

      }

    }),

  dogMatches: (dogs, currentDog) => {

    // Get the logged in dog object
    let loggedInDog = mongoose.model('dogModel', dogSchema).getDogFromEmail(dogs, currentDog)[0];

    if (!loggedInDog) {

      return;

    }

    // Check if logged in dog has matches, return those dogs
    return dogs.filter(dog => {

      if (loggedInDog.matches.includes(dog.email) && dog.matches.includes(loggedInDog.email)) {

        return dog;

      }

    });

  },

  getDogFromEmail: (dogs, currentDog) => dogs.filter( dog => {

      if (dog.email === currentDog.email) {

        return dog;

      }

    }),

};

// Methods can be used like so
// let dog = new Dog({ })
// dog.comparePassword
dogSchema.methods.comparePassword = function(candidatePassword, callback) {

  // https://stackoverflow.com/questions/14588032/mongoose-password-hashing
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {

    if (err) return callback(err);

    callback(null, isMatch);

  });

};

const Dog = mongoose.model('dogModel', dogSchema);

module.exports = Dog;
