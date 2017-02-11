


MentatJS.View = Class.extend({

    id : '',
    NO_RESIZE : false,
    actionDelegate : null,
    actionDelegateEventName : '',
    viewController : null,
    navigationController : null,

    bounds :  null,

    oldBounds :  {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        unit: 'px',
        position: 'absolute'
    },

    parentView :  null,
    subViews : null,

    _div : null,
    dragScroll: false,

    setActionDelegate : function (d,n) {
        this.actionDelegate = d;
        this.actionDelegateEventName = n;
        var ptr = this;
    },

    setEnabled : function (e) {
        if (this.onEnableStatusChanged!=null) {
            this.onEnableStatusChanged(e);
        }
    },

    getDiv : function () {
        return this._div;
    },

    setVisible : function (b) {
        var div = this.getDiv();
        if (div != undefined) {
            div.style.display = (b == true) ? 'block' : 'none';
        }
    },


    boundsForView : function (parentBounds,oldBounds) {
        return null;
    },


    viewWillLoad : function () {

    },

    viewDidLoad : function () {

    },

    viewWasAttached : function () {

    },

    setScrollView: function (horizEnabled,verticalEnabled) {
        "use strict";
        this.getDiv().style.overflowX = (horizEnabled===true) ? "scroll" : "hidden";
        this.getDiv().style.overflowY = (verticalEnabled===true) ? "scroll" : "hidden";
    },

    setLayerHeight : function (z) {
        this.getDiv().style.zIndex = z;
    },

    setOpacity : function (o) {
        this.getDiv().style.opacity = o;
    },

    doResize : function () {

        var parentBounds = null;
        if (this.parentView === null) {
            // get the parent node if possible
            var pnode = this.getDiv().parentNode;
            if (pnode === document.body) {
                parentBounds = {
                    x: 0,
                    y: 0,
                    width: document.documentElement.clientWidth,
                    height: document.documentElement.clientHeight,
                    unit: 'px',
                    position: 'absolute'
                };
            } else {
                var x = 0;
                var y = 0;
                var width = 0;
                var height = 0;

                if (pnode.style != undefined) {
                    if (pnode.style.left != undefined) {
                        x = pnode.style.left.substr(0, pnode.style.left.indexOf('px'));
                    }
                    if (pnode.style.top != undefined) {
                        y = pnode.style.top.substr(0, pnode.style.top.indexOf('px'));
                    }
                    if (pnode.style.width != undefined) {
                        width = pnode.style.width.substr(0, pnode.style.width.indexOf('px'));
                    }
                    if (pnode.style.height != undefined) {
                        height = pnode.style.height.substr(0, pnode.style.height.indexOf('px'));
                    }
                }

                parentBounds = {
                    x: x,
                    y: y,
                    width: width,
                    height: height,
                    unit: 'px',
                    position: 'absolute'
                };
            }

        } else {
            parentBounds = this.parentView.bounds;
        }

        if (this.boundsForView !== undefined) {
            if (parentBounds === null) {
                throw new Error('parentBounds of a view cannot be null');
            }
            var newBounds = this.boundsForView(parentBounds, this.bounds);
            if (newBounds !== null) {
                this.resize(newBounds);
                this.oldBounds = this.bounds;
                this.bounds = newBounds;
            }
        }

        if (this.subViews==null) this.subViews = new Array();

        for (var i = 0; i < this.subViews.length; i++) {
            this.subViews[i].doResize();
        }
    },




    resize : function (bounds) {

        if (this._div != undefined) {
            this._div.style.position = bounds.position;
            this._div.style.left = bounds.x + bounds.unit;
            this._div.style.top = bounds.y + bounds.unit;
            this._div.style.bottom = (bounds.y + bounds.height) + bounds.unit;
            this._div.style.right = (bounds.x + bounds.width) + bounds.unit;
            this._div.style.width = bounds.width + bounds.unit;
            this._div.style.height = bounds.height + bounds.unit;
        }
    },


    initFromLayout: function (_id,_el) {
        this.id = _id;
        this._div = _el;
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

    },


    initView : function (_id,parentView) {
        // set the id
        this.id = _id;
        this._div = document.createElement('div');
        this._div.id = _id;
        this.subViews = new Array();
        if (parentView !== undefined) {
            this.parentView = parentView;
        }

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




    },




    attach : function (view) {
        if (this.subViews==null) this.subViews = new Array();
        this.subViews.push(view);
        if (this.getDiv() != undefined) {
            // is view.getDiv() already in this.getDiv() ?
            if (view.getDiv().parentNode == null) {
                this.getDiv().appendChild(view.getDiv());
            }
        }
        view.parentView = this;
        if (this.NO_RESIZE == false) {
            view.doResize();
        }
        if (view.viewWasAttached != null) {
            view.viewWasAttached(this);
        }
        view.getDiv().viewRef = view;


    },

    detachAllChildren : function () {
        if (this.subViews==null) this.subViews = new Array();
        if (this.getDiv() != undefined) {
            while ( this.getDiv().childNodes.length>0) {
                this.getDiv().removeChild(this.getDiv().children[this.getDiv().childNodes.length-1]);
            }

        }
    },




    flashColor : function(callback) {

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
    },


    flash : function (callback) {

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
    },


    flashTarget : function (target,callback) {
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
    },

    fade2Black : function () {
        var ptr2 = this;
        this.getDiv().style.transition = 'opacity .75s ease-in-out';
        this.getDiv().style.opacity = 0.0;
        this.getDiv().style.backgroundColor = 'black';
    },

    fadeOut : function () {
        this.getDiv().style.transition = 'opacity .75s ease-in-out';
        this.getDiv().style.opacity = 1.0;
        this.getDiv().style.backgroundColor = 'white';
    },



    findViewNamed : function (name) {
        if (this.id == name)
            return this;
        for (var i = 0; i < this.subViews.length; i++) {
            var ret = this.subViews[i].findViewNamed(name);
            if (ret!=null) return ret;
        }
        return null;
    },


    detach : function (name) {
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
    },

    detachItSelf : function () {
        if (this.parent!=null) {
            this.parent.detach(this.id);
        } else {
            this.getDiv().parentNode.removeChild(this.getDiv());
        }
    },



    loadLayoutWithDelegate : function (layoutFile, delegate) {

        var thisView = this;

        // is the layout in cache ?
        if (MentatJS.Application.instance!=null) {
            var cache = MentatJS.Application.instance.cacheContains(layoutFile);
            if (cache!=null) {
                thisView.getDiv().innerHTML = cache.layout;
                delegate.layoutWasLoadedSuccessfully(thisView, cache.layout);
                return;
            }
        }
        
        
        if (!!window.Worker) {

            var worker = new Worker(MentatJS.DownloadWorkerURI);
            worker.onmessage = function (event) {
                thisView.getDiv().innerHTML = event.data;
                MentatJS.Application.instance.cache( layoutFile, { layout: event.data });
                delegate.layoutWasLoadedSuccessfully(thisView,event.data);
            };
            worker.onerror = function (event) {
                var o = event.message;
                delegate.couldNotLoadLayout(thisView,event);
            };
            worker.postMessage(layoutFile);

        } else {
            var xmlHttpReq = createXMLHttpRequest();
            xmlHttpReq.open("GET", uri, false);
            xmlHttpReq.send(null);
            thisView.getDiv().innerHTML = xmlHttpReq.responseText;
            MentatJS.Application.instance.cache( layoutFile, { layout: xmlHttpReq.responseText });
            delegate.layoutWasLoadedSuccessfully(thisView,xmlHttpReq.responseText);

        }

    },


    scrollCallback : function (event) {
        "use strict";
        this.getDiv().style.left = (MentatJS._offsetX + event.clientX - MentatJS._startX) + 'px';
        this.getDiv().style.top = (MentatJS._offsetY + event.clientY - MentatJS._startY) + 'px';
    },


    isDragScroll: function () {
        "use strict";
        if (this.dragScroll===true) {
            return this;
        }
        if (this.parentView!==null) {
            return this.parentView.isDragScroll();
        }
        return null;
    }



});


