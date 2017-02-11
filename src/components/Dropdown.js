



MentatJS.Dropdown = MentatJS.View.extend({

    dataSource: null,

    viewWillLoad: function () {
        this.dd = document.createElement('select');

    },


    viewWasAttached: function () {
        this.getDiv().appendChild(this.dd);
        this.refresh();

    },

    getSelectedItem: function () {
        var idx = this.dd.selectedIndex;
        var id = this.dd.options[idx].value;
        for ( var i = 0; i < this.dataSource.length; i++) {
            if (this.dataSource[i].id == id)
                return this.dataSource[i];
        }
        return null;
    },


    setSelectedItem: function (idToSelect) {

        this.dd.value = idToSelect;

    },



    refresh: function () {
        this.doResize();
        this.dd.style.width = this.bounds.width + this.bounds.unit;
        while (this.dd.hasChildNodes()) {
            this.dd.removeChild(this.dd.lastChild);
        }

        if (this.dataSource!=null) {
            for (var i = 0; i < this.dataSource.length; i++) {
                var obj = this.dataSource[i];
                var id = this.dataSource[i].id;
                var val = this.dataSource[i].text;

                var opt = document.createElement('option');
                opt.value = id;
                opt.text = val;
                this.dd.appendChild(opt);
            }
        }
        this.dd.ptr = this;
        this.dd.onchange = function (sender) {
            if (this.ptr!=undefined) {
                if (this.ptr!=null) {
                    if (this.ptr.actionDelegate != null) {
                        this.ptr.actionDelegate[this.ptr.actionDelegateEventName](this.ptr,'onchange');
                    }
                }
            }
        }


    }





});
