


MentatJS.Image = MentatJS.View.extend({


    imageURI : '',
    imageWidth : 48,
    imageHeight : 48,

    viewWillLoad : function() {
        this.refresh();
    },

    setImageURI: function (uri) {
        this.imageURI = uri;
        this.refresh();
    },

    imageClicked: function (sender) {
        if (this.actionDelegate!=null) {
            this.actionDelegate[this.actionDelegateEventName](sender);
        }
    },

    refresh : function() {
        while (this.getDiv().hasChildNodes()) {
            this.getDiv().removeChild(this.getDiv().lastChild);
        }

        this.getDiv().style.zIndex = 1;
        var img = document.createElement("img");
        img.style.width = this.imageWidth + "px";
        img.style.height = this.imageHeight = "px";
        img.src = this.imageURI;
        img.uiimageRef = this;
        img.onclick = function (e) {
            this.uiimageRef.imageClicked(this.uiimageRef);
        };
        this.getDiv().appendChild(img);

    }
    
});

MentatJS.Image.imageFromLayout = function (parentView, elem_id, id) {
    var ret = new MentatJS.Image();
    var el = parentView.getDiv().querySelector("#" + elem_id);
    ret.NO_RESIZE = true;
    ret.initFromLayout(id,el);
    parentView.attach(ret);
    return ret;
}
