var Stage = {};

Stage.Query = function(category, cb){

    var query = new Parse.Query('Climber');

    query.equalTo('category', category);
    query.find().then(cb);
};

Stage.Perliminary = Backbone.View.extend({

    templates : {
        main : _.template("<table class=\"table\"><thead><tr><th><%= id_num %></th><th><%= name %></th><%= routes %><th><%= score %></th></tr></thead><tbody></tbody></table>"),
        route_header : _.template("<th class='route'>" + dictionary.Climber.route + " <%= num %></th>"),
        climber : _.template("<td><%= id_num %></td><td><%= name %></td><%= routes %><td class='score'><%=perliminary_score%></td>"),
        climber_route : _.template('<td class="route"><input data-index="<%=num%>" data-climber="<%=climber%>" value="<%=value%>" /></td>')
    },

    events : {
        'keyup .route input' : 'routeChange'
    },

    initialize : function(args){
        this.category = args.category;
        this.route_num = args.route_number || 5;
        
        this.routes = [];
        this.climbers = {};
        this.scores = {};

        for (i=0; i<this.route_num; i++) {
            this.routes[i] = {climbers:{}, ranked :[]};
        }

        this.render();

        Stage.Query(this.category, this.populate.bind(this));
    },

    render : function(){
        var i;

        var tr = $('<tr>');
        var html = '';

        for (i=0; i< this.route_num; i++) {
            html+= this.templates.route_header({num:i+1});
        }

        var data = _.clone(dictionary.Climber);
        data.routes = html;

        this.$el = $(this.templates.main(data));
        this.el = this.$el[0];
    },

    populate : function(models){
        this.models = Stage.PerliminarySort(models);

        this.models.forEach(this.createItem.bind(this));

        this.routes.forEach(function(route, index){
            this.rankRoute(index);
        }.bind(this));

        for (var id in this.climbers) {
            this.updateClimberScore(id);
        }
    },

    createItem : function(model,index) {
        var el = $('<tr></tr>',{
            'data-index' : index,
            'data-id' : model.id
        });

        var routes_html = '';
        var routes = model.get('routes') || [];

        for (var i=0; i< this.route_num; i++) {
            routes_html+=this.templates.climber_route({num:i,climber:model.id, value:routes[i] || ''});

            this.routes[i].climbers[model.id] = {score:routes[i] || '', rank:0};
            this.routes[i].ranked.push(model.id);
        }

        var data = _.clone(model.attributes);
        data.routes = routes_html;

        if (!data.perliminary_score) {
            data.perliminary_score = data.score || 0;
        }

        el.html(this.templates.climber(data));

        this.climbers[model.id] = model;

        this.$('tbody').append(el);
    },

    routeChange : function(e){
        var el = $(e.target),
            id= el.attr('data-climber'),
            climber = this.climbers[id],
            route_num = el.attr('data-index'),
            route = this.routes[route_num];

        route.climbers[id].score = el.val();

        var routes = climber.get('routes') || new Array(this.route_num);

        routes[route_num] = el.val();

        climber.set('routes', routes).save();

        this.rankRoute(route_num);

        for (id in this.climbers) {
            this.updateClimberScore(id);
        }
    },
    rankRoute : function(route_num) {
        var route = this.routes[route_num],
            climbers = route.climbers,
            i, id, first = 0, next;

        function add(num) {
            return num * ((num+1)/2);
        }

        function updateRank(first, last) {
            var score = add(last) - add(first-1);
            var id;

            score = score / (last - first +1);

            for (var i=first-1; i <= last-1; i++){
                id = route.ranked[i];
                climbers[id].rank = score;
            }
        }

        route.ranked = route.ranked.sort(function(c_id, n_id){
            var current = climbers[c_id].score || 0,
                next = climbers[n_id].score || 0;

            if (current > next) return -1;
            if (next > current) return 1;
            return 0;
        });

        for (i=0; id = route.ranked[i]; i++) {
            climber = route.climbers[id];
            next = route.climbers[route.ranked[i+1]];
            if (!next) {
                updateRank(first+1, i+1);
            }else if (next.score != climber.score) {
                updateRank(first+1, i+1);
                first = i+1;
            }
        }

        for (id in this.climbers) {
            if (!this.scores[id]) this.scores[id] = new Array(this.route_num);
            this.scores[id][route_num]= climbers[id].rank;
        }
    },
    updateClimberScore : function(id) {
        var score_el = this.$('[data-id='+id+'] .score'),
            climber = this.climbers[id],
            score;

        function genMin(arr) {
            var sum = 1;

            arr.forEach(function(num){
                sum *= (num || 0);
            });

            return Math.pow(sum, 1/arr.length);
        }

        score = genMin(this.scores[id]);
        score = +(parseFloat(score).toFixed(3));
        climber.set('perliminary_score',score);
        climber.save();
        score_el.html(score);
    }
});

Stage.PerliminarySort = function(models, min, max) {
    var models = _.clone(models).sort(function(current, next) {
        var current = current.attributes.perliminary_score || 0,
            next = next.attributes.perliminary_score || 0;

        return current - next;
    });

    return models.slice(min, max);
};



Stage.SemiFinals = Backbone.View.extend({
    templates : {
        main : _.template("<h1><%=title%></h1><table class=\"table\"><thead><tr><th><%= id_num %></th><th><%= name %></th><th><%=score%></th><th><%=time%></th></tr></thead><tbody></tbody></table>"),
        climber : _.template('<td><%= id_num %></td><td><%= name %></td><td><input type="number"  name="score" data-climber="<%=climber%>" value="<%=score%>" /></td><td><input type="number" name="time" data-climber="<%=climber%>" value="<%=time%>" /></td><td class="score"><%=perliminary_score%></td>'),
    },

    dict_key : 'SemiFinals',

    score_attr : 'semi_score',
    time_attr : 'semi_time',

    defaults : {
        start : 0,
        end : 10,
        category : null
    },

    events : {
        'keyup [name=score]' : 'scoreChange',
        'keyup [name=time]' : 'timeChange'
    },

    initialize : function(){
        this.options = _.extend({}, this.defaults, this.options);

        this.models = {};

        this.render();
        Stage.Query(this.options.category, this.populate.bind(this));
    },
    render : function(){
        var data = _.clone(dictionary[this.dict_key]);

        data.title = data.title + ' : ' + this.options.name;

        this.$el = $(this.templates.main(dictionary.SemiFinals));
        this.el = this.$el[0];
    },
    populate : function(models) {
        var models = Stage.PerliminarySort(models, this.options.start, this.options.end);

        models.forEach(this.createItem.bind(this));
    },

    getData : function(model) {
        var data = _.clone(model.attributes);

        data.score = data[this.score_attr] || 0;
        data.time  = data[this.time_attr] || 0;
        data.climber = model.id;

        return data;
    },

    createItem : function(model) {
        var data = this.getData(model);

        this.models[model.id] = model;
        this.$el.append($(this.templates.climber(data)));
    },

    scoreChange : function(e) {
        var el = $(e.target),
            value = el.val(),
            id = el.attr('data-climber'),
            model = this.models[id];

        model.set(this.score_attr, value).save();
    },

    timeChange : function(e) {
        var el = $(e.target),
            value = el.val(),
            id = el.attr('data-climber'),
            model = this.models[id];

        model.set(this.time_attr, value).save();
    }
});