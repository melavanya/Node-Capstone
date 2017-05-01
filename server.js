var express = require('express');
var app = express();
var TMDB_URL1 = "https://api.themoviedb.org/3/search/movie";
var TMDB_URL2 = "https://api.themoviedb.org/3/movie/";
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
      resolve();
    }else {
      reject();
    }
  });
});
}
function getCastDetails(movieId) {
  var queryString = {
    parameters : { api_key: 'ccceb486c69dc202428bef9e18797cf3'
  }
};
return new Promise(function(resolve , reject){
  client.get(TMDB_URL2+movieId+"/casts", queryString ,function( data , response){
    if(response.statusCode=== 200){
      if(data.cast.length !==0){
        result.Cast = data.cast;
        result.Crew = data.crew;
      }
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
      getCastDetails(movieId)
      .then(function(){
        res.json(result)
      });
    });


  });
});

let server;
function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err)
    });
  });
}
function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
