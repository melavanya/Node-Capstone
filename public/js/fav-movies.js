$(function () {
    $('.js-search-results').hide();
    getFavMovies();
    //getFavMovieDetails();

    var viewportWidth = $(window).width();
if (viewportWidth <= 500) {
  $('.full-menu').css('display', 'none');
}
    //Sidebar Toggle
    $('.ui.fixed.button').click(function (e) {
        e.preventDefault();
        $('.ui.sidebar').sidebar('toggle');
    });


    //User Log-out    
    $('.log-out').click(function () {
        $.getJSON('/users/logout', function () {
            console.log('user logged out');
        });
    });
});//End of JQuery Line


//Display favorite movies
function getFavMovies() {
    $.getJSON('/users/favorites', function (data) {
        favoriteMovies = data;
        $('.fav-movies').html(data.length);
        displaySearchData(data);
    });
}


//Display details of the favorite Movies
function displaySearchData(dataJson) {
    $('.js-search-results').html('');
    var html = "";
    html += '<div class="ui small images">';
    dataJson.forEach(function (movie) {
        console.log(movie)
        if(movie.comment == undefined || "" || null){
            movie.comment = "No Comments";
        }
        html += '<div class="ui small spaced image"><div class="ui black ribbon label"><i class="plus icon"></i>' + movie.dateAdded + '</div>' +
        '<a class="modal-show" id="' + movie.movieId + '"><img src="https://image.tmdb.org/t/p/w500' + movie.poster + '"></a></div>' +
        '<div class="ui small modal ' + movie.movieId + '"><i class="close icon"></i><div class="header">' + movie.title +
        '</div><div class="image content"><div class="ui medium image"><img src="https://image.tmdb.org/t/p/w500' + movie.poster + '">' +
        '</div><div class="description"><div class="ui header"><h4>Your Comment</h4><p>'+ movie.comment +'</p>'+
        '</div></div></div><div class="actions"><div class="ui negative labeled icon button">Delete from favorites!<i class="remove icon"></i>' +
        '</div></div></div>';

    });
    html += '</div>';
    $('.js-search-results').html(html);

    $('.modal-show').click(function () {
        var modalClass = '.ui.modal.' + $(this).attr('id');
        var movieId = $(this).attr('id');
        $(modalClass).modal({
            onDeny: function () {
                swal({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then(function () {
                    $.ajax({
                        url: '/movies/delete',
                        data: { movieId: movieId },
                        type: 'DELETE'
                    })
                        .done(function (data) {
                            getFavMovies();
                        })
                        .fail(function (error) {
                            console.log('Error Occured.',error);
                        });
                    swal(
                        'Deleted!',
                        'Movie has been deleted from your favorite list.',
                        'success'
                    )
                })
            }
        }).modal('show');
    });
    $('.js-search-results').show();
}