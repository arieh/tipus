var nav = $('nav.main');

Data.types.forEach(function(type) {
    var btn = $('<button></button>', {
        className : 'btn btn-primary '+type,
        'data-type' : type,
        html : Names.getPlural(type)
    });
    nav.append(btn);
});

nav.on('click', 'button', function(){
    var type = this.getAttribute('data-type');

    Page.show(type);
});