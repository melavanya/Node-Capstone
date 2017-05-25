var LocalStrategy = require('passport-local').Strategy;
const express = require('express');
const jsonParser = require('body-parser').json();
const passport = require('passport');
    
const {User} = require('./models');

const router = express.Router();
const path    = require("path");


const localStrategy = new LocalStrategy((username, password, callback) => {
  let user;
  User
    .findOne({username: username})
    .exec()
    .then(_user => {
      user = _user;
      if (!user) {
        return res.status(422).json({message: 'Incorrect username'});
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return callback(null, false, {message: 'Incorrect password'});
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
  
  console.log('creating user');
  if (!req.body) {
    return res.status(400).json({message: 'No request body'});
  }

  if (!('username' in req.body)) {
    return res.status(422).json({message: 'Please Enter Username.'});
  }

  let {username, password, firstName, lastName} = req.body;

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
      return res.send({
        redirectTo: '/users/dashboard',
        msg: 'authed user',
        granted: true
      });
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


  function (req, res) {
    console.log('Login Data in authenticate: ', req.body);
    console.log(' current user ', req.user.username);

    res.send({
      redirectTo: '/users/dashboard',
      msg: 'authed user',
      granted: true,
      user: req.user.username
    });
  });

router.get('/dashboard/:user', function (req, res, next) {
   console.log('the param', req.params.user);
  console.log('recieving url to go to dashboard');
  res.sendFile(path.resolve('public/profile.html'));
});


module.exports = {router};
