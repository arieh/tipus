var Page = {
    types : {},
    show : function (view) {
        if (this.active_el) {
            this.active_el.remove();
        }

        this.active_el = view.$el;
        el.append(this.active_el);
    }
};

var el = $('section.main');