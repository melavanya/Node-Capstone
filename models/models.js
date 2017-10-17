var TMDB_URL1 = "https://api.themoviedb.org/3/search/movie";
var TMDB_URL2 = "https://api.themoviedb.org/3/movie/";
var Client = require('node-rest-client').Client;
var client = new Client();
var searchTerm;
var movieId = [];
var movieCast = [];
var result = [];
var castDetails = [];

const Movies = {
  getMovieId: function (searchTerm) {
    movieId = [];
    result = [];
    movieCast = [];
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
          resolve(movieId);
        } else {
          reject(response.statusCode);
        }
      });
    });
  },

  getDataFromApi: function (Ids) {
    result = [];
    movieId = Ids;
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
            reject("Movie Details Not found!");
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
          resolve(result);
        })
        .catch(function (err) {
          reject(err);
        });
    });
  },

  getCastDetails: function (result) {
    var queryString = {
      parameters: {
        api_key: 'ccceb486c69dc202428bef9e18797cf3'
      }
    };
    movieCast = [];
    var itemUrls = [];
    if (movieId.length !== 0) {
      movieId.forEach(function (id) {
        itemUrls.push(TMDB_URL2 + id + "/casts");
      });
    }
    var itemPromises = itemUrls.map(function (url) {
      return new Promise((resolve, reject) => {
        client.get(url, queryString, function (data, response) {
          resolve(data);
        });
      });
    });

    return new Promise((resolve, reject) => {
      Promise
        .all(itemPromises)
        .then(function (data) {
          data.forEach(function (item) {
            castDetails = [];
            if (typeof (item.cast) !== 'undefined') {
              item.cast.forEach(function (itm) {
                castDetails.push({ castName: itm.name, characterName: itm.character });
              });
              var cast = castDetails.slice(0, 5);
              movieCast.push({ MovieId: item.id, CastInfo: cast });
            }
            else {
              movieCast.push({ MovieId: item.id, CastInfo: undefined });
            }
          });
          resolve();
        })
        .catch(function (err) {
          reject(err);
        });
    });

  },


  getResponseData: function () {
    return new Promise((resolve, reject) => {
      if (result.length !== 0) {
        for (var i = 0; i < result.length; i++) {
          if (result[i].MovieId === movieCast[i].MovieId) {
            result[i].CastInfo = movieCast[i].CastInfo;
          }
        }
        resolve(result);
      } else {
        reject({ msg: "Cannot get Response data!" });
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
