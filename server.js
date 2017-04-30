var express = require('express');
var app = express();
var TMDB_URL1 = "https://api.themoviedb.org/3/search/movie";
var TMDB_URL2 = "https://api.themoviedb.org/3/movie/";

var bodyParser = require('body-parser');
var result = {};
var Client = require('node-rest-client').Client;
var client = new Client();
var searchTerm;
var movieId="";

function getMovieId (searchTerm){
  var queryString = {
    parameters : { api_key: 'ccceb486c69dc202428bef9e18797cf3',
    query: searchTerm }
  };
  return new Promise(function(resolve , reject){
  client.get(TMDB_URL1, queryString ,function( data , response){
    if(response.statusCode=== 200){
      if(data.results.length !== 0){
        movieId=data.results[0].id;
        console.log(movieId);
        resolve();
      } else {
        reject();
      }
    }

});
});
}

function getDataFromApi(movieId) {
  var queryString = {
    parameters : { api_key: 'ccceb486c69dc202428bef9e18797cf3'
    }
  };
  return new Promise(function(resolve , reject){
    client.get(TMDB_URL2+movieId, queryString ,function( data , response){
      if(response.statusCode=== 200){
          result.Title = data.title;
          result.Release_Date = data.release_date;
          result.Overview = data.overview;
          result.Poster = data.poster_path;
          result.Genre = data.genres;
          result.Rating = data.vote_average;
          result.Duration = data.runtime;
          console.log(result);
          resolve(result);
        }else {
          reject();
        }
    });

  });
}



app.use(express.static('public'));

app.get("/movies",(req,res) => {
  getMovieId(req.query.query)
  .then(function(){
    getDataFromApi(movieId)
      .then(function(){
        res.json(result)
      });


  });
});



  app.listen(process.env.PORT || 8080, () => console.log(
    `Your app is listening on port ${process.env.PORT || 8080}`));
