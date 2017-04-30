

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
  var genreElement = dataJson.Genre.map(function(genre) {
    return '<li>'+ genre.name +'</li>';
  });
 var html='<p><img src="https://image.tmdb.org/t/p/w500' + dataJson.Poster +
 '" > </p><p>Title: '+ dataJson.Title + '</p><p>Release Date: '
  + dataJson.Release_date + '</p><p>Rating:'+ dataJson.Rating +
  '</p><p>Duration:'+ dataJson.Duration+' Minutes</p><p><ul>' +genreElement+
  '</ul></p><p>Overview: '
   + dataJson.Overview +'</p>';
 $('.js-search-results').removeClass('invisible');
 $('.js-search-results').html(html);


}
