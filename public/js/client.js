

$(function() {
  $('.response').hide();
  $('.menu .item').tab();


  $('.js-signup-form').submit(function (e) {
        e.preventDefault();
    const signUpData = {
      username: $('.js-signup-username').val(),
      password: $('.js-signup-password').val(),
      firstName: $('.js-signup-firstname').val(),
      lastName: $('.js-signup-lastname').val(),
    };
      $.ajax({
  url: '/users',
  type : 'POST',
  data: signUpData
})
.done(function(data) {
  $('.menu .item').tab('change tab', 'log-in');
  $('.response').show();
  $('.response').html('<p>' + data.message + '</p>');

})
.fail(function(error) {
  $('.response').show();
  $('.response').html('<p>' + error.responseJSON.message + '</p>');
  $('.js-signup-password').val('');
})
 });


$('.js-login-form').submit(function (e) {
      e.preventDefault();
    const loginData = {
      username: $('.js-login-username').val(),
      password: $('.js-login-password').val()
    };
      $.ajax({
  url: '/users/me',
  type : 'POST',
  data: loginData
})
.done(function(data) {
  if(data.granted === true) {
    window.location = data.redirectTo;
  }
})
.fail(function(error) {
  console.log(error);
  if(error.responseText === "error") {
    $('.response').show();
    $('.response').html('<p>' + "User not found. Please sign-up!" + '</p>');
  }
  if(error.responseText === "Unauthorized") {
    $('.response').show();
    $('.response').html('<p>' + "Username or Password incorrect !!" + '</p>');
  }
  if(error.responseText === "Bad Request") {
    $('.response').show();
    $('.response').html('<p>' + "Please enter the details." + '</p>');
  }
})

 });

 });


