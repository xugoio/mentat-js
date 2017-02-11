var fs = require('fs');


var files =
    [
        'src/base.js',
        'src/Utils.js',
        'src/Application.js',
        'src/DataSource.js',
        'src/DownloadData.js',
        'src/View.js',
        'src/ViewController.js',
        'src/NavigationController.js',
        'src/Easing.js',
        'src/Animation.js',
        'src/CollectionView.js',
        'src/components/Tints.js',
        'src/components/Label.js',
        'src/components/Button.js',
        'src/components/TextField.js',
        'src/components/Dropdown.js',
        'src/components/Image.js',
        'src/components/SegmentedButton.js',
        'src/components/ToggleButton.js',
        'src/components/ListView.js',
        'src/components/Popover.js',
        'src/components/DropdownSearch.js',
        'src/components/TableView.js'
    ];


function print_error ( str ) {
        "use strict";
        console.log(str);
};

try {
        var output = "";
        for (var i = 0; i < files.length; i++) {
                var contents = fs.readFileSync(files[i], 'utf8');
                output = output + contents;



        }

        fs.writeFileSync('mentat.min.js',output);

} catch ( ex ) {

                        print_error("Parse error at " + ex.filename + ":" + ex.line + "," + ex.col);
                        print_error(ex.message);
                        print_error(ex.stack);
                        process.exit(1);

                throw ex;
}




