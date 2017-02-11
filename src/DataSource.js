

MentatJS.DataSource = Class.extend({
    dataSourceID : '',
    dataString : '',
    mainData : new Array(),
    sortedData : new Array(),
    dataLastUpdated: null,


    initWithDataString: function (_str) {

        this.dataString = _str;
        var json = {};
        json = JSON.parse(_str);
        this.dataLastUpdated = new Date();

        if ( json.valid==false) {
            this.mainData = [];
            this.sortedData = [];
        } else {
            this.mainData = this.arrayPath(json);
            this.reindex();
        }


    },
    arrayPath: function (json) {
        return json.rows;
    },

    objectForSortedIndex: function (index) {
        return this._objectAtIndex(this.sortedData[index]);
    },

    _objectAtIndex: function (index) {
        if (index<0) return null;
        if (index>=this.mainData.length) return null;
        return this.mainData[index];
    },

    idForObject: function (item) {
        return item.uniqueintid;
    },

    sortFieldForObject: function (item) { // override to sort on name member
        return item.uniqueintid;
    },

    applyFilter: function (value,fn_filter) {
        var i = this.mainData.length;
        while (i>0) {
            if (fn_filter(value,this.mainData[i-1])==false) {
                this.mainData.splice(i-1,1);
                i = this.mainData.length;
            } else {
                i--;
            }
        }
        this.reindex();
    },


    numberOfItems: function () {
        return this.mainData.length;
    },

    filterForObject: function (item) {
        return true;
    },


    quickFind: function (uniqueintid) {
        var currentIndex = -1
        var range = [0,this.mainData.length-1];
        var nbJumps = 0;
        while (1) {
            nbJumps++;

            currentIndex = range[0] + (range[1] - range[0]) / 2;

            var _id = this.idForObject(this._objectAtIndex(currentIndex));

            if (_id == uniqueintid) {
                console.log('found ' +id + ' in ' + nbJumps + ' jumps');
                return this.objectAtIndex(currentIndex);
            }
            if (_id < id) {
                range = [currentIndex,this.mainData.length-1];
            }
            if (_id > id) {
                range[1] = currentIndex-1;
            }
            if (range[0]==range[1]) return null;
        }


    },




    reindex: function () {

        this.sortedData = new Array();

        for ( var i = 0; i < this.mainData.length; i++ ) {
            this.mainData[i].uniqueintid = i;
            if (this.filterForObject(this.mainData[i])==true) {
                this.sortedData.push(i);
            }
        }
        var ptr = this;
        this.sortedData.sort(function (a,b) {
            var item_a = ptr.mainData[a];
            var item_b = ptr.mainData[b];
            var value_a = ptr.sortFieldForObject(item_a);
            var value_b = ptr.sortFieldForObject(item_b);
            if (typeof(value_a)==='string') {
                return value_a.localeCompare(value_b, {numeric: true});
            }
            return value_a - value_b;

        });



    },

    copy: function () {
        var ret = new MentatJS.DataSource();
        ret.arrayPath = this.arrayPath;
        ret.sortFieldForObject = this.sortFieldForObject;
        ret.initWithDataString(this.dataString);
        return ret;
    },

    deepCopy: function () {
        var ret = new MentatJS.DataSource();
        ret.arrayPath = this.arrayPath;
        ret.sortFieldForObject = this.sortFieldForObject;
        ret.filterForObject = this.filterForObject;
        ret.initWithDataString(this.dataString);
        ret.mainData = JSON.parse(JSON.stringify(this.mainData));
        ret.reindex();
        return ret;
    }


});
