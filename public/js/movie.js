$(function() {
 $('.response').hide(); 
 $('.js-search-results').hide();
    $(".js-search-form").submit(function(e) {
    e.preventDefault();
    var searchTerm = $(this).find(".js-search-input").val();
    getMovie(searchTerm);
   });

   $.getJSON('/movies/userFavorites', function (data) {
     console.log(data);
     $('.label').html(data.length);
   });

});

function getMovie(searchTerm){
$.ajax({
  url: '/movies',
  dataType: 'json',
  data: {
    query:searchTerm
  }
})
.done(function(data) {
  console.log(data);
displaySearchData(data);
})
.fail(function(error) {
  console.log(error);
})
}
 
function displaySearchData(dataJson){

  $('.js-search-results').html('');

  var html = '';
  html += '<div class="ui styled fluid accordion">';

  dataJson.forEach(function(movie){

    var genreElement = " ";
    var castElement = " ";

    movie.Genre.forEach(function(genre) {
    genreElement+= '<div class="ui tag red label">'+ genre.name +'</div>';
    });
    
    if(movie.CastInfo !== undefined){
    movie.CastInfo.forEach(function(cast){
    castElement+='<div class="item"><div class="header">'+cast.castName+'</div> As '+cast.characterName+'</div>';
    });
  }
  
    html+='<div><div class="title"><i class="dropdown icon"></i>'+ movie.Title +
'</div><div class=" content"><p>'+movie.Overview+ '</p><button class="ui green button modal-show" value="'+movie.MovieId+'">Details</button></div>'+
'<div class="ui modal '+ movie.MovieId +'"><i class="close icon"></i><div class="header">'+ movie.Title +
'</div><div class="image content"><div class="ui medium image"><img src="https://image.tmdb.org/t/p/w500'+ movie.Poster +'">'+
'</div><div class="description"><div class="ui header">'+ movie.Overview +
'</div><div class="ui horizontal list"><div class="item"><div class="header">Released On:'+movie.Release_Date+'</div></div>'+
'<div class="item"><div class="header">Run-time:'+ movie.Duration + ' Minutes</div>'+
'</div></div><div class="ui header">Rating:'+movie.Rating+'</div><p>Genre:</p>'+genreElement+
'<p></p><p>Cast:</p><div class="ui list">'+castElement+'</div></div></div>'+
'<div class="actions"><div class="ui positive labeled icon button">Add to Favorites!<i class="checkmark icon"></i>'+
'</div></div></div></div>';

});
html+='</div>';



$('.js-search-results').html(html);
$('.ui.accordion').accordion();

$('.modal-show').click(function(){
  var modalClass='.ui.modal.'+$(this).val();
  var movieId = $(this).val();
  console.log(movieId);
$(modalClass).modal({
    onApprove : function() {
      $.ajax({
        url: '/movies/new',
        type: 'POST',
        data: { movieId: movieId }
      })
        .done(function (data) {
          console.log(data);

        })
        .fail(function (error) {
          console.log(error);
        });
    }
  })
  .modal('show');


});




 
$('.js-search-results').show();
  
  


//  $('.js-search-results')
//   .transition('slide down');
  
 
}
