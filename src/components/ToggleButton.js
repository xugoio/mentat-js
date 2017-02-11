


MentatJS.ToggleButton = MentatJS.View.extend({

    buttonElem : null,
    action: null,
    isToggled: false,


    initView : function(id) {

        this.id = id;
        this._div = document.createElement('div');
        this._div.id = id;
        this._div.style.height = '28px';
        this._div.style.color = 'blue';
        this._div.style.fontWeight = 'bolder';
        this._div.style.fontFamily = 'FontAwesome,Verdana';
        this._div.style.fontSize = '14px';
        this._div.className = 'fa';


        if (this.viewWillLoad != null)
            this.viewWillLoad();
        if (this.viewDidLoad != null)
            this.viewDidLoad();
        this.doResize();
        this.setToggled(this.isToggled);
    },

    doResize: function () {
        if (this.viewWillResize != null) {
            this.viewWillResize();
        }
        this.resize();

        this._div.style.lineHeight = this.height + this.unit;
        this._div.style.textAlign = 'center';

        if (this.subViews==null) this.subViews = new Array();

        for (var i = 0; i < this.subViews.length; i++) {
            this.subViews[i].doResize();
        }
    },


    setToggled: function (t) {
        if (t==true) {
            this.isToggled = true;
            this._div.style.color = 'green';
            this._div.innerHTML = '<i class="fa fa-toggle-on fa-2x"></i>';

        } else {
            this.isToggled = false;
            this._div.style.color = 'red';
            this._div.innerHTML = '<i class="fa fa-toggle-on fa-2x fa-flip-horizontal"></i>';

        }


    },


    onEnableStatusChanged: function (e) {

        if (e == false) {
            this._div.style.border = '1px solid grey';
            this._div.style.color = 'grey';
            var ptr = this;
            removeListener(this._div,'click',this.onClickEvent);

        } else {
            this._div.style.border = '1px solid blue';
            this._div.style.color = 'blue';
            var ptr = this;
            addListener(this._div, 'click', this.onClickEvent);
        }



    },



    viewWasAttached: function () {

        var ptr = this;
        this.doResize();

        this.onClickEvent = function (sender) {

            var event_param = {
                button_id: this.id,
                value: !this.isToggled
            };

            MentatJS.Application.instance.session_event(MentatJS.kEvent_User,'ToggleButton.Click', event_param);

            ptr.flashColor(function() {
                ptr.setToggled(!ptr.isToggled);
                if (ptr.actionDelegate != null) {
                    ptr.actionDelegate[ptr.actionDelegateEventName](ptr,ptr.isToggled);
                }
            });
        };

        addListener(this._div, 'click', this.onClickEvent);
        addListener(this._div, 'mouseover', function (e) {
            this.style.cursor = 'pointer';
        });
        addListener(this._div, 'mouseout', function (e) {
            this.style.cursor = '';
        });

    }




});