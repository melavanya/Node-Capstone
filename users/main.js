 $(function(){
   $('.menu .item').tab();
   validateEmail();

   $.ajax({
  url: '/users',
  dataType: 'json',
  data: {
    {
    "username":"foo",
    "password":"password",
    "firstName":"foo",
    "lastName":"bar"
    
  }
  }
})
.done(function(data) {
  console.log("success");
  console.log(data);
})
.fail(function() {
  console.log("error");
})
.always(function() {
  console.log("complete");
});

 });



function validateEmail(){
  $('.ui.form').form({
            fields: { email: { identifier  : 'email',rules: [ { type   : 'empty',
                                                                prompt : 'Please enter your e-mail'
                                                              },
                                                              {
                                                                type   : 'email',
                                                                prompt : 'Please enter a valid e-mail'
                                                              }
                                                            ] },
                            password: { identifier  : 'password',rules: [ { type   : 'empty',
                                                                            prompt : 'Please enter your password'
                                                                          },
                                                                          {
                                                                            type   : 'length[6]',
                                                                            prompt : 'Your password must be at least 6 characters'
                                                                          }
                                                                        ] } }
                        });

}
