const express = require('express');
const movieApi = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {User} = require('../movieUsers/User-model');
const moment = require('moment');
const { Movies } = require('./models');
const path = require('path');


movieApi.get("/", (req, res) => {
  Movies.getMovieId(req.query.query)
    .then(function (Ids) {
     Movies.getDataFromApi(Ids)
    .then(function (result) {
      Movies.getCastDetails(result)
    .then(function () {
      Movies.getResponseData()
    .then(function (result) {
      res.json(result);
        })

    .catch(function (err) {
      res.json(err);
      console.log(err);
       });
       })
    .catch(function (err) {
     res.json({err});
     console.log(err);
        });
        })
    .catch(function (err) {
     res.json({err});
      console.log(err);
        });
        })
    .catch(function (err) {
      res.json({err});
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
      res.json({dateAdded});
     }
     else{
     user.movies.push(
       { dateAdded:moment().format('MMMM Do YYYY'),
         movieId:req.body.movieId,
         comment:req.body.comment
      });
     user.save(function (err) {
       console.log('movie added');
     });
     res.send(user.movies);
     }
   });
});

movieApi.get("/favorites", (req, res, next) => {
res.sendFile(path.resolve('public/dashboard.html'));
});

movieApi.get("/fav-movies", (req, res, next) => {
  var favmovieIds=[];
  req.user.movies.forEach(function(movie){
    favmovieIds.push(movie.movieId);
  });
      Movies.getDataFromApi(favmovieIds)
        .then(function (result) {
         Movies.getCastDetails(result)
        .then(function () {
          Movies.getResponseData()
        .then(function (result) {
          res.send(result);
            })
        .catch(function (err) {
         res.json({Error:err});
         console.log(err);
            });
            })
        .catch(function (err) {
          res.json({Error:err});
          console.log(err);
           });
           })
        .catch(function (err) {
          res.json({Error:err});
          console.log(err);
        });
    
});

movieApi.delete('/delete',(req,res,next) =>{
User.findById(req.user._id, function(err,user) {
var movieId = parseInt(req.body.movieId);
user.movies.forEach(function(movie,index){
if(movieId === movie.movieId){
  user.movies.splice(index,1);
}
});
user.save(function (err) {
       console.log('movie deleted');
     });
 res.json(user.movies); 
});
});

// movieApi.update('/add-comment', (req, res, next) => {
//   User.findById(req.user._id, function (err, user) {
//     var movieId = parseInt(req.body.movieId);
//     user.movies.forEach(function (movie, index) {
//       if (movieId === movie.movieId) {
//         user.movies.comment = req.body.comment;
//       }
//     });
//     user.save(function (err) {
//       console.log('movie updated');
//     });
//     res.json(user.movies);
//   });
// });

module.exports = movieApi;
