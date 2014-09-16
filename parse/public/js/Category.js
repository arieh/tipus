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

        if (this.model.get('started')) {
            this.generateStages();
            return;
        }

        this.elements.button.on('click', this.start.bind(this));

        $('nav', this.$el).append(this.elements.button);
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

    generateStages : function(){
        var perliminary = $('<button></button>',{
                html : dictionary.Category.perliminary,
                'class' : 'perliminary'
            }),
            nav = this.$('nav'),
            semi_count = this.model.get('semi_finals_count'),
            finals_count = this.model.get('finals_count');

        nav.append(perliminary);

        function generate(name) {
            var button = $("<button></button>",{
                html : dictionary.Category[name],
                'class' : name
            });

            name[0] = name[0].toUpperCase();
            var fn = this['open'+name] || function(){
                console.log(name);
            };
            button.on('click', fn.bind(this));
            nav.append(button);
        }

        perliminary.on('click', this.openPerliminary.bind(this));

        if (!semi_count) return;
        if (semi_count == 1) {
            generate('semi');
        }else {
            generate('semi1');
            generate('semi2');
        }

        if (!finals_count) return;
        if (finals_count == 1) {
            generate('final');
        }else {
            generate('final1');
            generate('final2');
        }
    },
    openPerliminary : function(){
        if (this.stage) {
            Page.show(this.stage);
            return;
        }

        this.stage = new Stage.Perliminary({category:this.model});

        Page.show(this.stage);
    }
});

var CategoryList = Views.List.extend({
    default_data : {
        finals_climbers : 5,
        semi_finals_climbers : 10
    },
    type : 'Category',
    subView : Category
});