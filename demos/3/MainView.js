


MentatJS.declare("MainView", function () {

    MainView = MentatJS.View.extend({

        boundsForView: function (parentBounds, oldBounds) {
            return {
                x: 0,
                y: 0,
                width: parentBounds.width,
                height: parentBounds.height,
                unit: 'px',
                position: 'absolute'
            };
        },

        viewWasAttached: function () {


            this.table = new MentatJS.TableView();



            this.table.boundsForView = function (parentBounds, oldBounds) {
                return {
                    x: 0,
                    y: 0,
                    width: 300,//parentBounds.width,
                    height: 400,//parentBounds.height,
                    unit: 'px',
                    position: 'absolute'
                };
            };
            this.table.initView(this.id + ".table");
            this.attach(this.table);



        }


    });

});