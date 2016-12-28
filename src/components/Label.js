

MentatJS.defaults.labelDefaultFont = 'brandon-grotesque';

MentatJS.Label = class Label extends MentatJS.View {

    text = '';
    fontFamily = MentatJS.defaults.labelDefaultFont;
    fontSize = 12;
    fontSizeUnit = 'px';
    fontColor = 'Black';
    textAlignment = 'left';
    fontWeight = '100';

    viewWillLoad () {
        this.refresh();
    }

    refresh () {
        this.getDiv().innerHTML = '<span style="color:'+this.fontColor+';font-family:'+this.fontFamily+';font-weight:'+this.fontWeight+';font-size:'+this.fontSize+this.fontSizeUnit+';">'+this.text+'</span>';
        this.getDiv().style.textAlign = this.textAlignment;
        this.getDiv().style.lineHeight = (this.fontSize-2)  + 'px'; 
        this.getDiv().uilabelRef = this;
        this.getDiv().onclick = function (e) {
            this.uilabelRef.onLabelClicked(this,e);
        };
    }

    onLabelClicked (sender, param) {
        if (this.actionDelegate!=null) {
            this.actionDelegate[this.actionDelegateEventName](sender,param);
        }
    }

    setText (text) {
        this.text = text;
        this.refresh();
    }


    setFontColor(newColor) {
        this.fontColor = newColor;
        this.refresh();
    }


};