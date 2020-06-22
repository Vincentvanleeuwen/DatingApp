const router = require('express').Router();
const Dog = require('../data/dogModel');
const Room = require('../data/roomModel');

let unratedDogs = (dogs, result, change) => {

  let filter;

  // Get all dogs except for yourself
  if (change) {

    filter = dogs.filter(dog => {

      // If dog is not current dog, return it.
      if (dog.email !== result.email) return dog;

    });

  }
  // Get all dogs except for yourself & your matches and dislikes
  else {

    filter = dogs.filter(dog => {

      // When a dog is included in the dislikes or matches,
      // If dog is not current dog, return it.
      if (dog.email !== result.email) {

        if (!result.dislikes.includes(dog.email)
          && !result.matches.includes(dog.email)) {

          return dog;

        }

      }

    });

  }

  // Return an array of dogs
  return filter;

};

async function waitForCurrentDog(dogs, req, res, change) {

  return await Dog.findOne({email: req.session.user.email})
  .then(result => {

    res.render('match', {

      title: 'Match',
      style: 'match.css',
      path: 'matches',
      dogs: unratedDogs(dogs, result, change)

    });

  })
  .catch(err => console.log('Error Finding dog, ', err));

}

// Show all the dogs on localhost:4000/
router.get('/', async (req, res) => {

  console.log('req.body', req.session.user);
  Dog.find()
  .lean()
  .then(dogs => {

    waitForCurrentDog(dogs, req, res, false);

  })
  .catch(err => console.log(err));

});



router.post('/', async (req, res) => {


  if (req.session.user.email === undefined && req.session.user.matches === undefined) {

    req.session.user.email = req.body.email;

    const newDog = new Dog({

      name: req.body.firstName,
      email: req.body.email,
      password: req.body.password,
      age: req.body.age,
      breed: req.body.breed,
      description: req.body.description,
      gender: req.body.gender,
      toy: req.body.toy,
      personality: req.body.personality,
      matches: [],
      dislikes: [],
      images: req.files,
      status: '',
      lastMessage: ''

    });

    Dog.createDog(newDog, (err, dog) => {

      if(err) throw err;

      Dog.find()
      .lean()
      .then(dogs => {

        console.log('userdefined?', dog);
        res.render('match', {

          title: 'Match',
          style: 'match.css',
          path: 'matches',
          dogs: unratedDogs(dogs, dog, true)

        });

      })
      .catch(err => console.log(err));



    });

  } else {

    Dog.find()
    .lean()
    .then(dogs => {

      waitForCurrentDog(dogs, req, res, false);

    })
    .catch(err => console.log(err));

  }

});

router.post('/dislike-match', async (req, res) => {

  let currentDog = Dog.getDogFromEmail(req.session.allDogs, req.session.user)[0];

  if (!currentDog.dislikes.includes(req.body.email)) {

    currentDog.dislikes.push(req.body.email);

  }

  Dog.findOneAndUpdate({email: currentDog.email},
    {$set:{dislikes: currentDog.dislikes }},
    {new: true},
    (err, result) => {

    if(err) throw err;

    console.log(result);

    });

  res.redirect('/match');

});

router.post('/add-match', async (req, res) => {

  async function waitForBothDogs() {

    return {

      currentDog: await Dog.getDogFromEmail(req.session.allDogs, req.session.user)[0],
      matchDog: await Dog.getDogFromEmail(req.session.allDogs, req.body)[0]

    };

  }

  waitForBothDogs().then(result=> {

    const currentDog = result.currentDog;
    const matchDog = result.matchDog;

    if (!currentDog.matches.includes(req.body.email)) {

      currentDog.matches.push(req.body.email);

    }

    Dog.findOneAndUpdate({ email: currentDog.email },
      { $set: {matches: currentDog.matches }},
      { new: true },
      (err, result) => {

        if(err) throw err;

        console.log('Updated email', result);

      });

    if (matchDog.matches.includes(currentDog.email)) {

      Room.findOne({ participants: [currentDog.email, matchDog.email]}).then(result => {

        if (!result) {

          Room.create([{
            participants: [currentDog.email, matchDog.email]
          }]);

        }

      })
      .catch(err => console.log(err));

      res.render('newMatch', {

        title: 'New Match!',
        style: 'newMatch.css',
        path: 'matches',
        match: matchDog


      });

    }
    else {

      res.redirect('/match');

    }

  })
  .catch(err => console.log(err));

});

module.exports = router;
