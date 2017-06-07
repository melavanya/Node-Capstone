$(function(){
 $('.js-search-results').hide();
$.getJSON('/users/favorites', function (data) {
    favoriteMovies = data;    
    $('.fav-movies').html(data.length);
  });

  $.getJSON('/movies/fav-movies', function (data) {
  for(var i=0;i<favoriteMovies.length;i++){
      if(favoriteMovies[i].movieId === data[i].MovieId){
          data[i].dateAdded = favoriteMovies[i].dateAdded;
      }
  }
    displaySearchData(data);
});

  $('.log-out').click(function () {
    $.getJSON('/users/logout', function () {
      console.log('user logged out');
    });
});
});


function displaySearchData(dataJson) {
  $('.js-search-results').html('');
var html="";
html+='<div class="ui small images">';


dataJson.forEach(function (movie) {
var genreElement = " ";
var castElement = " ";

    movie.Genre.forEach(function (genre) {
      genreElement += '<div class="ui tag red label">' + genre.name + '</div>';
    });

    if (movie.CastInfo !== undefined) {
      movie.CastInfo.forEach(function (cast) {
        castElement += '<div class="item"><div class="header">' + cast.castName + '</div> As ' + cast.characterName + '</div>';
      });
    }
    html += '<div class="ui small spaced image"><div class="ui black ribbon label"><i class="plus icon"></i>'+movie.dateAdded+'</div>'+
'<a class="modal-show" id="'+movie.MovieId+'"><img src="https://image.tmdb.org/t/p/w500' + movie.Poster + '"></a></div>'+
    
    
    '<div class="ui modal ' + movie.MovieId + '"><i class="close icon"></i><div class="header">' + movie.Title +
      '</div><div class="image content"><div class="ui medium image"><img src="https://image.tmdb.org/t/p/w500' + movie.Poster + '">' +
      '</div><div class="description"><div class="ui header">' + movie.Overview +
      '</div><div class="ui horizontal list"><div class="item"><div class="header">Released On:' + movie.Release_Date + '</div></div>' +
      '<div class="item"><div class="header">Run-time:' + movie.Duration + ' Minutes</div>' +
      '</div></div><div class="ui header">Rating:' + movie.Rating + '</div><p>Genre:</p>' + genreElement +
      '<p></p><p>Cast:</p><div class="ui list">' + castElement + '</div></div></div>' +
      '<div class="actions"><div class="ui negative labeled icon button">Delete from favorites!<i class="remove icon"></i>' +
      '</div></div></div>';

  });
  html += '</div>';
 $('.js-search-results').html(html);
  

  $('.modal-show').click(function () {
    var modalClass = '.ui.modal.' + $(this).attr('id');
    console.log(modalClass);
    var movieId = $(this).val();

    $(modalClass).modal({
      onDeny: function () {
          console.log('deleted');
        // $.ajax({
        //   url: '/movies/delete',
        //   type: 'POST',
        //   data: { movieId: movieId }
        // })
        //   .done(function (data) {
        //     if (data.length === undefined) {
        //       swal(
        //         'Hey There!',
        //         'Movie was already added to Favorites on ' + data.dateAdded + '!',
        //         'success',
        //       )
        //     }
        //     favoriteMovies = data;
        //     console.log(favoriteMovies,'in add modal');       
        //     $('.fav-movies').html(data.length);
        //   })
        //   .fail(function (error) {
        //     console.log(error);
        //   });
      }

    })
      .modal('show');

  });

  $('.js-search-results').show();



}