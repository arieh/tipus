var Page = {
    types : {},
    show : function (type) {
        this.types[type].show();
    }
};

var el = $('section.main');