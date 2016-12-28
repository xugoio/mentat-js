

MentatJS.declare ( 'MyView', function() {
    "use strict";

    class MyView extends MentatJS.View {

        boundsForView (parentBounds, oldBounds) {
            return {
                x: 0,
                y: 0,
                width: parentBounds.width,
                height: parentBounds.height,
                unit: 'px',
                position: 'absolute'
            };
        }

        viewWillLoad () {

            this.hello = new MentatJS.Label();
            this.hello.boundsForView = function () {
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
            this.hello.initView(this.id + '.labelHello');

        }

        viewWasAttached () {
            this.attach(this.hello);
        }



    };


});