var UglifyJS = require("uglify-js");
var fs = require('fs');
var core_list = [
//        "parse/public/bower_components/jquery/dist/jquery.js",
        "parse/public/bower_components/underscore/underscore.js",
        "parse/public/bower_components/backbone/backbone.js",
        "parse/public/bootstrap/js/bootstrap.js"
    ],
    main_list = [
        "parse/public/js/Data.js",
        "parse/public/js/Names.js",
        "parse/public/js/Page.js",
        "parse/public/js/Stage.js",
        "parse/public/js/Views.js",
        "parse/public/js/Category.js",
        "parse/public/js/Climber.js",
        "parse/public/js/Nav.js",
        "parse/public/js/main.js"
    ];

function minify(list, name, next){
    var results = UglifyJS.minify(list);
    console.log("Writing " + name + " file");
    fs.open('parse/public/js/'+name+'.js', 'a+', function(){
        fs.writeFile('parse/public/js/'+name+'.js',results.code);
        next && next();
    });

}

minify(core_list,'min.core', function(){
    minify(main_list,'min');
});