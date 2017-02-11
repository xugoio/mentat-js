


MentatJS.defaults.buttonDefaultTint = MentatJS.tints.kBlueTint;


MentatJS.Button = MentatJS.View.extend({

    text : '',
    buttonElem : null,
    action : null,
    isToggle : false,
    isEnabled : true,
    isToggled : false,
    innerText : '',
    tint : MentatJS.defaults.buttonDefaultTint,
    oldTint : MentatJS.defaults.buttonDefaultTint,

    initView : function (id) {
        this.id = id;
        this._div = document.createElement('div');

        this._div.id = id;
        this._div.style.userSelect = 'none';
        this._div.style.MozUserSelect = 'none';
        this._div.style.webkitUserSelect = 'none';

        if (this._div != null) {

            this._div.style.webkitAppearance = 'none';
            this._div.style.background = this.tint.background;
            this._div.style.color = this.tint.text;
            this._div.style.border = '1px solid ' + this.tint.normal;
            this._div.style.borderRadius = '15px';
            this._div.style.height = '30px';
            this._div.style.fontWeight = 'normal';
            this._div.style.fontFamily = 'FontAwesome,robotoblack';
            this._div.value = this.text;
            this._div.innerHTML = this.text;

            this._div.className = 'fa';


            if (this.viewWillLoad != null)
                this.viewWillLoad();
            if (this.viewDidLoad != null)
                this.viewDidLoad();

            this.setToggled(this.isToggled);

        }

    },



    doResize : function () {
        if (this.viewWillResize != null) {
            throw Error('viewWillResize is not compatible.');
        };
        var parentBounds = (this.parentView!=null) ? this.parentView.bounds : null;
        if (this.boundsForView!=undefined) {
            var newBounds = this.boundsForView(parentBounds, this.bounds);
            if (newBounds!=null) {
                this.resize(newBounds);
                this.oldBounds = this.bounds;
                this.bounds = newBounds;
                this.getDiv().style.borderRadius = (this.bounds.height/2)  + this.bounds.unit;
            }
        }

        this._div.style.lineHeight = this.bounds.height + this.bounds.unit;
        this._div.style.textAlign = 'center';


        if (this.subViews==null) this.subViews = new Array();

        for (var i = 0; i < this.subViews.length; i++) {
            this.subViews[i].doResize();
        }
    },




    setText : function (_txt) {
        this.text = _txt;
        this._div.innerHTML = this.text;
    },

    setToggled : function (t) {
        if (t==true) {
            this.isToggled = true;
            this._div.style.background = this.tint.toggled;
            this._div.style.color = this.tint.toggledtext;
            this._div.style.border = '1px solid ' + this.tint.normal;
        } else {
            this.isToggled = false;
            this._div.style.background = this.tint.background;
            this._div.style.color = this.tint.text;
            this._div.style.border = '1px solid ' + this.tint.normal;
        }
    },


    onEnableStatusChanged : function (e) {
        if (e == false) {
            this.isEnabled=false;
            if ((this.isToggle) && (this.isToggled) ) {
                this._div.style.border = '1px solid ' + MentatJS.tints.kDisabledTint.normal; //'1px solid lightgrey';
                this._div.style.backgroundColor = MentatJS.tints.kDisabledTint.toggled;
                this._div.style.color = MentatJS.tints.kDisabledTint.toggledtext;
            } else {
                this._div.style.border = '1px solid ' + MentatJS.tints.kDisabledTint.normal; //'1px solid lightgrey';
                this._div.style.backgroundColor = MentatJS.tints.kDisabledTint.background;
                this._div.style.color = MentatJS.tints.kDisabledTint.text;
            }
            this.oldTint = this.tint;
            this.tint = MentatJS.tints.kDisabledTint;
            var ptr = this;
            this._div.removeEventListener('click',this.onClickEvent);
        } else {
            this.isEnabled = true;
            if ((this.isToggle) && (this.isToggled) ) {
                this._div.style.border = '1px solid ' + this.tint.normal; //'1px solid lightgrey';
                this._div.style.backgroundColor = this.tint.toggled;
                this._div.style.color = this.tint.toggledtext;
            } else {
                this._div.style.border = '1px solid ' + this.tint.normal; //'1px solid lightgrey';
                this._div.style.backgroundColor = this.tint.background;
                this._div.style.color = this.tint.text;
            }
            this.tint = this.oldTint;
            var ptr = this;
            this._div.addEventListener('click', this.onClickEvent);
        }
    },

    viewWasAttached : function () {

        var ptr = this;
        this.doResize();
        this.setToggled(this.isToggled);

        this.onClickEvent = function (sender) {
            var event_param = {
                button_id: this.id
            };
            MentatJS.Application.instance.session_event(MentatJS.kEvent_User,'Button.Click', event_param);
            ptr.flash(function() {
                if (ptr.isToggle) {
                    ptr.setToggled(!ptr.isToggled);
                }
                if (ptr.actionDelegate != null) {
                    ptr.actionDelegate[ptr.actionDelegateEventName](ptr,'onclick');
                }
            });
        };

        this._div.addEventListener('click', this.onClickEvent);
        this._div.addEventListener('mouseover', function (e) {
            this.style.cursor = 'pointer';
            if (ptr.isEnabled==true) {
                ptr.getDiv().style.backgroundColor = ptr.tint.hover;
                ptr.getDiv().style.color = ptr.tint.hovertext;
            } else {
                ptr.getDiv().style.backgroundColor = MentatJS.kDisabledTint.hover;
                ptr.getDiv().style.color = MentatJS.kDisabledTint.hovertext;
            }
        });
        this._div.addEventListener('mouseout', function (e) {
            this.style.cursor = '';
            if (ptr.isEnabled==true) {
                if ((ptr.isToggle) && (ptr.isToggled)) {
                    ptr.getDiv().style.backgroundColor = ptr.tint.hover;
                    ptr.getDiv().style.color = ptr.tint.hovertext;
                } else {
                    ptr.getDiv().style.backgroundColor = ptr.tint.background;
                    ptr.getDiv().style.color = ptr.tint.text;
                }
            } else {
                if ((ptr.isToggle) && (ptr.isToggled)) {
                    ptr.getDiv().style.backgroundColor = MentatJS.kDisabledTint.toggled;
                    ptr.getDiv().style.color = MentatJS.kDisabledTint.toggledtext;
                } else {
                    ptr.getDiv().style.backgroundColor = MentatJS.kDisabledTint.background;
                    ptr.getDiv().style.color = MentatJS.kDisabledTint.text;
                }
            }
        });
    },


    flash : function (callback) {

        var ptr = this;
        this.getDiv().style.backgroundColor = ptr.tint.hover; //'#A1C8FC';
        this.getDiv().style.color = ptr.tint.hovertext;
        setTimeout( function() {
            ptr.getDiv().style.backgroundColor = ptr.tint.background;
            ptr.getDiv().style.color = ptr.tint.text;
            setTimeout( function() {
                ptr.getDiv().style.backgroundColor = ptr.tint.hover; //'#A1C8FC';
                ptr.getDiv().style.color = ptr.tint.hovertext;
                setTimeout( function() {
                    ptr.getDiv().style.backgroundColor = ptr.tint.background;
                    ptr.getDiv().style.color = ptr.tint.text;
                    setTimeout(function() {
                        callback();
                    },10);
                },50);
            },50);

        },50);
    }



});