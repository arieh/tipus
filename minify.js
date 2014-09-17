var UglifyJS = require("uglify-js");
var fs = require('fs');

var list =[
    "parse/public/js/Data.js",
    "parse/public/js/Names.js",
    "parse/public/js/Page.js",
    "parse/public/js/Stage.js",
    "parse/public/js/Views.js",
    "parse/public/js/Category.js",
    "parse/public/js/Climber.js",
    "parse/public/js/Nav.js",
    "parse/public/js/main.js"
]

var results = UglifyJS.minify(list);

console.log("Writing Minified file");
fs.open('parse/public/js/min.js', 'a+', function(){
    fs.writeFile('parse/public/js/min.js',results.code);
});