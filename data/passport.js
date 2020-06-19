const Dog = require('./dogModel');
const LocalStrategy = require('passport-local').Strategy;

module.exports = (passport) => {

  passport.serializeUser(function(dog, done) {

    done(null, dog.id);

  });
  passport.deserializeUser( (email, done ) => {

    Dog.getDogByEmail(email, (err, dog) => {

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

        dog.comparePassword(password, (err, isMatch) => {

          if (err) throw err;
          console.log(password, '=', isMatch);

          if(isMatch) {

            req.session.user = dog;
            console.log('user in passport', req.session.user);

            return done(null, dog);

          }

        });

      });

    }

  ));

};


