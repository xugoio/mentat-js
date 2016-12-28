MentatJS.Application = Class.extend ({

    navigationController : null,
    notifications : [],
    appName : '',
    rootView : null,
    downloadStack : null,
    downloadCache : null,
    

    resetNotification : function ()  {
        this.notifications = new Array();
    },


    wipeAndReload : function () {
        window.location.href = '/';
        return;
    },


    launch : function  () {
        this.navigationController = null;
        this.appName = "";
        this.rootView = null;
        this.notifications = new Array();
        this.downloadStack = new Array();
        this.downloadCache = new Array();

        this.navigationControllerDeclaration = MentatJS.NavigationController.extend({
            willInit () {

            }
        });


        // desktop
        this.viewDeclaration = MentatJS.View.extend({

            boundsForView (parentBounds,oldBounds) {
                var bounds =
                {
                    x : 0,
                    y : 0,
                    width : document.documentElement.clientWidth,
                    height : document.documentElement.clientHeight,
                    unit : 'px',
                    position: 'absolute'
                }

                var bd = BrowsingDevice();
                if (bd.mobile!=0) {
                    bounds.width = document.documentElement.clientWidth;
                    bounds.height = document.documentElement.clientHeight;
                }

                return bounds;

            }

        });
        this.navigationController = new this.navigationControllerDeclaration();
        this.rootView = new this.viewDeclaration();
        this.navigationController.initNavigationControllerWithRootView('UINavigationController.instance',this.rootView);
        this.navigationController.rootView.initView('rootView');
        this.navigationController.rootView.doResize();
        document.getElementsByTagName('body')[0].appendChild(this.navigationController.rootView.getDiv());
        MentatJS.Application.instance = this;
        this.applicationWillStart();
    },

    applicationWillStart : function () {
        throw 'Application.applicationWillStart must be overridden.';
    },

    deregisterForNotification : function (notification,obj_id) {
        var idx = -1;
        console.log('-REG ' + obj_id + '.' + notification);
        for (var i = 0; i < this.notifications.length; i++) {
            if (this.notifications[i].notification == notification && this.notifications[i].target.id == obj_id)
                var idx = i;
        }
        if (idx > -1) {
            this.notifications.splice(idx, 1);
        }
    },


    registerForNotification : function (notification, obj) {
        var not = { notification: notification, target: obj};
        console.log ('+REG ' + obj.id + '.' + notification);
        this.notifications.push(not);
    },

    notifyAll : function (sender,notification,param) {
        console.log('+EV ' + notification);
        for (var i = 0; i < this.notifications.length; i++) {
            if (this.notifications[i].notification == notification) {
                console.log('    calling ' + this.notifications[i].target.id + "." + notification);
                this.notifications[i].target[notification](sender,param);
            }
        }
    }



});

