


function ListItem() {

    this.obj = null;
    this.section = 1;
    this.index = 1;
    this.Selected = false;

}
MentatJS.kNoSelection = 0x00;
MentatJS.kMultipleSelection = 0x01;
MentatJS.kSingleSelection = 0x02;

MentatJS.ListView = MentatJS.View.extend({

    Items : null,
    NoTabIndex : false,
    DataSource : null,
    SelectionMode: MentatJS.kMultipleSelection,
    SectionnedByLetters : false,

    // DEPRECATED ?
    extraSizeRequests : [],

    dataDelegate: null,


    numberOfSections : function () {
        if (this.SectionnedByLetters == false)
            return 1;

        var letters = new Array();

        for (var i = 0; i < this.DataSource.numberOfItems(); i++) {
            var l = this.alphabetSectionForObjectAtIndex(i);
            if ((l == '0') || (l == '1') || (l == '2') || (l == '3') || (l == '4') || (l == '5') || (l == '6') || (l == '7') || (l == '8') || (l == '9')) {
                if (letters.indexOf('0-9')==-1)
                    letters.push('0-9');
            }
            else {
                if (letters.indexOf(l) == -1)
                    letters.push(l);
            }
        }
        letters.sort();
        return letters.length;
    },

    alphabetSectionForObjectAtIndex : function (index) { throw "alphabetSectionForObjectAtIndex needs to be implemented."; },

    rowMargin: function (section_index,item_index) { return 0; },
    backgroundColor: function () { return ''; },

    titleForSection : function (section_index) {
        if (this.SectionnedByLetters == false)
            return "";

        var letters = new Array();

        for (var i = 0; i < this.DataSource.numberOfItems(); i++) {
            var l = this.alphabetSectionForObjectAtIndex(i);
            if ((l == '0') || (l == '1') || (l == '2') || (l == '3') || (l == '4') || (l == '5') || (l == '6') || (l == '7') || (l == '8') || (l == '9')) {
                if (letters.indexOf('0-9') == -1)
                    letters.push('0-9');
            }
            else {

                if (letters.indexOf(l) == -1)
                    letters.push(l);
            }
        }
        letters.sort();
        return letters[section_index - 1];
    },

    numberOfItemsForSection : function (section_index) {
        if (this.SectionnedByLetters == false)
            return this.DataSource.numberOfItems();
        var ptrthis = this;

        var ret = 0;
        var letters = new Array();
        for (var i = 0; i < this.DataSource.numberOfItems(); i++) {
            var l = this.alphabetSectionForObjectAtIndex(i);
            if ((l == '0') || (l == '1') || (l == '2') || (l == '3') || (l == '4') || (l == '5') || (l == '6') || (l == '7') || (l == '8') || (l == '9')) {
                if (letters.indexOf('0-9')==-1)
                    letters.push('0-9');
            }
            else {

                if (letters.indexOf(l) == -1)
                    letters.push(l);
            }
        }
        letters.sort();
        for (i = 0; i < this.DataSource.numberOfItems(); i++) {
            l = this.alphabetSectionForObjectAtIndex(i);
            if ((l == '0') || (l == '1') || (l == '2') || (l == '3') || (l == '4') || (l == '5') || (l == '6') || (l == '7') || (l == '8') || (l == '9')) {
                l = '0-9';
            }
            if (l == letters[section_index - 1])
                ret++;
        }
        return ret;

    },

    itemForIndex : function (section_index, item_index) { throw "itemForIndex needs to be implemented."; },
    paddingForSection : function (section_index) { return 10; },
    sizeForItemIndex : function (section_index, item_index) { return [340, 68]; },
    onDoubleClick : function () { ; },

    objectForItemIndex : function (section_index, item_index) {

        if (this.SectionnedByLetters == false)
            return this.DataSource.objectForSortedIndex(item_index - 1);
        var ret = 0;
        var letters = new Array();
        for (var i = 0; i < this.DataSource.numberOfItems(); i++) {
            var l = this.alphabetSectionForObjectAtIndex(i);
            if ((l == '0') || (l == '1') || (l == '2') || (l == '3') || (l == '4') || (l == '5') || (l == '6') || (l == '7') || (l == '8') || (l == '9')) {
                if (letters.indexOf('0-9')==-1)
                    letters.push('0-9');
            }
            else {

                if (letters.indexOf(l) == -1)
                    letters.push(l);
            }
        }
        letters.sort();
        for (i = 0; i < this.DataSource.numberOfItems(); i++) {
            l = this.alphabetSectionForObjectAtIndex(i);
            if ((l == '0') || (l == '1') || (l == '2') || (l == '3') || (l == '4') || (l == '5') || (l == '6') || (l == '7') || (l == '8') || (l == '9')) {
                l = '0-9';
            }
            if (l == letters[section_index - 1])
                ret++;
            if (ret == item_index) {
                return this.DataSource.objectForSortedIndex(i);
            }
        }
        return null;
    },

    sizeForSectionHeader : function (section_index) { return [340, 20]; },

    // DEPRECATED ?
    isObjectSelected : function (section_index, item_index) {
        return false;
        // throw "isObjectSelected needs to be implemented.";
    },

    objectSelectionChanged : function (section_index, item_index, selected) {
        //throw "objectSelectionChanged needs to be implemented.";
    },


    onItemClick : function (ctrl, shift, rowID, section_index, item_index) {

        var color = '';
        var arr = null;

        for ( var i = 0; i < this.Items.length; i++) {
            if ((this.Items[i].section == section_index) && (this.Items[i].index == item_index)) {
                arr = [this.Items[i]];
            }
        }
        if (this.SelectionMode === MentatJS.kNoSelection) {
            return;
        }

        var selected = false;
        if (this.SelectionMode === MentatJS.kMultipleSelection) {
            ctrl = true;
            shift = false;
        } else {
            ctrl = false;
            shift = false;
        }

        if ((ctrl == true) && (shift == false)) {
            // ADD A ROW TO THE SELECTION
            color = document.getElementById(rowID).style.backgroundColor;
            if (color == "rgb(173, 216, 230)") {
                document.getElementById(rowID).style.backgroundColor = 'transparent';
                if (arr.length > 0) {
                    arr[0].Selected = false;
                    selected = false;
                }
            } else {
                document.getElementById(rowID).style.backgroundColor = 'rgb(173,216,230)';
                if (arr.length > 0) {
                    arr[0].Selected = true;
                    selected = true;
                }
            }
            this.objectSelectionChanged(section_index, item_index, selected);
        }
        else if ((ctrl == false) && (shift == false)) {
            // REMOVE SELECTION AND SELECT THIS ROW
            for (var i = 0; i < this.Items.length; i++) {
                if ((this.Items[i].section == section_index) && (this.Items[i].index == item_index)) continue;
                document.getElementById(this.id + "_section" + this.Items[i].section + "Cell" + this.Items[i].index).style.backgroundColor = 'transparent';
                this.Items[i].Selected = false;
                this.objectSelectionChanged(this.Items[i].section, this.Items[i].index, this.Items[i].Selected);
            }
            color = document.getElementById(rowID).style.backgroundColor;
            if (color == "rgb(173, 216, 230)") {
                document.getElementById(rowID).style.backgroundColor = 'transparent';
                if (arr.length > 0) {
                    arr[0].Selected = false;
                    selected = false;
                }
            } else {
                document.getElementById(rowID).style.backgroundColor = 'rgb(173, 216, 230)';
                if (arr.length > 0) {
                    arr[0].Selected = true;
                    selected = true;
                }
            }
            this.objectSelectionChanged(section_index, item_index, selected);

        }
        else if ((ctrl == false) && (shift == true)) {
            // RANGE SELECTION
            var index = -1;
            var reverse = false;
            for (var i = 0; i < this.Items.length; i++) {
                if (index == -1) {
                    if (this.Items[i].Selected == true) {
                        index = i;

                        if ((this.Items[i].section == section_index && this.Items[i].index > item_index) || (this.Items[i].section > section_index)) {
                            reverse = true;
                            break;
                        }

                    }
                }
                if ((i >= index) && (index > -1)) {
                    document.getElementById(this.id + "_section" + this.Items[i].section + "Cell" + this.Items[i].index).style.backgroundColor = 'rgb(173, 216, 230)';
                    this.Items[i].Selected = true;
                    this.objectSelectionChanged(this.Items[i].section, this.Items[i].index, this.Items[i].Selected);

                    if ((this.Items[i].section == section_index) && (this.Items[i].index == item_index)) {
                        // remove the ones after
                        index = -2;
                    }
                } else
                if (index == -2) {
                    document.getElementById(this.id + "_section" + this.Items[i].section + "Cell" + this.Items[i].index).style.backgroundColor = 'transparent';
                    this.Items[i].Selected = false;
                    this.objectSelectionChanged(this.Items[i].section, this.Items[i].index, this.Items[i].Selected);
                }
            }

            if (reverse == true) {

                for (var i = index; i >= 0; i--) {

                    document.getElementById(this.id + "_section" + this.Items[i].section + "Cell" + this.Items[i].index).style.backgroundColor = 'rgb(173, 216, 230)';
                    this.Items[i].Selected = true;
                    this.objectSelectionChanged(this.Items[i].section, this.Items[i].index, this.Items[i].Selected);

                    if ((this.Items[i].section == section_index) && (this.Items[i].index == item_index)) {
                        index = -2;
                    }
                    else if (index == -2) {
                        //$('#' + this._ID + "_section" + this.Items[i].section + "Cell" + this.Items[i].index).css({ "background-color": "transparent" });
                        document.getElementById(this.id + "_section" + this.Items[i].section + "Cell" + this.Items[i].index).style.backgroundColor = 'transparent';
                        this.Items[i].Selected = false;
                        this.objectSelectionChanged(this.Items[i].section, this.Items[i].index, this.Items[i].Selected);
                    }
                }

            }
        }

        if (this.actionDelegate!=undefined) {
            if (this.actionDelegate!=null) {
                this.actionDelegate[this.actionDelegateEventName](this);
            }
        }

        if (this.selectionMayHaveChanged!=undefined) {
            this.selectionMayHaveChanged();
        }
    },

    GetSelectedObjects : function () {
        var arr = [];
        for ( var i = 0 ; i < this.Items.length; i++) {
            if (this.Items[i].Selected==true) {
                arr.push(this.Items[i]);
            }
        }
        var ret = new Array();
        for (var i = 0; i < arr.length; i++) {

            var obj = this.objectForItemIndex(arr[i].section, arr[i].index);
            ret.push(obj);
        }
        return ret;
    },

    DEPRECATEDGetSelectedItems : function () {
        return window.top.$.grep(this.Items, function (o) { return o.Selected == true; });
    },


    extraSizeRequested : function (section_index,item_index) {
        for (var i = 0; i < this.extraSizeRequests.length; i++) {
            var o = this.extraSizeRequests[i];
            if ((o.section_index==section_index) && (o.item_index==item_index) ) {
                return [o.width, o.height];
            }
        }

        return [0,0];
    },

    requestExtraSize : function (section_index,item_index,width,height) {
        var found = false;

        for (var i = 0; i < this.extraSizeRequests.length; i++) {
            var o = this.extraSizeRequests[i];
            if ((o.section_index==section_index) && (o.item_index==item_index) ) {
                o.width = width;
                o.height = height;
                found = true;
            }
        }
        if (found==false) {
            var o = {};
            o.section_index = section_index;
            o.item_index = item_index;
            o.width = width;
            o.height = height;
            this.extraSizeRequests.push(o);
        }

    },

    recalculateSize: function () {

        var item_y = 0;
        var ptrthis = this;
        var nbSections = this.numberOfSections();
        for (var section_index = 1; section_index <= nbSections; section_index++) {
            var nbItems = this.numberOfItemsForSection(section_index);
            if (nbItems == 0) continue;
            if (this.customHeaderCell == undefined) {
                var title = this.titleForSection(section_index);
                if (title != "") {
                    var headerSize = this.sizeForSectionHeader(section_index);
                    var title_div = document.getElementById(this.id + "_section" + section_index + "Title");
                    if (title_div!=undefined) {
                        title_div.setAttribute("style", "padding:0px;left:0px;top:" + item_y + "px;width:" + headerSize[0] + "px;height:" + headerSize[1] + "px;position:absolute;background-color:#3b80c7;text-color:white;color:white;"); //rgb(47, 106, 187)
                    }
                    item_y += parseInt(headerSize[1]);
                }
            } else {
                var view = this.findViewNamed(this.id + "_section" + section_index + "Title");
                if (view!=undefined) {
                    view.item_y = item_y;
                    item_y += parseInt(view.size[1]);
                }

            }
            for (var i = 1; i <= nbItems; i++) {


                var cell = document.getElementById(this.id + "_section" + section_index + "Cell" + i);

                var cellSize = this.sizeForItemIndex(section_index, i);
                var extraSize = this.extraSizeRequested(section_index,i);
                cellSize[0] = cellSize[0] + extraSize[0];
                cellSize[1] = cellSize[1] + extraSize[1];

                cell.setAttribute("style", "left:0px;top:" + item_y + "px;width:" + cellSize[0] + "px;height:" + cellSize[1] + "px;position:absolute;");
                item_y += parseInt(cellSize[1]);

            }

        }

    },


    reloadData : function () {
        this.Items = new Array();

        this.getDiv().style.backgroundColor = this.backgroundColor();
        this.getDiv().style.outline = 'none';

        for (var j = this.Items.length - 1; j == 0; j--) {
            var item = this.Items[j];
            if (item != null) {
                try {
                    this.getDiv().removeChild(item.obj.getDiv());
                } catch (e) { throw e; }
                item.obj = null;
                this.Items.pop();
            }
        }
        while (this.getDiv().hasChildNodes()) {
            this.getDiv().removeChild(this.getDiv().lastChild);
        }


        var item_y = 0;
        var ptrthis = this;

        this.scrollContainer = document.createElement('div');

        //this.getDiv().appendChild(this.scrollContainer);

        //this.getDiv().style.overflow = 'hidden';
        var nbSections = this.numberOfSections();
        for (var section_index = 1; section_index <= nbSections; section_index++) {

            var nbItems = this.numberOfItemsForSection(section_index);
            if (nbItems == 0) continue;


            if (this.customHeaderCell == undefined) {
                var title = this.titleForSection(section_index);
                if (title != "") {
                    var headerSize = this.sizeForSectionHeader(section_index);
                    var title_div = document.createElement("div");
                    title_div.id = this.id + "_section" + section_index + "Title";
                    // background-color:#3b80c7;
                    title_div.setAttribute("style", "background-color:blue;padding:0px;left:0px;top:" + item_y + "px;width:" + headerSize[0] + "px;height:" + headerSize[1] + "px;position:absolute;text-color:white;color:white;"); //rgb(47, 106, 187)
                    item_y += parseInt(headerSize[1]);
                    title_div.innerHTML = "&nbsp;" + title;

                    // SCROLLFIX this.getDiv().appendChild(title_div);
                    //this.scrollContainer.appendChild(title_div);
                    this.getDiv().appendChild(title_div);

                    title_div = null; // leak if not freed ?
                }
            } else {
                var customH = new MentatJS.View();
                customH.size = this.sizeForSectionHeader(section_index);
                customH.item_y = item_y;
                item_y += parseInt(customH.size[1]);
                customH.boundsForView = function (parentBounds, oldBounds) {
                    return {
                        x: 0,
                        y: this.item_y,
                        width: this.size[0],
                        height: this.size[1],
                        unit: 'px',
                        position: 'absolute'
                    };
                };
                customH.viewWasAttached = function () {
                    //this.div.style.backgroundColor = 'rgb(47,106,187)';
                    //this.div.style.color = 'white';
                };
                customH.initView(this.id + "_section" + section_index + "Title");
                this.attach(customH);
                this.customHeaderCell(customH, section_index);

                // add row margin
                item_y += this.rowMargin(section_index,-1);
            };

            for (var i = 1; i <= nbItems; i++) {


                var cell = document.createElement("div");
                cell.id = this.id + "_section" + section_index + "Cell" + i;
                var cellSize = this.sizeForItemIndex(section_index, i);
                cell.setAttribute("style", "left:0px;top:" + item_y + "px;width:" + cellSize[0] + "px;height:" + cellSize[1] + "px;position:absolute;");
                item_y += parseInt(cellSize[1]);

                var item = this.itemForIndex(section_index, i);
                // TODO+ check is View ?
                item.cellSize = cellSize;
                item.boundsForView = function (parentBounds,oldBounds) {
                    return {
                        x:0,
                        y:0,
                        width:this.cellSize[0],
                        height: this.cellSize[1],
                        unit:'px',
                        position:'absolute'
                    };
                }
                item.bounds = item.boundsForView(null,null);
                if (item.getDiv() == null)
                    throw "An Item in a collection must contain a div. (Subclass View)";

                cell.appendChild(item.getDiv());
                if (item.viewWasAttached != undefined) {
                    item.bounds = item.boundsForView(this.parentView.bounds,null);
                    item.viewWasAttached();
                    item.doResize();
                }
                var storeItem = new ListItem();
                if (this.isObjectSelected(section_index, i) == true) {
                    cell.style.backgrounColor = 'rgb(173, 216, 230)';
                    storeItem.Selected = true;
                }

                storeItem.obj = item;
                storeItem.section = section_index;
                storeItem.index = i;
                this.Items.push(storeItem);


                var rowID = cell.id;
                cell.section_index = section_index;
                cell.item_index = i;
                cell.ptr = this;
                cell.addEventListener('click',function (e) {
                    this.ptr.onItemClick(e.ctrlKey, e.shiftKey, this.id, this.section_index, this.item_index);
                });

                this.getDiv().appendChild(cell);

                if (this.dataDelegate!=null) {
                    if (this.dataDelegate['listViewCellWasAttached']!=undefined) {
                        this.dataDelegate['listViewCellWasAttached'](this, item, section_index, i);
                    }
                }

                //this.scrollContainer.appendChild(cell);

                cell = null;

                item_y += this.rowMargin(section_index,i);
            }


        }

        this.scrollContainer.style.width = this.getDiv().style.width;
        this.scrollContainer.style.height = item_y + "px";



    },


    viewDidLoad : function () {

        if (this.getDiv() != null) {

            if (this.NoTabIndex==false)
                this.getDiv().tabIndex = '-1';


            this.getDiv().style.overflowY = 'auto';
            this.getDiv().style.overflowX = 'hidden';


        }

        this.getDiv().ViewCtrl = this;

        this.Items = new Array();
        this.DataSource = new MentatJS.DataSource();


        this.reloadData();
    }








});


