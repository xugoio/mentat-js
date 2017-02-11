
MentatJS.Popover = Class.extend({
    id: '',
    title: '',
    width: 300,
    height: 400,
    popoverView: null,
    popoverContentView: null,
    anchorElement: null,
    containerView: null,
    navigationController: null,
    fixedPositioning: false,
    fixedBounds: {},
    actionDelegate : null,
    actionDelegateEventName : '',



    setActionDelegate : function (d,n) {
        this.actionDelegate = d;
        this.actionDelegateEventName = n;
        var ptr = this;
    },


    initPopover: function (_id, _containerView, _anchorElement) {
        "use strict";

        this.id = _id;
        this.anchorElement = _anchorElement;
        this.containerView = _containerView;

        this.popoverView = new MentatJS.View();
        this.popoverView.popoverRef = this;
        this.popoverView.boundsForView = function (parentBounds) {
            var x = 0;
            var y = 0;

            if (this.popoverRef.fixedPositioning === true) {
                return this.popoverRef.fixedBounds;
            }

            var width = this.popoverRef.width;
            var height = this.popoverRef.height;
            var sx = this.popoverRef.anchorElement.style.left;
            var sy = this.popoverRef.anchorElement.style.top;
            if (sx.indexOf('px')>-1) {
                sx = sx.substr(0,sx.indexOf('px'));
            }
            if (sy.indexOf('px')>-1) {
                sy = sy.substr(0,sy.indexOf('px'));
            }
            x = parseInt(sx);
            y = parseInt(sy);
        }
        this.popoverView.viewWasAttached = function () {
            this.setLayerHeight(99999);

            this.title = new MentatJS.Label();
            this.title.text = this.popoverRef.title;
            this.title.fontColor = 'white';
            this.title.fontSize = 12 + 'px';
            this.title.fillLineHeight = true;
            this.title.boundsForView = function () {
                return {
                    x: 15,
                    y: 0,
                    width: 150,
                    height: 37,
                    unit: 'px',
                    position: 'absolute'
                };
            };
            this.title.initView(this.id + ".title");
            this.attach(this.title);

            this.close = new MentatJS.Label();
            this.close.boundsForView = function (parentBounds) {
                return {
                    x: parentBounds.width - 15 - 20,
                    y: 0,
                    width: 37,
                    height: 37,
                    unit: "px",
                    position: "absolute"
                };
            };
            this.close.fillLineHeight = true;
            this.close.fontColor = "white";
            this.close.fontFamily = 18;
            this.close.textAlignment = "center";
            this.close.text = "<i class='fa fa-close'></i>";
            this.close.initView(this.id + ".close");
            this.attach(this.close);

            this.close.setActionDelegate(this.popoverRef, "cancelPopover");


            this.content = new MentatJS.View();
            this.content.boundsForView = function (parentBounds) {
                return {
                    x: 3,
                    y: 37,
                    width: parentBounds.width - 6,
                    height: parentBounds.height - 37 -3,
                    unit: 'px',
                    position: 'absolute'
                }
            }
            this.content.viewWasAttached = function () {
                this.getDiv().style.backgroundColor = 'white';
            }
            this.content.initView(this.id + ".content");
            this.attach(this.content);

            this.getDiv().style.borderRadius = '5px';
            this.getDiv().style.backgroundColor = 'rgb(47,106,187)';
            //this.getDiv().style.opacity = 0.9;
        };
        this.popoverView.initView(this.id + ".popover");

        this.containerView.attach(this.popoverView);

        this.navigationController = new MentatJS.NavigationController();
        this.navigationController.initNavigationControllerWithRootView(this.id + ".navigationController", this.popoverView.content );

    },

    cancelPopover: function () {
        "use strict";
        this.closeWithStatus(null);
    },

    closeWithStatus : function (status) {
        var obj = null;
        if (status!==null) {
            obj = extend(status);
        }
        this.navigationController.clear(); // close the viewcontroller in the popup correctly
        this.containerView.detach(this.popoverView.id);
        this.popoverView = null;
        if (this.actionDelegate !== null) {
            this.actionDelegate[this.actionDelegateEventName](this,obj);
        }


    }



});