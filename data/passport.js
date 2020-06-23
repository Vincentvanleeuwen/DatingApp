const Dog = require('./dogModel');
const LocalStrategy = require('passport-local').Strategy;

module.exports = (passport) => {

  // Sources: https://medium.com/gomycode/authentication-with-passport-js-73ca65b25feb
  // https://dev.to/ganeshmani/node-authentication-using-passport-js-part-1-53k7
  // https://cloudnweb.dev/2019/04/node-authentication-using-passport-js-part-2/
  passport.serializeUser(function(dog, done) {

    done(null, dog.id);

  });
  passport.deserializeUser( (email, done ) => {

    Dog.findOne({ email: email }, (err, dog) => {

      done(err, dog);

    });

  });


  passport.use('local-login', new LocalStrategy(
    {
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback: true, // allows us to pass back the entire request to the callback

    },

    (req, email, password, done) => {


      Dog.findOne({ email: email }, function(err, dog) {

        if(err) throw err;

        if(!dog) {

          return done(null, false, console.log('Cant find user'));

        }

        dog.comparePassword(password, (err, isMatch) => {

          if (err) throw err;

          if(isMatch) {

            req.session.user = dog;

            return done(null, dog);

          } else {

            return done(null, false, console.log('Password Incorrect'));

          }

        });

      });

    }

  ));

};


