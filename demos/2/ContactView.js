
MentatJS.declare("ContactView", function () {
    
    ContactView = MentatJS.View.extend({

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

            this.layout = new MentatJS.View();
            this.layout.boundsForView = function (parentBounds, oldBounds) {
                return {
                    x: parentBounds.width / 2 - 300 / 2,
                    y: 10,
                    width: 300,
                    height: 200,
                    unit: 'px',
                    position: 'absolute'
                };
            }
            this.layout.initView(this.id+".layout");
            this.attach(this.layout);

        }

    });


});