

$(function() {
  search();
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

function search() {
  $(".js-search-form").submit(function(e) {
    e.preventDefault();
    var searchTerm = $(this).find(".js-search-input").val();
    getMovie(searchTerm);
  });
}

function displaySearchData(dataJson){
  var genreElement = " ";
  var castElement = " ";
  dataJson.Genre.forEach(function(genre) {
    genreElement+= '<li>'+ genre.name +'</li>';
  });
  dataJson.Cast.forEach(function(cast){
    castElement+='<li>'+ cast.name + ' as "' + cast.character + '"</li>'
  });

 var html='<p><img src="https://image.tmdb.org/t/p/w500' + dataJson.Poster +
 '" > </p><p>Title: '+ dataJson.Title + '</p><p>Release Date: '
  + dataJson.Release_date + '</p><p>Rating:'+ dataJson.Rating +
  '</p><p>Duration:'+ dataJson.Duration+' Minutes</p><p>Genre: <ul>' +genreElement+
  '</ul></p><p>Overview: '+ dataJson.Overview +'</p><p>Cast Details: <ul>'+
  castElement +'</ul></p>';
  $('.js-search-results').html(html);
 $('.ui.modal.results').modal('show');


}
