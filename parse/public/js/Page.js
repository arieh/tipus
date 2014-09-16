var Page = {
    types : {},
    show : function (view) {
        if (this.active_el) {
            el[0].removeChild(this.active_el);
        }

        this.active_el = view.$el[0];
        el.append(this.active_el);
    }
};

var el = $('section.main');