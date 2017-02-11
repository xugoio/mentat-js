
MentatJS.declare("MainViewController", function () {


    MainViewController = MentatJS.ViewController.extend({

        jsonData: null,
        contentNavigationController: null,
        menuDataSource: null,

        viewForViewController: function () {
            return new MainView();
        },

        viewWasPresented: function () {

            this.contentNavigationController = new MentatJS.NavigationController();
            this.contentNavigationController.initNavigationControllerWithRootView(this.id+".view.content.nav",this.view.content);

            this.view.search.setActionDelegate(this, 'onSearch');

            this.view.list.setActionDelegate(this, 'onSelectionChanged');


            this.menuDataSource = new MentatJS.DataSource();
            this.menuDataSource.arrayPath = function (json) {
                return json.rows;
            };
            this.menuDataSource.idForObject = function (item) {
                return item.id;
            };
            this.menuDataSource.sortFieldForObject =  function (item) {
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
                this.menuDataSource.initWithDataString(data);
                this.view.list.DataSource = this.menuDataSource;
                this.view.list.reloadData();
            }

        },

        couldNotDownload: function (dataID) {
            window.alert("JSON files are not supported by your web server.");
        },

        onSearch: function (sender, value) {
            this.menuDataSource.initWithDataString(this.jsonData);

            if (value!="") {

                this.menuDataSource.applyFilter(value, function (value,item) {

                    if (item.fullName.toUpperCase().indexOf(value.toUpperCase())>-1)
                        return true;
                    if (item.jobTitle.toUpperCase().indexOf(value.toUpperCase())>-1)
                        return true;
                    if (item.company.toUpperCase().indexOf(value.toUpperCase())>-1)
                        return true;


                    return false;
                });
            }
            this.view.list.reloadData();
        },


        onSelectionChanged: function (sender) {
            var id = 'ContactViewController';
            var selection = this.view.list.GetSelectedObjects();
            if (selection!=null) {
                if (selection.length==0) {

                    this.contentNavigationController.clear();
                    return;
                }

                id = id + '_' + selection[0].id;

                this.contentNavigationController.loadViewController(
                        {class: 'ContactViewController', id: id},
                        [
                            {id: 'ContactView', uri: 'ContactView.js'},
                            {id: "ContactViewController", uri: 'ContactViewController.js'}], this);



            }


        },

        viewControllerWasLoadedSuccessfully: function (vc) {
            vc.selectedItem = null;
            var selection = this.view.list.GetSelectedObjects();
            if (selection!=null) {
                vc.selectedItem = selection[0];
            }
            this.contentNavigationController.present(vc, {animated:false});

        }

        
    });



});