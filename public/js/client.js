$(function () {
  $('.response').hide();
  $('.menu .item').tab();

//Demo Account
$('.js-demo').click(function (e) {
 e.preventDefault();
 swal(
  'Demo Account Details:',
  'Username: test  and Password: 1234'
)
});

//Sign-up Form submission
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
            type: 'POST',
            data: signUpData
          })
          .done(function (data) {
            $(".js-signup-form").trigger("reset");
              swal({
                title: 'Welcome ' + data.message + '!!',
                text: 'Please Log-in to search for Movies!',
                width: 600,
                padding: 100,
                background: '#fff url(//bit.ly/1Nqn9HU)'
              })
              $('.response').hide();
              $('.menu .item').tab('change tab', 'log-in');
            })
          .fail(function (error) {
              $('.response').show();
              $('.response').html('<p>' + error.responseJSON.message + '</p>');
              $('.js-signup-password').val('');
            })
  });

//Log-in Form submission
  $('.js-login-form').submit(function (e) {
          e.preventDefault();
          const loginData = {
            username: $('.js-login-username').val(),
            password: $('.js-login-password').val()
          };
          $.ajax({
            url: '/users/me',
            type: 'POST',
            data: loginData
          })
            .done(function (data) {
            $('.response').hide();
              if (data.granted === true) {
                window.location = data.redirectTo;
              }
            })
            .fail(function (error) {
              console.log(error);
              if (error.responseText === "error") {
                $('.response').show();
                $('.response').html('<p>' + "User not found. Please sign-up!" + '</p>');
                $(".js-login-form").trigger("reset");
              }
              if (error.responseText === "Unauthorized") {
                $('.response').show();
                $('.response').html('<p>' + "Username or Password incorrect !!" + '</p>');
                $(".js-login-form").trigger("reset");
              }
              if (error.responseText === "Bad Request") {
                $('.response').show();
                $('.response').html('<p>' + "Please enter all the details." + '</p>');
              }
            })

  });


});//End of JQuery Line


