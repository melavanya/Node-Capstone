var TMDB_BASE_URL = "https://api.themoviedb.org/3/search/movie";

$(function() {
  search();
});

function getDataFromApi(searchTerm ,callback) {
  var queryString = {
    api_key: 'ccceb486c69dc202428bef9e18797cf3',
    language: 'en-US',
    query: searchTerm
  };
  $.getJSON(TMDB_BASE_URL, queryString, callback);
}
//   $.ajax({
//     url: '/movieDB',
//     type: 'GET',
//     dataType: 'json',
//     data: {"title":searchTerm}
//   })
//   .done(function(data) {
//     console.log("success");
//     console.log(data);
//   })
//   .fail(function() {
//     console.log("error");
//   })
//   .always(function() {
//     console.log("complete");
//   });
// }


function search() {
  $(".js-search-form").submit(function(e) {
    e.preventDefault();
    var searchTerm = $(this).find(".js-search-input").val();
  //  console.log(searchTerm);
    getDataFromApi(searchTerm, displaySearchData);
  });
}




function displaySearchData(dataJson){
  console.log(dataJson);
 console.log(" Title: " + dataJson.results[0].title);
 console.log(" Release Date: " + dataJson.results[0].release_date);
 console.log(" Overview: " + dataJson.results[0].overview);
 var html='<p><img src="https://image.tmdb.org/t/p/w500' +dataJson.results[0].poster_path +'" > </p><p>Title: ' + dataJson.results[0].title + '</p><p>Release Date: ' + dataJson.results[0].release_date + '</p><p>Overview: ' + dataJson.results[0].overview +
 '</p>';
 $('.js-search-results').removeClass('invisible');
 $('.js-search-results').html(html);


}
