var Data = {};
Data.types = ['Category','Climber','Stage'];
Data.models = {};
Data.collections = {};

Data.types.forEach(function(type){
    Data.models[type] = Parse.Object.extend(type, {
        initialize : function() {
            Data.collections[type].add(this);
        }
    });
    Data.collections[type] = new (Parse.Collection.extend({
        model : Data.models[type]
    }));
});

Data.fetchAll = function(cb){
    var i = 0,
        type;

    function fetch() {
        type = Data.types[i];
        i++;
        if (!type){
            cb();
            return;
        }

        Data.collections[type].fetch().then(fetch);
    }

    fetch();
};


Data.create = function(type, data) {
    var model = new Data.models[type](data);

    model.save();
};