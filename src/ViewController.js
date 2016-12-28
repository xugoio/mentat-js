




MentatJS.ViewController = Class.extend({

    id : '',
    view : null,
    navigationController : null,

    initViewController : function (_id) {
        this.id = _id;
        this.view = this.viewForViewController();
        this.view.viewController = this;
        this.view.navigationController = this.navigationController;
        this.view.initView(this.id + ".view");
    },

    viewControllerDidLoad : function () {

    },

    viewControllerWillBeDestroyed : function () {

    },


    viewForViewController : function  () {
        var v = new MentatJS.View();
        v.boundsForView = function (parentBounds,oldBounds) {
            return parentBounds;
        };
        return v;
    },


    viewWillBePresented : function (parentBounds) {

    },


    viewWasPresented : function() {

    }


});