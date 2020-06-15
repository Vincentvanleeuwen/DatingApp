const router = require('express').Router();
const Dog = require('../data/dogModel');

const multer  = require('multer');

let upload = multer({ dest: '../public/media/images/dogs/' });

const Room = require('../data/roomModel');


// Show all the dogs on localhost:4000/
router.get('/', async (req, res) => {

  req.session.user = {

    email: req.body.email,
    name: req.body.name

  };

  req.session.unratedDogs = await Dog.find()
  .lean()
  .then(dogs => {

    let currentDog = Dog.getDogFromEmail(dogs, req.session.user)[0];

    return dogs.filter(dog => {

      if (currentDog.dislikes.includes(dog.email) || currentDog.matches.includes(dog.email)) {

        console.log('Included in dislikes or matches.', dog.email);

      } else {

        if(dog.email !== currentDog.email) return dog;

      }

    });

  });

  res.render('match', {

    title: 'Match',
    style: 'match.css',
    path: 'matches',
    dogs: req.session.unratedDogs

  });

});


router.post('/', upload.single('profilePicture'), async (req, res) => {

  req.session.user = {

    name: req.body.firstName,
    email: req.body.email,
    age: req.body.age,
    breed: req.body.breed,
    description: req.body.description,
    gender: req.body.gender,
    toy: req.body.toy,
    personality: req.body.personality,
    matches: [],
    dislikes: [],
    images: [],
    status: '',
    lastMessage: ''

  };

  // Push new message to the database
  Dog.create([{

      email: req.session.user.email,
      name: req.session.user.name,
      age: req.session.user.age,
      breed: req.session.user.breed,
      images: req.session.user.images,
      status: req.session.user.status,
      lastMessage: req.session.user.lastMessage,
      description: req.session.user.description,
      favToy: req.session.user.toy,
      personality: req.session.user.personality,
      matches: req.session.user.matches,
      dislikes: req.session.user.dislikes

  }]);

  Dog.find()
  .lean()
  .then(dogs => {

    waitForCurrentDog();

    async function waitForCurrentDog() {

      return await Dog.findOne({email: req.session.user.email})
      .then(result => {

        const unratedDogs = dogs.filter(dog => {

          if(dog.email !== result.email) return dog;

        });

        res.render('match', {

          title: 'Match',
          style: 'match.css',
          path: 'matches',
          dogs: unratedDogs

        });

      })
      .catch(err => console.log('Error Finding dog, ', err));
      
    }

  })
  .catch(err => console.log(err));


});

router.post('/dislike-match', async (req, res) => {
  let currentDog = Dog.getDogFromEmail(req.session.allDogs, req.session.user)[0];

  if (!currentDog.dislikes.includes(req.body.email)) {

    currentDog.dislikes.push(req.body.email);

  }


  console.log('dislikes = ', currentDog);

  Dog.findOneAndUpdate({email: currentDog.email},
    {$set:{dislikes: currentDog.dislikes }},
    {new: true},
    (err, result) => {

    if(err) throw err;

    console.log(result);

    });

  req.session.unratedDogs = req.session.unratedDogs.filter(dog => {

    if (dog.email !== req.body.email) {

      return dog;

    }
    else {

      console.log('UnratedDogs error@137 matchjs');

    }

  });

  res.render('match', {

    title: 'Match',
    style: 'match.css',
    path: 'matches',
    dogs: req.session.unratedDogs

  });

});

router.post('/add-match', async (req, res) => {

  let currentDog = Dog.getDogFromEmail(req.session.allDogs, req.session.user)[0];
  let matchDog = Dog.getDogFromEmail(req.session.allDogs, req.body)[0];

  if (!currentDog.matches.includes(req.body.email)) {

    currentDog.matches.push(req.body.email);

  }

  Dog.findOneAndUpdate({email: currentDog.email},
    {$set:{matches: currentDog.matches }},
    {new: true},
    (err, result) => {

      if(err) throw err;

      console.log(result);

    });


  if (matchDog.matches.includes(currentDog.email)) {

    Room.create([{
      participants: [currentDog.email, matchDog.email]
    }]);

    res.render('newMatch', {

      title: 'New Match!',
      style: 'newMatch.css',
      path: 'matches',
      match: matchDog,


    });

  }
  else {

    res.render('match', {

      title: 'Match',
      style: 'match.css',
      path: 'matches',
      dogs: req.session.unratedDogs,

    });

  }


});
module.exports = router;
