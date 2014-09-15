
Parse.initialize("SQa6ZzYOcMMIO9uDvvkcxUksxcoBztIbvBgiHZVt", "WVrICdMNw7S96fY1FSxYwxUQq24ucMcw5YpyWm1i");

$('form.login').modal('show');

$('form.login').on('submit', function(){
    var name = $('.login .user').val(),
        pass = $('.login .pass').val();

    var user = Parse.User.logIn(name, pass, {
        success : init
    });
});

function init(){
    $('form.login').remove();

    Data.fetchAll(function(){
        showApp();
    });
}

function showApp(){
    $('.app').css('display','block');
}