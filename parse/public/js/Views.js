var Views = {
	SelectView: Backbone.View.extend({
		template: _.template($("#select-template").text()),
		initialize : function(args){
			this.collection = args.collection;
			this.models = args.collection.models;
			this.render(args);

			this.setCurrent(args.value || this.models[0].id);
		},
		render: function() {
			var parent = this.$el;

			this.$el = $(this.template({models:this.models}));
			this.el = this.$el[0];

			this.$el.on('change', this.optionsChange.bind(this));

			if (parent) parent.append(this.$el);
		},
		setCurrent : function(value){
			this.current && this.current.attr('current', '');

			this.current = this.$('[value='+value+']');
			this.current.attr('current','current');
			this.model = this.collection.filter(function(d){return d.id == value;})[0];
        },
		optionsChange : function(e) {
		    var id = e.target.value;

            this.setCurrent(id);

			this.trigger('change', this.val());
		},

		val : function(){
            return this.model;
		}
	}),
	List : Backbone.View.extend({
        templates : {
            main : _.template("<secion class='page <%=type%>'><header></header><ul class=list></ul></section>")
        },
        initialize : function(){
            this.collection = Data.collections[this.type];
            this.collection.on('add', this.add.bind(this));
            this.models = this.collection.models;
            this.sort();
            this.render();

            this.collection.models.forEach(this.add.bind(this));
        },
        getTemplateData : function(){
            return {
                type : this.type.toLowerCase()
            };
        },
        render : function() {
            this.$el = $(this.templates.main(this.getTemplateData()));
            this.elements = {
                header : this.$('header'),
                list : this.$('.list'),
                button : $('<button></button>', {
                    html : dictionary[this.type].add,
                    'class' : 'button'
                }),
                form : $('.' + this.type.toLowerCase() + '-add-form')
            };

            this.elements.header.append($('<h1></h1>', {html:Names.getPlural(this.type)}));
            this.elements.header.append(this.elements.button);

            this.elements.button.on('click', function(){
                this.elements.form.modal('show');
            }.bind(this));

            $('.btn-primary', this.elements.form).on('click', this.create.bind(this));
        },
        default_data : {},
        create : function(){
            var data = this.getData();
            Data.create(this.type,data);
        },

        getData : function(){
            var data = _.clone(this.default_data);
            this.elements.form.serializeArray().forEach(function(props){
                if (!props.value) return;
                if (typeof data[props.name] == 'number') {
                    data[props.name] = +props.value;
                    return;
                }
                data[props.name] = props.value;
            });
            return data;
        },

        add : function(model) {
             if (!model.get('name')) return;

             var cat = new this.subView({model : model});

             this.elements.list.append(cat.$el);
        },

        sort : function() {
            this.models.sort(function(current, next){
                return current.attributes.name < next.attributes.name;
            });
        }
    })
}