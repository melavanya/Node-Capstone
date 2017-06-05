const express = require('express');
const movieApi = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {User} = require('../movieUsers/User-model');
const moment = require('moment');
const { Movies } = require('./models');

movieApi.get("/", (req, res) => {
  Movies.getMovieId(req.query.query)
    .then(function (movieId) {
      Movies.getDataFromApi(movieId)
        .then(function (result) {
          Movies.getCastDetails(result)
            .then(function () {
              Movies.getResponseData()
                .then(function (result) {
                  res.json(result);
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
    })
    .catch(function (err) {
      console.log(err);
    });
});

movieApi.post('/new', function (req, res, next) {
   User.findById(req.user._id, function (err, user) {
     var flag,dateAdded;
     user.movies.forEach(function(movie) {
       if(movie.movieId == req.body.movieId){
         flag=true;
         dateAdded=movie.dateAdded;
       }
     });
     if(flag === true){
      res.json({message:`Movie was added already on : ${dateAdded}`});
     }
     else{
     user.movies.push(
       { dateAdded:moment().format('MMMM Do YYYY'),
         movieId:req.body.movieId
      });
     user.save(function (err) {
       console.log('movie added');
     });
     res.send(user.movies);
     }
   });
   

   
});



module.exports = movieApi;
