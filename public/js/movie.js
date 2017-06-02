$(function() {
    $('.js-search-results').hide();
    $(".js-search-form").submit(function(e) {
    e.preventDefault();
    var searchTerm = $(this).find(".js-search-input").val();
   
    getMovie(searchTerm);
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
displaySearchData(data);
})
.fail(function(error) {
  console.log(error);
})
}
 
function displaySearchData(dataJson){
    var html = '';
     html += '<div class="ui list">';
    dataJson.forEach(function(movie){
       html+='<div class="item"><a class="header">'+ movie.Title+'</a>'+movie.Overview+'</div>'+
      ' <form class="movieForm" action="/movies/new" method="POST"><input class="hidden moviebtn" type="text" value="'+movie.MovieId+'" name="MovieId">'+
       '<input type="submit" class="button tiny ui" value="Add"></form>';
    });
html+='</div>';

// <input type="text" class="moviebtn" value="movie.Title" name="Title">

 $('.movieForm').submit(function (evnt) {
   evnt.preventDefault();
 });
//   console.log($('.moviebtn').val());
//   evnt.preventDefault();
//   $.ajax({
//   url: '/movies/new',
//   method: 'POST',
//   dataType: 'json',
//   data: $('.moviebtn').val()
// })
// .done(function(data) {
//   console.log(data);
// //displaySearchData(data);
// })
// .fail(function(error) {
//   console.log(error);
// })
// });




//   var genreElement = " ";
//   var castElement = " ";
//   dataJson.Genre.forEach(function(genre) {
//     genreElement+= '<div class="ui tag red label"><p>'+ genre.name +'</p></div>';
//   });
//   dataJson.Cast.forEach(function(cast){
//     castElement+='<li>'+ cast.name + ' as "' + cast.character + '"</li>';
//   });


//   var html = '<div class="header"><h2>'+ dataJson.Title +'</h2></div><div class="image content">'+
//       '<div class="ui small circular image"><img src="https://image.tmdb.org/t/p/w500'+ dataJson.Poster +'">'+
//      '</div><div class="description"><div class="ui header">Overview : </div>'+
//         '<p>' + dataJson.Overview +'</p>'+'<p><input type="text" class="dial"></p>'+
//         '<p>Genre:'+ genreElement +'</p></div></div>'+
//         '<div class="ui list">'+
//   '<a class="item">'+
//     '<div class="header">New York City</div>'+
//     'A lovely city'+
//   '</a>'+
//   '<a class="item">'+
//     '<div class="header">Chicago</div>'+
//     'Also quite a lovely city'+
//   '</a>'+
//   '<a class="item">'+
//     '<div class="header">Los Angeles</div>'+
//     'Sometimes can be a lovely city'+
//   '</a>'+
//   '<a class="item">'+
//     '<div class="header">San Francisco</div>'+
//     'What a lovely city'+
//   '</a>'+
// '</div>';



 // var html='<div class="image content"><div class="ui medium image"><img class="ui small circular image" src="https://image.tmdb.org/t/p/w500' + dataJson.Poster +
 // '" ></div></div><p>Title: '+ dataJson.Title + '</p><p>Release Date: '
 //  + dataJson.Release_date + '</p><p>Rating:'+ dataJson.Rating +
 //  '</p><p>Duration:'+ dataJson.Duration+' Minutes</p><p>Genre: <ul>' +genreElement+
 //  '</ul></p><p>Overview: '+ dataJson.Overview +'</p><p>Cast Details: <ul>'+
 //  castElement +'</ul></p>';

$('.js-search-results').html(html);
 $('.js-search-results').show();
  
//  $(".dial").val(dataJson.Rating).knob({
//    "readOnly":true,
//    "fgColor":"green",
//    "width":"60",
//    "thickness":".3",
//    "min":0,
//    "max":10
// });
//  $('.js-search-results')
//   .transition('slide down')
// ;
}