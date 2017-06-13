var favoriteMovies = [];
$(function () {
  $('.js-search-results').hide();

  //Sidebar toggle button
  $('.ui.fixed.button').click(function (e) {
    e.preventDefault();
    $('.ui.labeled.icon.sidebar').sidebar('toggle');
  });

  //Get Movie Details
  $(".js-search-form").submit(function (e) {
    e.preventDefault();
    var searchTerm = $(this).find(".js-search-input").val();
    getMovies(searchTerm);
  });

  //Favorites button Display
  $.getJSON('/users/favorites', function (data) {
    favoriteMovies = data;
    $('.fav-movies').html(data.length);
  });

  //User Log-out
  $('.log-out').click(function () {
    $.getJSON('/users/logout', function () {
      console.log('user logged out');
    });
  });

});//End of JQuery Line


//Get Movies Api Call
function getMovies(searchTerm) {
  $.ajax({
    url: '/movies',
    dataType: 'json',
    data: { query: searchTerm }
  })
    .done(function (data) {
      if (data.length !== undefined) {
        displaySearchData(data);
      }
      else {
        $('.js-search-results').hide();
        $('.js-search-results').html('');
        swal(
          'Oops...',
          'No movies found for your search term!',
          'error'
        )
      }
    })
    .fail(function (error) {
      console.log('Error Occured.', error);
    })
}


//Display Movies
function displaySearchData(dataJson) {
  $('.js-search-results').html('');
  var html = '';
  html += '<div class="ui styled fluid accordion movie-results">';
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
    html += '<div><div class="title"><i class="dropdown icon"></i>' + movie.Title +
      '</div><div class=" ui content"><p>' + movie.Overview + '</p><button class="ui green button modal-show" value="' + movie.MovieId + '">Details</button></div>' +
      '<div class="ui modal ' + movie.MovieId + '"><i class="close icon"></i><div class="header">' + movie.Title +
      '</div><div class="image content"><div class="ui medium image"><img src="https://image.tmdb.org/t/p/w500' + movie.Poster + '">' +
      '</div><div class="description"><div class="ui header">' + movie.Overview +
      '</div><div class="ui horizontal list"><div class="item"><div class="header">Released On:' + movie.Release_Date + '</div></div>' +
      '<div class="item"><div class="header">Run-time:' + movie.Duration + ' Minutes</div>' +
      '</div></div><div class="ui header">Rating:' + movie.Rating + '</div><p>Genre:</p>' + genreElement +
      '<p></p><p>Cast:</p><div class="ui list">' + castElement + '</div></div></div>' +
      '<div class="ui actions"><div class="ui positive labeled icon button check-fav">Add to Favorites!<i class="checkmark icon"></i>' +
      '</div></div></div></div>';
  });
  html += '</div>';

  $('.js-search-results').html(html);
  $('.ui.accordion').accordion();
  $('.modal-show').click(function () {
    var modalClass = '.ui.modal.' + $(this).val();
    var movieId = $(this).val();
    $(modalClass).modal({
      onApprove: function () {
        $.ajax({
          url: '/movies/new',
          type: 'POST',
          data: { movieId: movieId }
        })
        .done(function (data) {
            if (data.length === undefined) {
              swal(
                'Movie was already added to Favorites on ' + data.dateAdded + '!',
                'success',
              )
            }
            favoriteMovies = data;
            $('.fav-movies').html(data.length);
          })
        .fail(function (error) {
            console.log('Error Occured.',error);
          });
      }
    }).modal('show');
  });
  $('.js-search-results').show();
}
