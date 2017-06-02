const express = require('express');
const movieApi = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {User} = require('../movieUsers/User-model');

const { Movies } = require('./models');

movieApi.get("/", (req, res) => {
  Movies.getMovieId(req.query.query)
    .then(function () {
      Movies.getDataFromApi()
        .then(function () {
          Movies.getCastDetails()
            .then(function () {
              Movies.getResponseData(result)
                .then(function (result) {
                  res.json(result)
                })
                .catch(function (err) {
                  res.json({msg: err});
                });
            })
            .catch(function (err) {
              console.log(err);
            });
        })
        .catch(function (err) {
          console.log(err);
        });
    })
    .catch(function (err) {
      console.log(err);
    });
});

movieApi.post('/new', function (req, res, next) {
  console.log(req.user);
  console.log(req.body);
   User.findById(req.user._id, function (err, user) {
     console.log('User found! Adding Movies!', user);
     user.movieIds.push(req.body.MovieId);
     user.save(function (err) {
       console.log('movie added');
       console.log(err);
     });
     res.send(user);
   });
   
});



module.exports = movieApi;
