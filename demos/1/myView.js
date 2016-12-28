

MentatJS.declare ( 'MyView', function() {


    MyView = MentatJS.View.extend ({

        boundsForView : function (parentBounds, oldBounds) {
            return {
                x: 0,
                y: 0,
                width: parentBounds.width,
                height: parentBounds.height,
                unit: 'px',
                position: 'absolute'
            };
        },

        viewWillLoad : function () {

            this.hello = new MentatJS.Label();
            this.hello.boundsForView = function (parentBounds,oldBounds) {
                return {
                    x: 10,
                    y: parentBounds.height / 2 - 10,
                    width: parentBounds.width - 20,
                    height: 11,
                    unit: 'px',
                    position: 'absolute'
                };
            }
            this.hello.text = 'HELLO WORLD!';
            this.hello.textAlignment = 'center';
            this.hello.fontWeight = 300;
            this.hello.fontSize = 24;
            this.hello.initView(this.id + '.labelHello');

        },

        viewWasAttached : function () {
            this.attach(this.hello);
        }



    });


});