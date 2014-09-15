
Parse.initialize("SQa6ZzYOcMMIO9uDvvkcxUksxcoBztIbvBgiHZVt", "WVrICdMNw7S96fY1FSxYwxUQq24ucMcw5YpyWm1i");

//$('form.login').modal('show');

$('form.login .submit').on('click', function(){
    var name = $('.login .user').val(),
        pass = $('.login .pass').val();

    var user = Parse.User.logIn(name, pass, {
        success : init
    });
});

init();

function init(){
    $('form.login').remove();

	$('form.add-user-form').modal('show');

    Data.fetchAll(function(){
        /*var cat = Data.collections.Category.models[0];

        var per = new Stage.Perliminary({category:cat, route_number:4});
        $(document.body).append(per.$el);*/

        Page.show(new CategoryList());
    });
}

function showApp(){
    $('.app').css('display','block');


	var select1 = new Views.SelectView({
		$el: 'form.add-user-form select',
		model: Data.collections.Category.models
	});
	select1.on('change')

	$('form.add-user-form .btn-primary').on('click', function(){

	})
}

init();
