

MentatJS.TextField = MentatJS.View.extend({

    icon : null,
    iconRight: null,
    textboxDiv : null,
    iconText: '',
    iconTextRight: '',
    isPassword : false,
    isTextArea: false,
    value : "",
    placeholderValue: "",
    timeoutHandle: null,

    leftIconClickDelegate: null,
    leftIconClickDelegateEventName: "",
    rightIconClickDelegate: null,
    rightIconClickDelegateEventName: "",

    setLeftIconClickDelegate : function (delegate,functionName) {
        this.leftIconClickDelegate = delegate;
        this.leftIconClickDelegateEventName = functionName;
    },
    setRightIconClickDelegate : function (delegate,functionName) {
        this.rightIconClickDelegate = delegate;
        this.rightIconClickDelegateEventName = functionName;
    },

    _leftIconClick: function (sender) {
        if (this.leftIconClickDelegate !== null) {
            this.leftIconClickDelegate[this.leftIconClickDelegateEventName](sender);
        }
    },
    _rightIconClick: function (sender) {
        if (this.rightIconClickDelegate !== null) {
            this.rightIconClickDelegate[this.rightIconClickDelegateEventName](sender);
        }
    },


    viewDidResize : function () {

    },
    textWasChanged : function (newValue) { },
    onTimeout: function () {
        clearTimeout(this.timeoutHandle);
        if (this.actionDelegate!=null) {
            this.actionDelegate[this.actionDelegateEventName](this,this.value);
        }
    },
    onTextChange : function () {
        this.value = this.textboxDiv.textbox.value;
        if (this.timeoutHandle!=null) {
            clearTimeout(this.timeoutHandle);
        }
        var ptr = this;
        this.timeoutHandle = setTimeout(function () { ptr.onTimeout(); }, 200);
        this.textWasChanged(this.value);
    },
    setText: function (value) {
        this.value = value;
        this.textboxDiv.textbox.value = value;
        this.textWasChanged(this.value);
    },

    setPlaceholder: function (value) {
        this.textboxDiv.textbox.placeholder = value;
    },

    viewWillLoad : function () {

        this.icon = new MentatJS.View();
        this.iconRight = new MentatJS.Label();
        this.textboxDiv = new MentatJS.View();
    },


    focus: function () {
        this.textboxDiv.textbox.focus();
        this.textboxDiv.textbox.select();
    },

    viewWasAttached: function () {

        this.icon.boundsForView = function (parentBounds, oldBounds) {
            return { x : 5, y : 2, width : 20, height : 20, unit : "px", position: 'absolute' };
        };
        this.icon.viewWasAttached = function () {
            this.getDiv().innerHTML = this.parentView.iconText; 
            this.getDiv().style.zIndex = 6666;

        };
        this.icon.initView(this.id + ".icon");

        this.iconRight.boundsForView = function (parentBounds, oldBounds) {
            return { x : parentBounds.width - 5 - 20 , y : 0, width : 30, height : 30, unit : "px", position: 'absolute' };
        };
        this.iconRight.text = this.iconTextRight;
        this.iconRight.fontFamily = "FontAwesome,Verdana";
        this.iconRight.fontSize = 18;
        this.iconRight.fontColor = 'darkgrey';
        this.iconRight.fillLineHeight = true;
        this.iconRight.textAlignment = "center";
        this.iconRight.initView(this.id + ".iconRight", this);


        this.textboxDiv.boundsForView = function (parentBounds, oldBounds) {
            var b = { unit : 'px', position: 'absolute'};
            if (this.parentView.iconText!=='') {
                b.x = 30;
                b.width = parentBounds.width - 35;
            } else {
                b.x = 5;
                b.width = parentBounds.width - 10;
            }
            if (this.parentView.iconTextRight!=='') {
                b.width = b.width - 20;
            }

            b.y = 6;

            b.height = parentBounds.height;

            if (this.textbox != undefined) {
                this.textbox.style.top = 0;
                this.textbox.style.left = 0;
                this.textbox.style.width = b.width + b.unit;
                //this.textbox.style.height = this.posH + this.posHUnit;
            }
            return b;
        };
        this.textboxDiv.viewWasAttached = function () {

            if (this.parentView.isTextArea === true ) {
                this.textbox = document.createElement("textarea");
            } else {

                this.textbox = document.createElement("input");
                if (this.parentView.isPassword == false) {
                    this.textbox.setAttribute("type", "text");
                } else {
                    this.textbox.setAttribute("type", "password");
                }
            }

            this.textbox.setAttribute("id", this._ID + ".txt");
            this.textbox.style.border = '0px';
            this.textbox.style.outlineColor =  'transparent';
            this.textbox.style.outlineStyle =  'none';

            var pptr = this.parentView;
            var ptr = this.textbox;


            if (ptr.addEventListener) {
                ptr.addEventListener("input", function () { pptr.onTextChange(); }, false);
                ptr.addEventListener("propertychange", function () { pptr.onTextChange(); }, false);
                ptr.addEventListener("keyup", function () { pptr.onTextChange(); }, false);
                ptr.addEventListener("paste", function () { pptr.onTextChange(); }, false);
            } else {
                ptr.attachEvent("oninput", function () {
                    return (pptr.onTextChange());
                });
                ptr.attachEvent("onpropertychange", function () {
                    return (pptr.onTextChange());
                });
                ptr.attachEvent("onkeyup", function () {
                    return (pptr.onTextChange());
                });
                ptr.attachEvent("onpaste", function () {
                    return (pptr.onTextChange());
                });
            }
            this.getDiv().appendChild(this.textbox);
            this.doResize();
        }
        this.textboxDiv.initView(this.id + ".txtdiv");

        this.getDiv().style.backgroundColor = 'white';
        this.getDiv().style.borderBottom = '2px solid rgb(50, 192, 247)';
        this.getDiv().style.webkitDecoration = 'none';
        this.getDiv().className = "txtDiv";

        if (this.iconText!='') {
            this.attach(this.icon);
            this.icon.setActionDelegate(this, "_leftIconClick");
        }
        if (this.iconTextRight!=='') {
            this.attach(this.iconRight);
            this.iconRight.setActionDelegate(this, "_rightIconClick");

        }
        this.attach(this.textboxDiv);
        this.setPlaceholder(this.placeholderValue);
    }


});