MentatJS.onMouseDown = function (e) {
    console.log('onMouseDown');

    if (e.srcElement!==undefined) {
        if (e.srcElement.viewRef!==undefined) {
            console.log(e.srcElement.viewRef.id);
        }
    }



    document.onmousemove = MentatJS.onMouseMove;
    document.ontouchmove = MentatJS.onMouseMove;
    MentatJS._startX = event.clientX;
    MentatJS._startY = event.clientY;
    MentatJS._offsetX = MentatJS._dragElement.offsetLeft;
    MentatJS._offsetY = MentatJS._dragElement.offsetTop;

    //e.preventDefault();

};

MentatJS.onMouseMove = function (e) {
    "use strict";
    if (e == null)
        var e = window.event;

    // this is the actual "drag code"
    //MentatJS._dragElement.style.left = (MentatJS._offsetX + e.clientX - MentatJS._startX) + 'px';
    //MentatJS._dragElement.style.top = (MentatJS._offsetY + e.clientY - MentatJS._startY) + 'px';

    if (MentatJS._dragElement.viewRef!==undefined) {
        MentatJS._dragElement.viewRef.scrollCallback(e);

    }

};


MentatJS.onMouseUp = function () {
    "use strict";
    document.onmousemove = null;
    document.ontouchmove = null;
}



MentatJS.fillParentBounds = function (parentBounds) {
    "use strict";
    return {
        x: 0,
        y: 0,
        width: parentBounds.width,
        height: parentBounds.height,
        unit: parentBounds.unit,
        position: parentBounds.position
    };
};


MentatJS.applyClickThrough = function (cell) {

    cell.getDiv().style.pointerEvents = 'none';
    /*
    addEventListener(cell.getDiv(), 'click', function () {
        ptr[fnName]
    });
    addEventListener(cell.getDiv(), 'mouseover', function (e) {
        this.style.cursor = 'pointer';
    });
    */

    for ( var i = 0; i < cell.subViews.length; i++ ) {
        MentatJS.applyClickThrough( cell.subViews[i]);
    }
};

