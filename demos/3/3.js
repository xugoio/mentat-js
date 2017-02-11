
var _myApp = null;

window.onload = function () {
    _myApp = new MyApp();
    _myApp.launch();
}



MyApp = MentatJS.Application.extend ({

    applicationWillStart : function () {
        this.navigationController.loadViewController(
            { class: 'MainViewController', id: 'MainViewController' },
            [
                { id: 'MainView', uri:'MainView.js'},
                { id : "MainViewController", uri:'MainViewController.js'}
            ], this);

    },

    viewControllerWasLoadedSuccessfully : function (vc) {
        this.navigationController.present(vc, {animated: false});
    }

});
