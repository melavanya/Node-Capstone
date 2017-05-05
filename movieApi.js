const express = require('express');
const movieApi = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Movies} = require ('./models');

movieApi.get("/",(req,res) => {
  Movies.getMovieId(req.query.query)
  .then(function(){
    Movies.getDataFromApi()
    .then(function(){
      Movies.getCastDetails()
      .then(function(result){
        res.json(result)
      });
    });


  });
});

module.exports = movieApi;
