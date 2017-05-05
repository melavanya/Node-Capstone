var TMDB_URL1 = "https://api.themoviedb.org/3/search/movie";
var TMDB_URL2 = "https://api.themoviedb.org/3/movie/";
var result = {};
var Client = require('node-rest-client').Client;
var client = new Client();
var searchTerm;
var movieId="";


const Movies = {

   getMovieId: function(searchTerm){
    var queryString = {
      parameters : { api_key: 'ccceb486c69dc202428bef9e18797cf3',
      query: searchTerm }
    };
    return new Promise(function(resolve , reject){
      client.get(TMDB_URL1, queryString ,function( data , response){
        if(response.statusCode === 200){
          if(data.results.length !== 0){
            movieId=data.results[0].id;
            resolve();
          } else {
            reject();
          }
        }
      });
    });
  },

   getDataFromApi: function(){
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
},

getCastDetails: function(){
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

}
function createMoviesModel() {
  const storage = Object.create(Movies);
  storage.posts = [];
  return storage;
}
module.exports = {Movies: createMoviesModel()};
