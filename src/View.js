


MentatJS.UIView = class {

    id = '';
    NO_RESIZE = false;
    actionDelegate = null;
    actionDelegateEventName = '';
    viewController = null;
    navigationController = null;

    bounds =  null;

    oldBounds =  {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        unit: 'px',
        position: 'absolute'
    };

    parentView =  null;
    subViews = null;

    _div = null;

    setActionDelegate (d,n) {
        this.actionDelegate = d;
        this.actionDelegateEventName = n;
        var ptr = this;
    }

    setEnabled (e) {
        if (this.onEnableStatusChanged!=null) {
            this.onEnableStatusChanged(e);
        }
    }

    getDiv () {
        return this._div;
    }

    setVisible (b) {
        var div = this.getDiv();
        if (div != undefined) {
            div.style.display = (b == true) ? 'block' : 'none';
        }
    }


    boundsForView (parentBounds,oldBounds) {
        return null;
    }


    viewWillLoad () {

    }

    viewDidLoad () {

    }

    viewWasAttached () {

    }

    setLayerHeight (z) {
        this.getDiv().style.zIndex = z;
    }

    setOpacity (o) {
        this.getDiv().style.opacity = o;
    }

    doResize () {
        if (this.viewWillResize != null) {
            throw Error('viewWillResize is not compatible.');
        };
        var parentBounds = (this.parentView!=null) ? this.parentView.bounds : null;
        if (this.boundsForView!=undefined) {
            if (parentBounds==null) {
                console.log('null parentBounds for view id ' + this.id);
                console.dir(this);
            }
            var newBounds = this.boundsForView(parentBounds, this.bounds);
            if (newBounds!=null) {
                this.resize(newBounds);
                this.oldBounds = this.bounds;
                this.bounds = newBounds;
            }
        }

        if (this.subViews==null) this.subViews = new Array();

        for (var i = 0; i < this.subViews.length; i++) {
            this.subViews[i].doResize();
        }
    }




    resize (bounds) {

        if (this._div != undefined) {
            this._div.style.position = bounds.position;
            this._div.style.left = bounds.x + bounds.unit;
            this._div.style.top = bounds.y + bounds.unit;
            this._div.style.bottom = (bounds.y + bounds.height) + bounds.unit;
            this._div.style.right = (bounds.x + bounds.width) + bounds.unit;
            this._div.style.width = bounds.width + bounds.unit;
            this._div.style.height = bounds.height + bounds.unit;
        }
    }


    initView (_id) {
        // set the id
        this.id = _id;
        this._div = document.createElement('div');
        this._div.id = _id;
        this.subViews = new Array();
        if (this.viewWillLoad != undefined) {
            this.viewWillLoad();
        }

        if (this.controller!=null) {
            if (this.controller.viewWillLoad!=undefined) {
                this.controller.viewWillLoad(this);
            }
        }

        if (this.viewDidLoad != undefined) {
            this.viewDidLoad();
        }
        if (this.controller!=null) {
            if (this.controller.viewDidLoad!=undefined) {
                this.controller.viewDidLoad(this);
            }
        }

    }


    attach (view) {
        if (this.subViews==null) this.subViews = new Array();
        this.subViews.push(view);
        if (this.getDiv() != undefined) {
            this.getDiv().appendChild(view.getDiv());
        }
        view.parentView = this;
        if (this.NO_RESIZE == false) {
            view.doResize();
        }
        if (view.viewWasAttached != null) {
            view.viewWasAttached(this);
        }
    }

    detachAllChildren () {
        if (this.subViews==null) this.subViews = new Array();
        if (this.getDiv() != undefined) {
            while ( this.getDiv().childNodes.length>0) {
                this.getDiv().removeChild(this.getDiv().children[this.getDiv().childNodes.length-1]);
            }

        }
    }




    flashColor (callback) {

        var ptr = this;
        var color = this.getDiv().style.color || '#000000';
        this.getDiv().style.color = '#A1C8FC';
        setTimeout( function() {
            ptr.getDiv().style.color = color;
            setTimeout( function() {
                ptr.getDiv().style.color = '#A1C7FC';
                setTimeout( function() {
                    ptr.getDiv().style.color = color;
                    setTimeout(function() {
                        callback();
                    },10);
                },50);
            },50);
        },50);
    }


    flash (callback) {

        var ptr = this;
        var backgroundColor = this.getDiv().style.backgroundColor || '#FFFFFF';
        this.getDiv().style.backgroundColor = '#A1C8FC';
        setTimeout( function() {
            ptr.getDiv().style.backgroundColor = backgroundColor;
            setTimeout( function() {
                ptr.getDiv().style.backgroundColor = '#A1C7FC';
                setTimeout( function() {
                    ptr.getDiv().style.backgroundColor = backgroundColor;
                    setTimeout(function() {
                        callback();
                    },10);
                },50);
            },50);

        },50);
    }


    flashTarget (target,callback) {
        var ptr2 = this;
        var backgroundColor = target.style.backgroundColor || '#FFFFFF';
        target.style.backgroundColor = '#A1C8FC';
        setTimeout( function() {
            target.style.backgroundColor = backgroundColor;
            setTimeout( function() {
                target.style.backgroundColor = '#A1C7FC';
                setTimeout( function() {
                    target.style.backgroundColor = backgroundColor;
                    setTimeout(function() {
                        callback(ptr2);
                    },10);
                },50);
            },50);

        },50);
    }

    fade2Black () {
        var ptr2 = this;
        this.getDiv().style.transition = 'opacity .75s ease-in-out';
        this.getDiv().style.opacity = 0.0;
        this.getDiv().style.backgroundColor = 'black';
    }

    fadeOut () {
        this.getDiv().style.transition = 'opacity .75s ease-in-out';
        this.getDiv().style.opacity = 1.0;
        this.getDiv().style.backgroundColor = 'white';
    }



    findViewNamed (name) {
        if (this.id == name)
            return this;
        for (var i = 0; i < this.subViews.length; i++) {
            var ret = this.subViews[i].findViewNamed(name);
            if (ret!=null) return ret;
        }
        return null;
    }


    detach (name) {
        console.log('detaching '+name+' from ' + this.id);
        var idx = -1;
        for (var i = 0; i < this.subViews.length; i++) {
            if (this.subViews[i].id==name) {
                idx = i;
            }
        }
        console.log('index is ' + idx);
        console.dir(this.subViews);
        if (idx>-1) {
            if (this.subViews[idx].getDiv()!=null) {
                if (this.getDiv()!=null) {
                    this.getDiv().removeChild( this.subViews[idx].getDiv());
                }
            }
            this.subViews[idx].parent = null;
            if (this.subViews[idx].viewWasDetached!=null) {
                this.subViews[idx].viewWasDetached();
            }
            var view = this.subViews[idx];
            this.subViews.splice(idx,1);
        }
        console.dir(this.subViews);
        console.log('end detach');
    }

    detachItSelf () {
        if (this.parent!=null) {
            this.parent.detach(this.id);
        } else {
            this.getDiv().parentNode.removeChild(this.getDiv());
        }
    }



};