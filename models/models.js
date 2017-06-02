var TMDB_URL1 = "https://api.themoviedb.org/3/search/movie";
var TMDB_URL2 = "https://api.themoviedb.org/3/movie/";
var Client = require('node-rest-client').Client;
var client = new Client();
var searchTerm;
var movieId = [];
var movieCast = [];
var result = [];

const Movies = {
  getMovieId: function (searchTerm) {
    movieId = [];
    movieCast = [];
    result = [];
    var queryString = {
      parameters: {
        api_key: 'ccceb486c69dc202428bef9e18797cf3',
        query: searchTerm
      }
    };
    return new Promise(function (resolve, reject) {
      client.get(TMDB_URL1, queryString, function (data, response) {
        if (response.statusCode === 200) {
          data.results.forEach(function (item) {
            movieId.push(item.id);
          });
          resolve();
        } else {
          reject("No movies found!!");
        }
      });
    });
  },

  getDataFromApi: function () {
    var queryString = {
      parameters: { api_key: 'ccceb486c69dc202428bef9e18797cf3' }
    };
    var itemUrls = [];
    if (movieId.length !== 0) {
      movieId.forEach(function (id) {
        itemUrls.push(TMDB_URL2 + id);
      });
    }
    var itemPromises = itemUrls.map(function (url) {
      return new Promise((resolve, reject) => {
        client.get(url, queryString, function (data, response) {
          if (response.statusCode === 200) {
            resolve(data);
          } else {
            reject("Error1");
          }
        });
      });
    });
    return new Promise((resolve, reject) => {
      Promise
        .all(itemPromises)
        .then(function (data) {
          data.forEach(function (item) {
            result.push({
              MovieId: item.id,
              Title: item.title,
              Release_Date: item.release_date,
              Overview: item.overview,
              Poster: item.poster_path,
              Genre: item.genres,
              Rating: item.vote_average,
              Duration: item.runtime
            });
          });
          resolve();
        })
        .catch(function (err) {
          reject("Error2");
        });
    });

  },

  getCastDetails: function () {
    var queryString = {
      parameters: {
        api_key: 'ccceb486c69dc202428bef9e18797cf3'
      }
    };
    var castDetails = [];
    var itemUrls = [];
    if (movieId.length !== 0) {
      movieId.forEach(function (id) {
        itemUrls.push(TMDB_URL2 + id + "/casts");
      });
    }
    var itemPromises = itemUrls.map(function (url) {
      return new Promise((resolve, reject) => {
        client.get(url, queryString, function (data, response) {
          if (response.statusCode === 200) {
            resolve(data);
          } else {
            reject("Error3");
          }
        });
      });
    });

    return new Promise((resolve, reject) => {
      Promise
        .all(itemPromises)
        .then(function (data) {
          data.forEach(function (item) {
            item.cast.forEach(function (itm) {
              castDetails.push({ castName: itm.name, characterName: itm.character });
            });
            movieCast.push({ MovieId: item.id, CastInfo: castDetails });
          });
          resolve();
        })
        .catch(function (err) {
          reject("Error4");
        });
    });

  },


  getResponseData: function () {
    return new Promise((resolve, reject) => {  
      if(result.length!==0){ 
      for (var i = 0; i < result.length; i++) {
        if (result[i].MovieId === movieCast[i].MovieId) {
          result[i].CastInfo = movieCast[i].CastInfo;
        }
      }
      resolve(result);
      }else{
        reject("Error5");
      }
    });
  }
}

function createMoviesModel() {
  const storage = Object.create(Movies);
  storage.movies = [];
  return storage;
}
module.exports = { Movies: createMoviesModel() };
