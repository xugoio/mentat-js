MentatJS.NavigationController = Class.extend({

    id :  'UINavigationController.instance',
    rootView :  null,
    viewControllers : [],



    initNavigationControllerWithRootView : function (_id,_rootView) {
        this.id = _id;
        this.rootView = _rootView;
        this.viewControllers = new Array();
    },


    loadViewController : function ( vcID, arrayOfFilesToDownload, delegate ) {

        var downloadStack = {
            vcID: vcID,
            counter: arrayOfFilesToDownload.length,
            files: [],
            navigationController: this,
            delegate: delegate
        }
        var stackIndex = MentatJS.Application.instance.downloadStack.push(downloadStack);

        for ( var i = 0; i < arrayOfFilesToDownload.length; i++ ) {
            
            var downloadID = arrayOfFilesToDownload[i].id;

            if (!MentatJS.Application.instance.downloadCache.contains(downloadID)) {

                downloadStack.files.push(downloadID);

                MentatJS.LoadScript(downloadID, arrayOfFilesToDownload[i].uri);

            } else {
                downloadStack.counter--;
            }
        }
        if (downloadStack.counter==0) {
            this._initViewController(downloadStack);
        }
    },


    _initViewController : function (stack) {
        var newVC = null;
        eval('newVC = new ' + stack.vcID + "();");
        if (newVC==null) {
            throw new Error('could not instantiate VC ' + stack.vcID);
            return;
        } else {
            console.log('+VC: ' + stack.vcID);
        }
        newVC.navigationController = this;
        newVC.initViewController(stack.vcID);
        this.viewControllers.push(newVC);
        stack.delegate.viewControllerWasLoadedSuccessfully (newVC);
        stack = { vcID: '', counter: 0, files:[], delegate: null};
    },


    removeViewController : function (vcToRemove) {
        console.log('-VC '+ vcToRemove.id);

        if (vcToRemove.view!=null) {
            if (this.rootView!=null) {
                console.dir(vcToRemove.view);
                console.dir(this.rootView);
                this.rootView.detach(vcToRemove.view.id);
            }
        }
        if (vcToRemove.viewControllerWillBeDestroyed!=undefined) {
            vcToRemove.viewControllerWillBeDestroyed();
        }
        for ( var i = 0; i < this.viewControllers.length; i++) {
            if (this.viewControllers[i] == vcToRemove) {
                this.viewControllers.splice(i,1);
                i = 0;
            }
        }
    },


    present : function ( vc, options) {

        var opts = {
            animated: options.animated | false,
            direction: options.direction || 'left',
            duration: options.duration | 1300
        }
        // let the view prepare for the right bounds
        vc.viewWillBePresented(this.rootView.bounds);

        this.rootView.attach(vc.view);

        if (vc.viewWasAttached!=undefined) {
            vc.viewWasAttached();
        }

        if (opts.animated == false) {
            for (var i = 0; i < this.viewControllers.length; i++) {
                if (this.viewControllers[i] != vc) {
                    var vcToRemove = this.viewControllers[i];
                    this.removeViewController(vcToRemove);
                    i = 0;
                }
            }
            vc.viewWasPresented();
            return;
        }
        // ok we animate
        // from which direction is the new view coming ?

        this.animation = new FrameworkUI.Animation();
        this.animation.initWithDelegate(vc.id,this);

        for (var i = 0; i < this.viewControllers.length; i++) {
            var isNewView = false;
            var aview = null;

            if (this.viewControllers[i].id == vc.id) {
                isNewView = true;
                aview = vc.view;
            } else {
                aview = this.viewControllers[i].view;
            }

            var animKey = new FrameworkUI.ViewAnimationKey();
            animKey.view = aview;
            animKey.easingFunction = FrameworkUI.Easing.easeOutCirc;
            animKey.duration = 500;
            switch (opts.direction) {
                case 'left':
                    animKey.transform = 'translateX';
                    if (isNewView) {
                        animKey.startValue = this.rootView.bounds.width;
                        animKey.endValue = 0;
                    } else {
                        animKey.startValue = 0;
                        animKey.endValue = -this.rootView.bounds.width;
                    }
                    animKey.direction = -1;
                    break;
                case 'right':
                    animKey.transform = 'translateX';
                    if (isNewView) {
                        animKey.startValue = -this.rootView.bounds.width;
                        animKey.endValue = 0;
                    } else {
                        animKey.startValue = 0;
                        animKey.endValue = this.rootView.bounds.width;
                    }
                    animKey.direction = +1;
                    break;
                case 'up':
                    animKey.transform = 'translateY';
                    if (isNewView) {
                        animKey.startValue = this.rootView.bounds.height;
                        animKey.endValue = 0;
                    } else {
                        animKey.startValue = 0;
                        animKey.endValue = -this.rootView.bounds.height;
                    }
                    animKey.direction = -1;
                    break;
                case 'down':
                    animKey.transform = 'translateY';
                    if (isNewView) {
                        animKey.startValue = -this.rootView.bounds.height;
                        animKey.endValue = 0;
                    } else {
                        animKey.startValue = 0;
                        animKey.endValue = this.rootView.bounds.height;
                    }
                    animKey.direction = +1;
                    break;
            }
            animKey.drawFrame(0.000);
            this.animation.pushAnimationKey(animKey);
        }
        this.animation.startPlaying();
    },


    animationDidFinish : function (id) {
        this.animation = null;
        var vc = null;
        var i = 0;
        while (i<this.viewControllers.length) {

            if (this.viewControllers[i].id == id) {
                vc = this.viewControllers[i];
            } else {
                var vcToRemove = this.viewControllers[i];
                this.removeViewController(vcToRemove);
                i = -1;
            }
            i++;
        }
        if (vc!=null) {
            vc.viewWasPresented();
        }
    }



});