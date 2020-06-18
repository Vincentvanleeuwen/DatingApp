const router = require('express')
.Router();
const Dog = require('../data/dogModel');
const Room = require('../data/dogModel');

const multer  = require('multer');

// let upload = multer({ dest: '../public/media/images/dogs/' });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/media/images/dogs/') //destination of file
    },
    
    filename: function (req, file, cb) {
        cb(null, file.originalname); //how file should be named in directory
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === "image/jpg"  || //filetype check
       file.mimetype ==="image/jpeg"  || 
       file.mimetype ===  "image/png"){
     
    cb(null, true);
  }else{
      cb(new Error("Image uploaded is not of type jpg/jpeg or png"),false);
  }
}

const upload = multer({storage: storage, fileFilter : fileFilter});

// Show all the dogs on localhost:4000/
router.get('/', async (req, res) => {

  Dog.find()
  .lean()
  .then(dogs => {

    waitForCurrentDog();

    async function waitForCurrentDog() {

      return await Dog.findOne({email: req.session.user.email})
      .then(result => {

        const unratedDogs = dogs.filter(dog => {

          if (result.dislikes.includes(dog.email) || result.matches.includes(dog.email)) {

          } else {

            if(dog.email !== result.email) return dog;

          }


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


router.post('/', upload.array('images'), async (req, res) => {

  console.log('reqbody', req.body);

  if (req.session.user.email === undefined && req.session.user.matches === undefined) {

    req.session.user = {

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

    };

    // Push new message to the database
    Dog.create([{

      email: req.session.user.email,
      name: req.session.user.name,
      password: req.session.user.password,
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

  } else if (req.session.user.email === undefined) {

    Dog.find()
    .lean()
    .then(dogs => {

      waitForCurrentDog();

      async function waitForCurrentDog() {

        return await Dog.findOne({email: req.body.email})
        .then(result => {

          const unratedDogs = dogs.filter(dog => {

            if (result.dislikes.includes(dog.email) || result.matches.includes(dog.email)) {

              console.log('included');

            } else {

              if(dog.email !== result.email) return dog;

            }

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

  } else {

    Dog.find()
    .lean()
    .then(dogs => {

      waitForCurrentDog();

      async function waitForCurrentDog() {

        return await Dog.findOne({email: req.session.user.email})
        .then(result => {

          const unratedDogs = dogs.filter(dog => {

            if (result.dislikes.includes(dog.email) || result.matches.includes(dog.email)) {

            } else {

              if(dog.email !== result.email) return dog;

            }

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

  }

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

    console.log('currentdog = ', result.currentDog);
    console.log('matchdog =', result.matchDog);


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

      Room.create([{
        participants: [currentDog.email, matchDog.email]
      }]);

      res.render('newMatch', {

        title: 'New Match!',
        style: 'newMatch.css',
        path: 'matches',
        match: matchDog


      });

    }
    else {

      console.log('reqsessionUnrated @299', req.session.unratedDogs);

      res.redirect('/match');

    }

  })
  .catch(err => console.log(err));

});

module.exports = router;
