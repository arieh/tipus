var Category = Backbone.View.extend({
    model : Data.models.Category,
    template : _.template("<li><header><h3><%=name%></h3></header><nav></nav></li>"),
    initialize : function(){
        this.render();
    },
    render : function(){
        this.$el = $('<section class="category"></section>');
        this.$el.html(this.template(this.model.attributes));

        this.elements = {
            button : $('<button></button>', {
                html:dictionary.Category.start,
                'class' : 'button'
            })
        };

        this.generateStages();
    },
    start : function(){
        this.model.set('started', true).save();
        this.elements.button.hide();
        this.generateStages();
        this.openPerliminary();
    },

    events : {
        'click .perliminary' : 'openPerliminary',
        'click .semi' : 'openSemi',
        'click .semi1' : 'openSemi1',
        'click .semi2' : 'openSemi2',
        'click .final' : 'openFinal',
        'click .final1' : 'openFinal1',
        'click .final2' : 'openFinal2'
    },

    generate : function generate(name) {
        var button = $("<button></button>",{
            html : dictionary.Category[name],
            'class' : name
        });

        var nav = this.$('nav');

        name = name[0].toUpperCase() + name.substr(1);
        var fn = this['open'+name] || function(){
            console.log(name);
        };
        button.on('click', fn.bind(this));
        nav.append(button);
    },

    generateSemiButtons : function(){
        if (this.model.get('finals_climbers') == 0) {
            this.generate('final');
        }else if (this.model.get('semi_final_count') == 2) {
            this.generate('semi1');
            this.generate('semi2');
        }else {
            this.generate('semi');
        }
    },

    generateFinalButtons : function(){
        if (this.model.get('semi_final_count') == 2) {
            this.generate('final1');
            this.generate('final2');
        }else {
            this.generate('final');
        }
    },

    generateStages : function(){
        this.generate('perliminary');
        this.generateSemiButtons();

        if (this.model.get('finals_climbers') == 0) return;
        this.generateFinalButtons();

    },
    openPerliminary : function(){
        if (this.stage) {
            Page.show(this.stage);
            return;
        }

        this.stage = new Stage.Perliminary({category:this.model, title : this.model.get('name')});

        Page.show(this.stage);
    },
    openSemi : function(semi1){
        var start = 0,
            end = this.model.get('semi_finals_climbers'),
            title_prop = this.model.get('finals_climbers') == 0 ?
                'final' : semi1 ?
                'semi1' : 'semi',
            title = dictionary.Category[title_prop] + ' : ' + this.model.get('name');

        Page.show(new Stage.SemiFinals({start:start, end:end, title:title, category:this.model}));
    },

    openSemi1 : function(){
        return this.openSemi(true);
    },

    openSemi2 : function(){
        var start = this.model.get('semi_finals_climbers') + 1,
            end = start *2,
            title = dictionary.Category.semi2 + ' : ' + this.model.get('name');

        Page.show(new Stage.SemiFinals({start:start, end:end, title:title, category:this.model}));
    },

    openFinal : function(final1){
        var start = 0,
            end = this.model.get('finals_climbers'),
            title = dictionary.Category[final1 ? 'final1' : 'final'] + ' : ' + this.model.get('name');

        if (this.model.get('finals_climbers') == 0) {
            this.openSemi();
            return;
        }

        Page.show(new Stage.Finals({start:start, end:end, title:title, category:this.model}));
    },

    openFinal1 : function(){
        return this.openFinal(true);
    },

    openFinal2 : function(){
        var start = this.model.get('finals_climbers') + 1,
            end = start *2,
            title = dictionary.Category.final2 + ' : ' + this.model.get('name');

        Page.show(new Stage.SemiFinals({start:start, end:end, title:title, category:this.model}));
    },

});

var CategoryList = Views.List.extend({
    default_data : {
        finals_climbers : 5,
        semi_finals_climbers : 10
    },
    type : 'Category',
    subView : Category
});