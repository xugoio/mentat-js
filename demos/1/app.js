
var _myApp = null;

window.onload = function () {
    _myApp = new MyApp();
    _myApp.launch();
}



MyApp = MentatJS.Application.extend ({

    applicationWillStart : function () {
        this.navigationController.loadViewController('MyViewController',
        [
            { id: 'MyView', uri:'myView.js'},
            { id : "MyViewController", uri:'myViewController.js'}
        ], this);

    },

    viewControllerWasLoadedSuccessfully : function (vc) {
        this.navigationController.present(vc, {animated: false});
    }

});
