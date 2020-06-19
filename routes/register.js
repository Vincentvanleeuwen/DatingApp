const router = require('express').Router();
const Dog = require('../data/dogModel');
const multer  = require('multer');

// let upload = multer({ dest: '../public/media/images/dogs/' });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    cb(null, './public/media/images/dogs/'); //destination of file

  },

  filename: function (req, file, cb) {

    cb(null, file.originalname); //how file should be named in directory

  }
});

const fileFilter = (req, file, cb) => {

  if(file.mimetype === 'image/jpg'  || //filetype check
    file.mimetype === 'image/jpeg'  ||
    file.mimetype ===  'image/png'){

    cb(null, true);

  } else {

    cb(new Error('Image uploaded is not of type jpg/jpeg or png'), false);

  }

};

const upload = multer({storage: storage, fileFilter : fileFilter});


// Show all the dogs on localhost:4000/
router.get('/', async (req, res) => {

  req.session.user = null;

  res.render('register', {
    layout: 'noNavigation',
    title: 'Login as',
    style: 'register.css',
    register: true,

  });

});

router.post('/', upload.array('images'), async (req, res) => {

  // console.log('reqbody in register', req.body);


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

      console.log('dogInCreateDog', dog);

      // Dog.find()
      // .lean()
      // .then(dogs => {
      //
      //   console.log('userdefined?', dog);
      //
      //
      //
      // })
      // .catch(err => console.log(err));

      res.redirect('match');

    });

});

module.exports = router;
