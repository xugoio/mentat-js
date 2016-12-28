
var _myApp = null;

window.onload = function () {
    _myApp = new MyApp();
    _myApp.launch();
}



class MyApp extends MentatJS.Application {

    applicationWillStart () {
        this.navigationController.loadViewController('MyViewController',
        [
            { id: 'MyView', uri:'myView.js'},
            { id : "MyViewController", uri:'myViewController.js'}
        ], this);

    }

    viewControllerWasLoadedSuccessfully (vc) {
        this.navigationController.present(vc, {animated: false});
    }

};
