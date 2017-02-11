

MentatJS.SegmentedButton = MentatJS.View.extend({


    buttonsOptions : null,


    viewWillLoad : function() {
        this.buttonsOptions = new Array();
    },


    viewWasAttached : function() {

        for (var i = 0; i < this.buttonsOptions.length; i++) {

            var id = this.buttonsOptions[i].id;
            var text = this.buttonsOptions[i].text;
            var icon = this.buttonsOptions[i].icon;

            var b = new MentatJS.Button();
            b.parent = this;
            b.stateID = id;
            b.index = i;
            b.text = text;
            b.isToggle = true;
            b.initView(this.id+'.'+i);
            b.boundsForView = function(parentBounds, oldBounds) {
                var w = this.parent.bounds.width/this.parent.buttonsOptions.length;
                var x = (this.index*w-(this.index+1));
                return {
                    x: x,
                    y: 0,
                    width: w,
                    height: 30,
                    unit: 'px',
                    position: 'absolute'
                };

            }
            b.viewWasAttached = function() {

                // left, middle or right ?
                var left = '3px';
                var right = '3px;'

                if ((this.index == 0 ) && (this.parent.buttonsOptions.length>1))
                    right = '0px'

                if (this.index > 0) {
                    left = '0px';
                    right = '0px';
                }

                if (this.index == this.parent.buttonsOptions.length-1)
                    right = '3px';

                this.getDiv().style.borderTopLeftRadius = left;
                this.getDiv().style.borderTopRightRadius = right;
                this.getDiv().style.borderBottomLeftRadius = left;
                this.getDiv().style.borderBottomRightRadius = right;

                this.getDiv().style.fontWeight = 'normal';

                this.getDiv().btnPtr = this;

                this.onClickEvent = function (sender) {


                    var event_param = {
                        button_id: this.id
                    };

                    MentatJS.Application.instance.session_event(MentatJS.kEvent_User,'SegmentedButton.Click', event_param);

                    var ptr = this.btnPtr;
                    this.btnPtr.flash(function() {
                        if (ptr.actionDelegate != null) {
                            var str = 'ptr.actionDelegate.' + ptr.actionDelegateEventName + '(ptr,\'onclick\');';
                            eval(str);
                        }
                    });
                };

                this._div.addEventListener('click', this.onClickEvent);



            }
            b.OnClick = function() {
                this.parent.stateHasChanged( this.stateID );
            };
            b.setActionDelegate(this, 'buttonPressed');
            this.attach(b);
            if (this.buttonsOptions[i].enabled!=undefined) {
                if (this.buttonsOptions[i].enabled==false) {
                    b.setEnabled(false);
                }
            }
            this.buttonsOptions[i].btn = b;
        }

    },

    buttonPressed: function (sender) {
        var sid = sender.stateID;
        this.setCurrent(sid);
        if (this.actionDelegate!=null) {
            this.actionDelegate[this.actionDelegateEventName](this,sid);
        }


    },

    addButton : function ( options ) {
        if (this.buttonsOptions===null) {
            this.buttonsOptions = new Array();
        }
        this.buttonsOptions.push(options);
    },

    setCurrent: function (buttonID) {
        for (var i = 0; i < this.buttonsOptions.length; i++) {
            this.buttonsOptions[i].btn.setToggled(false);
            if (this.buttonsOptions[i].id==buttonID) {
                this.buttonsOptions[i].btn.setToggled(true);
            }
        }


    }



});