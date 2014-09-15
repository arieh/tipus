var CategoryList = Backbone.View.extend({
    templates : {
        main : _.template("<header></header><ul></ul>")
    },
    initialize : function(){
        this.cats = Data.collections.Category;
        this.cats.on('add', this.add.bind(this));
        this.render();

        this.cats.models.forEach(this.add.bind(this));
    },
    render : function() {
        this.$el = $('<secion class="page Category"></secion>');
        this.$el.html(this.templates.main);
        this.elements = {
            header : this.$('header'),
            list : this.$('ul'),
            button : $('<button></button>', {
                html : dictionary.Category.add,
                'class' : 'button'
            }),
            form : $('.category-add-form')
        };

        this.elements.header.append($('<h1></h1>', {html:Names.getPlural('Category')}));
        this.elements.header.append(this.elements.button);

        this.elements.button.on('click', function(){
            this.elements.form.modal('show');
        }.bind(this));

        $('.btn-primary', this.elements.form).on('click', this.create.bind(this));
    },

    create : function(){
        var data = {
            finals_climbers : 5,
            semi_finals_climbers : 10
        };
        this.elements.form.serializeArray().forEach(function(props){
            if (!props.value) return;
            if (typeof data[props.name] == 'number') {
                data[props.name] = +props.value;
                return;
            }
            data[props.name] = props.value;
        });

        Data.create('Category',data);
    },
    add : function(model) {
        if (!model.get('name')) return;

        var li = $('<li></li>'),
            cat = new Category({model : model});

        li.append(cat.$el);
        this.elements.list.append(li);
    }
});

var Category = Backbone.View.extend({
    model : Data.models.Category,
    template : _.template("<header><h3><%=name%></h3></header><nav></nav>"),
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
            nav.append($("<button></button>",{
                html : dictionary.Category[name],
                'class' : name
            }));
        }

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