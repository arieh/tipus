var Class = Backbone.View.extend({
    initialize : function(){
        this.elements = {};
        this.elements.table = new Class.List;
        this.elements.add = $('<button role="button" class="btn" data-toggle="modal" data-target=".classes-add-form">הוסף מקצה</a>');
        this.element = $('<div class="page">');
        this.elements.form = $('.classes-add-form');
        this.element.append(this.elements.add, this.elements.table, this.elements.form);
        this.$el.append(this.element);
    },

    events : {
        'click form .btn-primary' : 'submit'
    },
    show : function(){
        this.element.css('display', 'block');
    },
    hide : function(){
        this.element.css('display','none');
    },
    submit : function(){
        var name = this.elements.form.$('[name=name]').val();

        var model = new Data.types.classes;
        model.set('name', name);
        model.save();
    }
});

Class.List = Backbone.View.extend({
    initialize : function(){
        this.$el = $('ol');
        this.createList();
    },
    createList : function(){
        Data.collections.classes.models.forEach(function(instance){
            var li = $('<li>',{
                html : instance.attributes.name,
                'data-id' : instance.id
            });
        }.bind(this));
    }
});