


MentatJS.CollectionView = MentatJS.View.extend({

    dataSource: null,


    Items: null,
    singleSelection: false,
    noSelection: false,
    direction: 'vertical',

    cell_default_width: function (index) { return 64; },
    cell_default_height: function (index) { return 64; },

    reloadData: function () {
        this.subViews = new Array();
        this.Items = new Array();
        while (this.getDiv().hasChildNodes()) {
            this.getDiv().removeChild(this.getDiv().firstChild);
        }

        if (this.dataSource === null) {
            return;
        }

        // how many items do we have to show?
        var count = this.dataSource.numberOfItems();

        var currentRow = 0;
        var currentCol = 0;

        for (var idx = 0; idx < count; idx++) {
            // default width of cell
            var width = this.cell_default_width(idx);
            var height = this.cell_default_height(idx);

            itemObj = { index: idx, Selected: false};
            this.Items.push(itemObj);

            var cell = new MentatJS.View();
            cell.idx = idx;
            cell.currentRow = currentRow;
            cell.currentCol = currentCol;
            cell.cell_width = width;
            cell.cell_height = height;
            cell.itemObj = itemObj;
            cell.boundsForView = function (parentBounds, oldBounds) {
                let x = this.currentCol*this.cell_width;
                let y = this.currentRow*this.cell_height;
                let width = this.cell_width;
                let height = this.cell_height;
                return {
                    x: x,
                    y: y,
                    width: width,
                    height: height,
                    unit: 'px',
                    position: 'absolute'
                };
            };

            cell.initView(this.id + ".cell" + idx);
            this.attach(cell);
            cell.getDiv().collectionPtr = this;
            cell.getDiv().item_index = idx;
            cell.getDiv().addEventListener('click',function (e) {

                this.collectionPtr.onItemClick(e.ctrlKey, e.shiftKey, this.id, this.item_index);
            });
            this.cellWasAdded(cell,cell.idx,cell.itemObj);

            if (this.direction === 'vertical') {
                currentCol += 1;
                if ((currentCol)*width+width >= this.bounds.width) {
                    currentRow++;
                    currentCol = 0;
                }
            } else if (this.direction=='horizontal') {
                currentRow+= 1;
                if ((currentRow)*height+height >= this.bounds.height) {
                    currentCol++;
                    currentRow = 0;
                }
            }

        }



    },


    objectSelectionChanged: function (index,selected) {
        console.log('uicollectionview objectSelectionChanged');
    },

    onItemClick: function (ctrlKey,shiftKey,cellID, cellIndex) {

        var color = '';

        //var arr = window.top.$.grep(this.Items, function (o) { return ((o.section == section_index) && (o.index == item_index)); });

        if (this.noSelection) return;

        var arr = null;


        for ( var i = 0; i < this.Items.length; i++) {
            if ((this.Items[i].index == cellIndex)) {
                arr = [this.Items[i]];
            }
        }


        var selected = false;

        if (this.singleSelection==false) {
            ctrl = true;
            shift = false;
        } else {
            ctrl = false;
            shift = false;
        }

        if ((ctrl == true) && (shift == false)) {
            // ADD A ROW TO THE SELECTION
            //color = window.top.$(document.getElementById(rowID)).css("background-color");
            color = document.getElementById(cellID).style.backgroundColor;
            if (color == "rgb(173, 216, 230)") {
                //window.top.$(document.getElementById(rowID)).css({ "background-color": "transparent" });
                document.getElementById(cellID).style.backgroundColor = 'transparent';
                if (arr.length > 0) {
                    arr[0].Selected = false;
                    selected = false;
                }
            } else {
                //window.top.$(document.getElementById(rowID)).css({ "background-color": "rgb(173, 216, 230)" });
                document.getElementById(cellID).style.backgroundColor = 'rgb(173,216,230)';
                if (arr.length > 0) {
                    arr[0].Selected = true;
                    selected = true;
                }
            }
            this.objectSelectionChanged(cellIndex, selected);
        }
        else if ((ctrl == false) && (shift == false)) {
            // REMOVE SELECTION AND SELECT THIS ROW
            for (var i = 0; i < this.Items.length; i++) {
                if ((this.Items[i].index == cellIndex)) continue;
                //$('#' + this._ID + "_section" + this.Items[i].section + "Cell" + this.Items[i].index).css({ "background-color": "transparent" });
                document.getElementById(this.id + "_cell" + this.Items[i].index).style.backgroundColor = 'transparent';
                this.Items[i].Selected = false;
                this.objectSelectionChanged(this.Items[i].index, this.Items[i].Selected);
            }
            //color = window.top.$(document.getElementById(rowID)).css("background-color");
            color = document.getElementById(cellID).style.backgroundColor;

            if (color == "rgb(173, 216, 230)") {
                //$(document.getElementById(rowID)).css({ "background-color": "transparent" });
                document.getElementById(cellID).style.backgroundColor = 'transparent';
                if (arr.length > 0) {
                    arr[0].Selected = false;
                    selected = false;
                }
            } else {
                //$(document.getElementById(rowID)).css({ "background-color": "rgb(173, 216, 230)" });
                document.getElementById(cellID).style.backgroundColor = 'rgb(173, 216, 230)';

                if (arr.length > 0) {
                    arr[0].Selected = true;
                    selected = true;
                }
            }
            this.objectSelectionChanged(cellIndex, selected);

        }
        else if ((ctrl == false) && (shift == true)) {
            // RANGE SELECTION
            var index = -1;
            var reverse = false;
            for (var i = 0; i < this.Items.length; i++) {
                if (index == -1) {
                    if (this.Items[i].Selected == true) {
                        index = i;

                        if (this.Items[i].index > cellIndex) {
                            reverse = true;
                            break;
                        }

                    }
                }
                if ((i >= index) && (index > -1)) {

                    //$('#' + this._ID + "_section" + this.Items[i].section + "Cell" + this.Items[i].index).css({ "background-color": "rgb(173, 216, 230)" });
                    document.getElementById(this.id + "_cell" + this.Items[i].index).style.backgroundColor = 'rgb(173, 216, 230)';
                    this.Items[i].Selected = true;
                    this.objectSelectionChanged(this.Items[i].index, this.Items[i].Selected);

                    if ((this.Items[i].index == cellIndex)) {
                        // remove the ones after
                        index = -2;
                    }
                } else
                if (index == -2) {
                    //$('#' + this._ID + "_section" + this.Items[i].section + "Cell" + this.Items[i].index).css({ "background-color": "transparent" });
                    document.getElementById(this.id + "_cell" + this.Items[i].index).style.backgroundColor = 'transparent';
                    this.Items[i].Selected = false;
                    this.objectSelectionChanged(this.Items[i].index, this.Items[i].Selected);
                }
            }

            if (reverse == true) {

                for (var i = index; i >= 0; i--) {

                    //$('#' + this._ID + "_section" + this.Items[i].section + "Cell" + this.Items[i].index).css({ "background-color": "rgb(173, 216, 230)" });
                    document.getElementById(this.id + "_cell" + this.Items[i].index).style.backgroundColor = 'rgb(173, 216, 230)';
                    this.Items[i].Selected = true;
                    this.objectSelectionChanged(this.Items[i].index, this.Items[i].Selected);

                    if ((this.Items[i].index == cellIndex)) {
                        index = -2;
                    }
                    else if (index == -2) {
                        //$('#' + this._ID + "_section" + this.Items[i].section + "Cell" + this.Items[i].index).css({ "background-color": "transparent" });
                        document.getElementById(this.id + "_cell" + this.Items[i].index).style.backgroundColor = 'transparent';
                        this.Items[i].Selected = false;
                        this.objectSelectionChanged(this.Items[i].index, this.Items[i].Selected);
                    }
                }

            }
        }

        // call the action delegate
        if (this.actionDelegate !== null) {
            this.actionDelegate[this.actionDelegateEventName](this)
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

            var obj = this.dataSource.objectForSortedIndex(arr[i].index);
            ret.push(obj);
        }
        return ret;
    },





    cellWasAdded: function (cell,index,item) {

    },

    initView: function (_id) {
        // set the id
        this.id = _id;
        this._div = document.createElement('div');
        this._div.id = _id;
        this.subViews = new Array();
        if (this.viewWillLoad != undefined) {
            this.viewWillLoad();
        }


        // WHY ?
        if (this.controller!=null) {
            if (this.controller.viewWillLoad!=undefined) {
                this.controller.viewWillLoad(this);
            }
        }

        this.reloadData();




        if (this.viewDidLoad != undefined) {
            this.viewDidLoad();
        }
        if (this.controller!=null) {
            if (this.controller.viewDidLoad!=undefined) {
                this.controller.viewDidLoad(this);
            }
        }

    }





});