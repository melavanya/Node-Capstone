var favoriteMovies = [];
$(function () {
  $('.js-search-results').hide();

  var viewportWidth = $(window).width();
  if (viewportWidth <= 500) {
    $('.full-menu').css('display', 'none');
  }

  //Sidebar toggle button
  $('.ui.fixed.button').click(function (e) {
    e.preventDefault();
    $('.ui.labeled.icon.sidebar').sidebar('toggle');
  });

  //Get Movie Details
  $(".js-search-form").submit(function (e) {
    e.preventDefault();
    var searchTerm = $(this).find(".js-search-input").val();
    $('.js-submit-search').addClass('loading');
    $('.js-search-input').parent().addClass('disabled');
    getMovies(searchTerm).then(function (data) {
      //Set TimeOut as only fewer requests are allowed by TMDB API
      setTimeout(function () {
        $('.js-submit-search').removeClass('loading');
        $('.js-search-input').parent().removeClass('disabled');
      }, 10000)
    });
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
  return $.ajax({
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
      '<div class="ui modal coupled ' + movie.MovieId + '" id=' + movie.MovieId + '><i class="close icon"></i><div class="header">' + movie.Title +
      '</div><div class="image content"><div class="ui image"><img class="poster-img" src="https://image.tmdb.org/t/p/w500' + movie.Poster + '">' +
      '</div><div class="description"><div class="ui header">' + movie.Overview +
      '</div><div class="ui horizontal list"><div class="item"><div class="header">Released On:' + movie.Release_Date + '</div></div>' +
      '<div class="item"><div class="header">Run-time:' + movie.Duration + ' Minutes</div>' +
      '</div></div><div class="ui header">Rating:' + movie.Rating + '</div><p>Genre:</p>' + genreElement +
      '<p></p><p>Cast:</p><div class="ui list">' + castElement + '</div></div></div>' +
      '<div class="ui actions"><div class="ui positive labeled icon button check-fav" id=' + movie.MovieId + '>Add to Favorites!<i class="checkmark icon"></i>' +
      '</div></div></div></div>' +
      '<div class="ui mini modal coupled second ' + movie.MovieId + '" id=2' + movie.MovieId + ' ><div class="header">Your Comments!</div><div class="content">' +
      '<div class="ui form comments"><div class="field"><textarea id="comment' + movie.MovieId + '" rows="2"></textarea></div>' +
      '</div></div><div class="actions"><div class="ui positive button">Save</div>' +
      '</div></div>';
  });
  html += '</div>';

  $('.js-search-results').html(html);
  $('.ui.accordion').accordion();
  $('.modal-show').click(function () {
    var movieId = $(this).val();
    var dataToBeSent = {};
    dataJson.forEach(function (movie) {
      if (movie.MovieId == movieId) {
        dataToBeSent = Object.assign({}, {
          'movieId': movieId,
          'poster': movie.Poster,
          'title': movie.Title
        });
      }
    });

    $('.coupled.modal')
      .modal({
        allowMultiple: false
      });
    $('#2' + $(this).val()).modal('attach events', '.ui.positive.button.check-fav');
    $('#' + $(this).val()).modal('show');

    $('#2' + $(this).val()).modal({
      onApprove: function () {
        dataToBeSent.comment = $('#comment' + movieId).val();
        $.ajax({
          url: '/movies/new',
          type: 'POST',
          data: {
            dataToBeSent
          }
        })
          .done(function (data) {
            if (data.length === undefined) {
              swal(
                'Movie was already added to Favorites on ' + data.dateAdded + '!'
              )
            }
            else {
              favoriteMovies = data;
              $('.fav-movies').html(data.length);
              swal(
                'Movie added to Favorites!'
              )
            }
          })
          .fail(function (error) {
            console.log('Error Occured.', error);
          });

      }
    });
  });

  $('.js-search-results').show();
}
