
MentatJS.declare("MainViewController", function () {


    MainViewController = MentatJS.ViewController.extend({

        jsonData: null,
        tableDataSource: null,

        viewForViewController: function () {
            return new MainView();
        },

        viewWasPresented: function () {

            this.view.table.setDelegate(this);

            this.tableDataSource = new MentatJS.DataSource();
            this.tableDataSource.arrayPath = function (json) {
                return json.rows;
            };
            this.tableDataSource.idForObject = function (item) {
                return item.id;
            };
            this.tableDataSource.sortFieldForObject =  function (item) {
                return item.lastName + ' ' + item.firstName;
            };


            var reg = /.+?\:\/\/.+?(\/.+?)(?:#|\?|$)/;
            var pathname = reg.exec( window.location.href )[0];
            var uri = pathname.substr(0,pathname.lastIndexOf('/')) + '/source.json';

            MentatJS.DownloadDataWithDelegate( "listSource", uri, this);

        },

        dataWasDownloaded: function (dataID, data) {
            if (dataID=="listSource") {
                this.jsonData = data;
                this.tableDataSource.initWithDataString(data);
                this.view.table.dataSource = this.tableDataSource;
                this.view.table.reload();
            }

        },

        couldNotDownload: function (dataID) {
            window.alert("JSON files are not supported by your web server.");
        },

        
        
        numberOfColumns: function (tableView) {
            "use strict";
            return 7;
        },
        titleForColumn: function (tableView,index) {
            "use strict";
            switch (index) {
                case 0: return "";
                case 1: return "Forename".toUpperCase();
                case 2: return "Surname".toUpperCase();
                case 3: return "Full Name".toUpperCase();
                case 4: return "Job Title".toUpperCase();
                case 5: return "Company".toUpperCase();
                case 6: return "Skill".toUpperCase();
            };
        },

        cellForPath: function (tableView, cell, path) {
            "use strict";
            var item = this.tableDataSource.objectForSortedIndex( path.row );
            if (item!==null) {
                var label = new MentatJS.Label();
                label.boundsForView = function (parentBounds) {
                    return MentatJS.fillParentBounds(parentBounds);
                };
                var text = "";
                switch (path.col) {
                    case 1: 
                        text = item.firstName;
                        break;
                    case 2:
                        text = item.lastName;
                        break;
                    case 3:
                        text = item.fullName;
                        break;
                    case 4:
                        text = item.jobTitle;
                        break;
                    case 5:
                        text = item.company;
                        break;
                    case 6:
                        text = item.skill;
                        break;
                }
                label.text = text;
                label.initView(cell.id + ".label");
                cell.attach(label);
            }
        }
        



    });



});