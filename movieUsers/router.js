var LocalStrategy = require('passport-local').Strategy;
const express = require('express');
const jsonParser = require('body-parser').json();
const passport = require('passport');

const {User} = require('./models');

const router = express.Router();
const path    = require("path");


const localStrategy = new LocalStrategy((username, password, callback) => {
  let user;
  console.log(' Username:' , username);
  User
    .findOne({username: username})
    .exec()
    .then(_user => {
      user = _user;
      if (!user) {
        return callback(null, false, {message: 'Incorrect username'});
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
  console.log(req.body);
  console.log('creating user');
  if (!req.body) {
    return res.status(400).json({message: 'No request body'});
  }

  if (!('username' in req.body)) {
    return res.status(422).json({message: 'Missing field: username'});
  }

  let {username, password, firstName, lastName} = req.body;

  if (typeof username !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: username'});
  }

  username = username.trim();

  if (username === '') {
    return res.status(422).json({message: 'Incorrect field length: username'});
  }

  if (!(password)) {
    return res.status(422).json({message: 'Missing field: password'});
  }

  if (typeof password !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: password'});
  }

  password = password.trim();

  if (password === '') {
    return res.status(422).json({message: 'Incorrect field length: password'});
  }

  return User
    .find({username})
    .count()
    .exec()
    .then(count => {
      if (count > 0) {
        return res.status(422).json({message: 'username already taken'});
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
      return res.status(201).json(user.apiRepr());
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


router.post('/me', passport.authenticate('local') , function(req, res, next) {
  console.log('Login Data in authenticate: ' , req.body);
  res.redirect('/users/dashboard');
    next();
    //console.log('checking login ' , req.logIn);
  });

//   router.get('/me', passport.authenticate('local', {
//   successRedirect: __dirname + '/profile.html',
//   failureRedirect: '/',
//   failureFlash: true,
// }));

router.get('/dashboard', function (req, res, next) {
  console.log('recieving url to got to dashboard');
  res.sendFile(__dirname + '/profile.html' );
});


module.exports = {router};