function listview_handleDoubleClick(e) {

    if (e.currentTarget.ViewCtrl != null) {

        if (e.currentTarget.ViewCtrl.onDoubleClick!=null){
            e.currentTarget.ViewCtrl.onDoubleClick();
        }

    }


};

function listview_handleKeyUp(e) {


    var section = 0;
    var index = 0;

    if ((e.keyCode == 38) || (e.keyCode == 40)) {

        var arr = e.currentTarget.ViewCtrl.GetSelectedItems();

        if (arr.length > 0) {
            section = arr[0].section;
            index = arr[0].index;

            if (e.keyCode == 38) {
                if (index > 1) {
                    index = index - 1;
                } else {
                    if (section > 1) {
                        section = section - 1;
                        index = e.currentTarget.ViewCtrl.numberOfItemsForSection(section);
                    } else {
                        return;
                    }
                }
            } else if (e.keyCode == 40) {

                if (index < e.currentTarget.ViewCtrl.numberOfItemsForSection(section)) {
                    index++;
                } else {

                    if (section + 1 <= e.currentTarget.ViewCtrl.numberOfSections()) {
                        section++;
                        index = 1;
                    } else {
                        return;
                    }
                }
            }


            e.currentTarget.ViewCtrl.ClearSelection();
            e.currentTarget.ViewCtrl.onItemClick(false, false, e.currentTarget.ViewCtrl._ID + "_section" + section + "Cell" + index, section, index);

        }


        e.preventDefault();
        e.stopPropagation();
        e.returnValue = false;
    }

};