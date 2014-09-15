var nav = $('nav.main');

var Nav = {
    classes : {
        Category : CategoryList,
        Climber : ClimberList
    },
    attach : function(){
        nav.on('click', function(e){
            var type = e.target.getAttribute('data-class'),
                cls = this.classes[type];

            if (!this[type]) {
                this[type] = new this.classes[type]();
            }

            Page.show(this[type]);

        }.bind(this));
    }
};

Nav.attach();