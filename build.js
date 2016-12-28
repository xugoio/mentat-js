var UglifyJS = require("uglify-js");

var files =
    [
        'src/base.js',
        'src/Application.js',
        'src/View.js',
        'src/ViewController.js',
        'src/NavigationController.js',
        'src/Easing.js',
        'src/Animation.js',
        'src/components/Tints.js',
        'src/components/Label.js',
        'src/components/Button.js'
    ];

var result = UglifyJS ( files,
    {
        outSourceMap: "mentat.js.map",
        outFileName: "mentat.min.js"

    }
);



