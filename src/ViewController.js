




MentatJS.UIViewController = class {

    id = '';
    view = null;
    navigationController = null;

    initViewController (_id) {
        this.id = _id;
        this.view = this.viewForViewController();
        this.view.viewController = this;
        this.view.navigationController = this.navigationController;
        this.view.initView(this.id + ".view");
    }

    viewControllerDidLoad () {

    }
    viewControllerWillBeDestroyed () {

    }


    viewForViewController  () {
        var v = new MentatJS.View();
        v.boundsForView = function (parentBounds,oldBounds) {
            return parentBounds;
        };
        return v;
    }


    viewWillBePresented (parentBounds) {

    }


    viewWasPresented () {

    }


};