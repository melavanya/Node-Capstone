

$(function() {
  $('.response').hide();
  $('.menu .item').tab();
  $('.js-signup-form').submit(function (e) {
  
    var signUpData = {
      username: $('.js-signup-username').val(),
      password: $('.js-signup-password').val(),
      firstName: $('.js-signup-firstname').val(),
      lastName: $('.js-signup-lastname').val(),
    };
    e.preventDefault();
      $.ajax({
  url: '/users',
  type : 'POST',
  data: signUpData
})
.done(function(data) {
  console.log(data);
  if(data.granted === true) {
    window.location = data.redirectTo;
  }
})
.fail(function(error) {
  console.log(error);
  console.log(error.responseText);
  $('.response').show();
  $('.response').html('<p>' + error.responseJSON.message + '</p>');
  $('.js-signup-password').val('');
})
.always(function() {
  console.log("complete");
});

 });


$('.js-login-form').submit(function (e) {
  
    var loginData = {
      username: $('.js-login-username').val(),
      password: $('.js-login-password').val(),
      firstName: $('.js-signup-firstname').val(),
      lastName: $('.js-signup-lastname').val(),
    };
    e.preventDefault();
      $.ajax({
  url: '/users/me',
  type : 'POST',
  data: loginData
})
.done(function(data) {
  console.log("success");
  console.log(data);
  if(data.granted === true) {
    window.location = data.redirectTo;
  }
})
.fail(function(error) {
  console.log(error);
  console.log(error.responseText);
  // if unauth -> display in a div that either username or password is incorrect.
  if(error.responseText === "Unauthorized") {
    $('.response').show();
    $('.response').html('<p>' + "Username or Password incorrect !!" + '</p>');
  }
})
.always(function() {
  console.log("complete");
});

 });



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
  console.log("success");
  displaySearchData(data);
})
.fail(function() {
  console.log("error");
})
.always(function() {
  console.log("complete");
});

}



  

function displaySearchData(dataJson){
  var genreElement = " ";
  var castElement = " ";
  dataJson.Genre.forEach(function(genre) {
    genreElement+= '<div class="ui tag red label">'+ genre.name +'</div>';
  });
  dataJson.Cast.forEach(function(cast){
    castElement+='<li>'+ cast.name + ' as "' + cast.character + '"</li>';
  });


  var html = '<div class="header">'+ dataJson.Title +'</div><div class="image content">'+
      '<div class="ui medium image"><img src="https://image.tmdb.org/t/p/w500'+ dataJson.Poster +'">'+
     '</div><div class="description"><div class="ui header">Overview : </div>'+
        '<p>' + dataJson.Overview +'</p>'+'<p><input type="text" class="dial"></p>'+
        '<p>Genre:'+ genreElement +'</p></div></div>';
 // var html='<div class="image content"><div class="ui medium image"><img class="ui small circular image" src="https://image.tmdb.org/t/p/w500' + dataJson.Poster +
 // '" ></div></div><p>Title: '+ dataJson.Title + '</p><p>Release Date: '
 //  + dataJson.Release_date + '</p><p>Rating:'+ dataJson.Rating +
 //  '</p><p>Duration:'+ dataJson.Duration+' Minutes</p><p>Genre: <ul>' +genreElement+
 //  '</ul></p><p>Overview: '+ dataJson.Overview +'</p><p>Cast Details: <ul>'+
 //  castElement +'</ul></p>';
  $('.js-search-results').html(html);
 $(".dial").val(dataJson.Rating).knob({
   "readOnly":true,
   "fgColor":"green",
   "width":"75",
   "thickness":".3",
   "min":0,
   "max":10
 });
//  $('.js-search-results')
//   .transition('slide down')
// ;
}
