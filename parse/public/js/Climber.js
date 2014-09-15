var Climber = Backbone.View.extend({
    templates : {
        main : _.template('<tr>\
            <td><input name="name" value="<%=name%>"/></td>\
            <td><input name="id_num" value="<%=id_num%>"/></td>\
            <td><input name="email" value="<%=email%>"/></td>\
            <td><input name="age" value="<%=age%>"/></td>\
            <td class="cat"></td>\
            </tr>')
    },
    events : {
        'keyup input' : 'valueChange'
    },
    initialize : function() {
        this.render();
        this.select = new Views.SelectView({
            collection : Data.collections.Category,
            el : this.$('.cat')
        });

        this.select.on('change', this.selectChange.bind(this));
    },
    render : function(){
        var data = _.clone(this.model.attributes);

        Object.keys(dictionary.Climber).forEach(function(key){
            if (!( key in data)) data[key]='';
        });

        this.$el = $(this.templates.main(data));
    },
    valueChange : function(e){
        var input = $(e.target),
            value = input.val(),
            prop = input.attr('name');

        this.model.set(prop, value).save();
    },
    selectChange : function(cat) {
        this.model.set('category', cat).save();
    }
});


var ClimberList = Views.List.extend({
    templates : {
        main :  _.template(
                    "<secion class='page climber'><header></header>\
                        <table class='tabel'><thead>\
                        <th><%=name%></th><th><%=id_num%></th><th><%=email%></th><th><%=age%></th><th><%=cat%></th>\
                        </thead><tbody class='list'></tbody></table>\
                     </section>"
               )
    },


    default_data : {
        id_num : 0,
        score : 0
    },
    type : 'Climber',
    subView : Climber,

    initialize : function(){
        ClimberList.__super__.initialize.apply(this, arguments);
        this.select = new Views.SelectView({
            collection : Data.collections.Category,
            el : $('.cat', this.elements.form)
        });
    },

    getTemplateData : function(){
        var data = _.clone(dictionary.Climber);

        return data;
    },

    getData : function(){
        var data = ClimberList.__super__.getData.apply(this);
        data.category = this.select.val();
    }
});