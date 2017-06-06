const LocalStrategy = require('passport-local').Strategy;
const express = require('express');
const jsonParser = require('body-parser').json();
const passport = require('passport');
const flash = require('connect-flash');  
const {User} = require('./User-model');
const router = express.Router();
const path = require('path');
const localStrategy = new LocalStrategy((username, password, callback) => {
  let user;
  User
    .findOne({username: username})
    .exec()
    .then(_user => {
      user = _user;
      if (!user) {
        return callback(null, false);
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return callback(null, false);
      }
      else {
        return callback(null, user)
      }
    })
    .catch(err => {
      res.status(500).json({message: 'Internal server error'})
    });
    
});


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
passport.use(localStrategy);
router.use(passport.initialize());

router.post('/', (req, res) => {  

  let {username, password, firstName, lastName} = req.body;
  if ((firstName === '')) {
    return res.status(422).json({message: 'Please Enter First Name.'});
  }
 if ((lastName === '')) {
    return res.status(422).json({message: 'Please Enter Last Name.'});
  }
  if (typeof username !== 'string') {
    return res.status(422).json({message: 'Please Enter a valid Username.'});
  }

  username = username.trim();

  if (username === '') {
    return res.status(422).json({message: 'Please Enter a valid Username.'});
  }

  if (!(password)) {
    return res.status(422).json({message: 'Please Enter a Password.'});
  }

  if (typeof password !== 'string') {
    return res.status(422).json({message: 'Please Enter a valid Password.'});
  }

  password = password.trim();

  if (password === '') {
    return res.status(422).json({message: 'Please Enter a Password.'});
  }

  return User
    .find({username})
    .count()
    .exec()
    .then(count => {
      if (count > 0) {
        return res.status(422).json({message: 'Username already taken.'});
      }
      return User.hashPassword(password)
    })
    .then(hash => {
      return User
        .create({
          username: username,
          password: hash,
          firstName: firstName,
          lastName: lastName
        })
    })
    .then(user => {
      console.log(user);
      return res.status(200).json({message:user.username});
    })
    .catch(err => {
      res.status(500).json({message: 'Internal server error'})
    });
});


router.get('/', (req, res) => {
  return User
    .find()
    .exec()
    .then(users => res.json(users.map(user => user.apiRepr())))
    .catch(err => console.log(err) && res.status(500).json({message: 'Internal server error'}));
});


router.post('/me', passport.authenticate('local'),
  function (req, res , next) {
    console.log('Login Data in authenticate: ', req.body);
    console.log(' current user ', req.user._id);

    res.send({
      redirectTo: '/users/dashboard',
      msg: 'loginMessage',
      granted: true,
      user: req.user.username
    });
  });

router.get('/dashboard', function (req, res, next) {
   console.log('the param', req.user._id);
  console.log('recieving url to go to dashboard');
  res.sendFile(path.resolve('public/profile.html'));
});



router.get('/favorites', function (req, res, next) {
  User.findById(req.user._id, function (err, user) {
    res.send(user.movies);
  });
});

router.get('/logout', function(req, res) {
  req.logout();
  req.session.destroy();
  console.log('User logged out');
});


module.exports = {router};



