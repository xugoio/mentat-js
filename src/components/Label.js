

MentatJS.defaults.labelDefaultFont = 'brandon-grotesque';

MentatJS.Label = MentatJS.View.extend({

    text : '',
    fontFamily : MentatJS.defaults.labelDefaultFont,
    fontSize : 12,
    fontSizeUnit : 'px',
    fontColor : 'Black',
    textAlignment : 'left',
    fontWeight : '100',

    viewWillLoad : function () {
        this.refresh();
    },

    refresh : function () {
        this.getDiv().innerHTML = '<span style="color:'+this.fontColor+';font-family:'+this.fontFamily+';font-weight:'+this.fontWeight+';font-size:'+this.fontSize+this.fontSizeUnit+';">'+this.text+'</span>';
        this.getDiv().style.textAlign = this.textAlignment;
        this.getDiv().style.lineHeight = (this.fontSize-2)  + 'px'; 
        this.getDiv().uilabelRef = this;
        this.getDiv().onclick = function (e) {
            this.uilabelRef.onLabelClicked(this,e);
        };
    },

    onLabelClicked : function (sender, param) {
        if (this.actionDelegate!=null) {
            this.actionDelegate[this.actionDelegateEventName](sender,param);
        }
    },

    setText : function (text) {
        this.text = text;
        this.refresh();
    },


    setFontColor : function (newColor) {
        this.fontColor = newColor;
        this.refresh();
    }


});