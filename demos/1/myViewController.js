MentatJS.declare ("MyViewController", function () {


    MyViewController = MentatJS.ViewController.extend ({

        viewForViewController () {
            return new MyView();
        }

        
    });


});