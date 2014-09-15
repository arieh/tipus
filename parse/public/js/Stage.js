var Stage = {};

Stage.Perliminary = Backbone.View.extend({

    templates : {
        main : _.template("<thead><tr><th><%= id_num %></th><th><%= name %></th><%= routes %><th><%= score %></th></tr></thead><tbody></tbody>"),
        route_header : _.template("<th class='route'>" + dictionary.climber.route + " <%= num %></th>"),
        climber : _.template("<td><%= id_num %></td><td><%= name %></td><%= routes %><td class='score'><%=score%></td>"),
        climber_route : _.template('<td class="route"><input data-index="<%=num%>" data-climber="<%=climber%>" value="<%=value%>" /></td>')
    },

    events : {
        'keyup .route input' : 'routeChange'
    },

    initialize : function(args){
        this.category = args.category;
        this.route_num = args.route_number;
        
        this.routes = [];
        this.climbers = {};
        this.scores = {};
        
        for (i=0; i<this.route_num; i++) {
            this.routes[i] = {climbers:{}, ranked :[]};
        }

        this.render();

        this.query = new Parse.Query('Climber');
        this.query.equalTo('category', this.category);
        this.query.find().then(this.populate.bind(this));
    },

    render : function(){
        this.$el = $('<table class="table"></table>');

        var tr = $('<tr>');
        var html = '';

        for (i=0; i< this.route_num; i++) {
            html+= this.templates.route_header({num:i+1});
        }

        var data = _.clone(dictionary.climber);
        data.routes = html;

        this.$el.html(this.templates.main(data));
    },

    populate : function(models){
        this.models = models;
        models.forEach(this.createItem.bind(this));

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

            this.routes[i].climbers[model.id] = {score:routes[i], rank:i};
            this.routes[i].ranked.push(model.id);
        }

        var data = _.clone(model.attributes);
        data.routes = routes_html;

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
            i, id, first =0;

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

        route.ranked.sort(function(c_id, n_id){
            return climbers[c_id].score < climbers[n_id].score;
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

        climber.set('score',score);
        climber.save();
        score_el.html(score);
    }
});