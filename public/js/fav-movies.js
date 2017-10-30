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
        if(data.length === 0){
         $('.js-search-results').hide();
        }
        else{
        displaySearchData(data);
        }
    });
}


//Display details of the favorite Movies
function displaySearchData(dataJson) {
    $('.js-search-results').html('');
    var html = "";
    var comment="";
    var imgSrc = "";
    html += '<div class="ui small images">';
    dataJson.forEach(function (movie) {
        if(movie.poster == ""){
            imgSrc="/images/not-found.png";
          }else{
            imgSrc="https://image.tmdb.org/t/p/w500" + movie.poster;
          }
        html += '<div class="ui small spaced image"><div class="ui black ribbon label"><i class="plus icon"></i>' + movie.dateAdded + '</div>' +
        '<a class="modal-show" id="' + movie.movieId + '"><img src="'+ imgSrc + '"></a></div>' +
        '<div class="ui small modal ' + movie.movieId + '"><i class="close icon"></i><div class="header">' + movie.title +
        '</div><div class="image content"><div class="ui medium image"><img  src="' + imgSrc + '">' +
        '</div><div class="description"><div class="ui header"><h4>Your Comments</h4><div class="ui form"><div class="field">'+
        '<textarea class="js-comment" id="comment" placeholder="'+ movie.comment+'"></textarea></div></div>'+
        '</div></div></div><div class="actions"><div class="ui positive button">Update</div><div class="ui negative labeled icon button">Delete from favorites!<i class="remove icon"></i>' +
        '</div></div></div>';

    });
    html += '</div>';
    $('.js-search-results').html(html);

    $('.modal-show').click(function () {
        var modalClass = '.ui.modal.' + $(this).attr('id');
        var movieId = $(this).attr('id');
        $(modalClass).modal({
            onApprove: function (){
                var comment = $('#comment').val();
                if(comment !== ""){
                $.ajax({
                    url: '/movies/comment',
                    data: { movieId: movieId, comment: comment },
                    type: 'PUT'
                })
                    .done(function (data) {
                        console.log(data.comment);
                        $("#comment").attr("placeholder",data.comment).val("");
                    })
                    .fail(function (error) {
                        console.log('Error Occured.',error);
                    });
                }
            },
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