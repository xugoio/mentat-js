
MentatJS.declare("ContactViewController", function () {

    ContactViewController = MentatJS.ViewController.extend({


        selectedItem: null,

        viewForViewController: function () {
            return new ContactView();
        },


        viewWasPresented: function () {

            var reg = /.+?\:\/\/.+?(\/.+?)(?:#|\?|$)/;
            var pathname = reg.exec( window.location.href )[0];
            var uri = pathname.substr(0,pathname.lastIndexOf('/')) + '/ContactView.html';

            this.view.layout.loadLayoutWithDelegate(uri, this);


        },


        layoutWasLoadedSuccessfully: function (forView) {

            forView.contactImage = MentatJS.Image.imageFromLayout(forView,'contactImage','contactImage');

            forView.contactImage.imageWidth = 48;
            forView.contactImage.imageHeight = 48;

            forView.contactName = MentatJS.Label.labelFromLayout(forView,'contactName','contactName');
            forView.contactJobTitle = MentatJS.Label.labelFromLayout(forView,'contactJobTitle','contactJobTitle');
            forView.contactCompany = MentatJS.Label.labelFromLayout(forView,'contactCompany','contactCompany');


            if (this.selectedItem!=null) {

                forView.contactImage.setImageURI( this.selectedItem.avatar);
                forView.contactName.setText(this.selectedItem.fullName);
                forView.contactJobTitle.setText(this.selectedItem.jobTitle);
                forView.contactCompany.setText(this.selectedItem.company);
            }

        }



    });


});