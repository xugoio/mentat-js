

MentatJS.DropdownSearch = MentatJS.View.extend({

    dataSource: null,
    selectedItem: null,
    selectedCell: null,

    // list fns

    alphabetSectionForObjectAtIndex: function (item) {
        return ' ';
    },
    cellForObjectAtIndex: function (item) {
        return new MentatJS.View();
    },

    cellForNoSelection: function () {
        return new MentatJS.View();
    },


    itemSelected: function (item) {
        this.button.setToggled(false);

        this._onDisplayList();
        if (this.actionDelegate!=undefined) {
            this.actionDelegate[this.actionDelegateEventName](this,this.selectedItem);
        }
    },

    _drawSelectedCell: function () {
        this.selectedCell.detachAllChildren();
        var cell = null;
        if (this.selectedItem!=null) {
            cell = this.cellForObjectAtIndex(this.selectedItem);
        } else {
            cell = this.cellForNoSelection();
        }
        // override all click events on the cell
        this.selectedCell.attach(cell);

        MentatJS.applyClickThrough(this.selectedCell, this, "_cellClickThrough");


    },
    _cellClickThrough: function () {
        this.button.onClickEvent();

    },

    viewWillLoad: function () {
        this.selectedItem = null;
        this.selectedCell = new MentatJS.View();
        this.button = new MentatJS.Button();
        this.pane = new MentatJS.View();

    } ,
    viewWasAttached: function () {
        this.button.boundsForView = function (parentBounds, oldBounds) {
            return {
                x: 0,
                y: 0,
                width: parentBounds.width,
                height: 30,
                unit: 'px',
                position: 'absolute'
            };
        };
        this.button.parent = this;
        this.button.useDiv = true;
        this.button.initView(this.id + ".button");
        this.button.setActionDelegate(this, '_onDisplayList');
        this.button.isToggle = true;
        this.attach(this.button);
        this.button.setText('<div style="float:right;"><i class="fa fa-sort"/>&nbsp;&nbsp;&nbsp;</div>');

        this.selectedCell.boundsForView = function (parentBounds, oldBounds) {
            return {
                x: 15,
                y: 5,
                width: parentBounds.width - 30,
                height: 20,
                unit: 'px',
                position: 'absolute'
            };
        };
        this.selectedCell.parent = this;
        this.selectedCell.initView(this.id + ".view");
        //this.selectedCell.setActionDelegate(this, '_onDisplayList');
        this.attach(this.selectedCell);
        this.selectedCell.getDiv().pointerEvents = 'none';
        //this.selectedCell.getDiv().pointer = ''

        /*
        this.selectedCell.setActionDelegate(this,'_cellClickThrough');
        var ptr = this.selectedCell;
        this.selectedCell.onClickEvent = function (sender) {
            if (ptr.actionDelegate != null) {
                ptr.actionDelegate[ptr.actionDelegateEventName](ptr,'onclick');
            }
        };

        addEventListener(this.selectedCell.getDiv(), 'click', this.selectedCell.onClickEvent);
        addEventListener(this.selectedCell.getDiv(), 'mouseover', function (e) {
            this.style.cursor = 'pointer';
        });
        addEventListener(this.selectedCell.getDiv(), 'mouseout', function (e) {
            this.style.cursor = '';
        });
        */
        this._drawSelectedCell();



        this.pane.boundsForView = function (parentBounds,oldBounds) {
            return {
                x: 30/2,
                y: 30,
                width: parentBounds.width - 30,
                height: 150,
                unit: 'px',
                position: 'absolute'
            };
        };
        this.pane.viewWillLoad = function () {
            this.search = new MentatJS.TextField();
            this.list = new MentatJS.ListView();
        };

        this.pane.viewWasAttached = function () {
            this.getDiv().style.border = '2px solid rgb(50, 192, 247)';
            this.getDiv().style.backgroundColor = 'white';
            this.setLayerHeight(9999);

            this.search.iconText = '<i class="fa fa-search"/>';
            this.search.boundsForView = function (parentBounds, oldBounds) {
                return {
                    x: 2,
                    y: 2,
                    width: parentBounds.width - 4,
                    height: 30,
                    unit: 'px',
                    position: 'absolute'
                };
            };
            this.search.initView(this.id + ".search");
            this.attach(this.search);

            this.list.parentView = this;
            this.list.boundsForView = function (parentBounds, oldBounds) {
                return {
                    x: 0,
                    y: 34,
                    width: parentBounds.width,
                    height: parentBounds.height - 34,
                    unit: 'px',
                    position: 'absolute'
                };
            };
            this.list.parent = this;
            this.list.singleSelection = true;
            this.list.alphabetSectionForObjectAtIndex = function (item) {
                return this.parentView.parentView.alphabetSectionForObjectAtIndex(item);
            };
            this.list.sizeForSectionHeader = function (section) {
                return [this.parentView.bounds.width,20];
            };
            this.list.sizeForItemIndex = function (section,item) {
                return [this.parentView.bounds.width,20];
            };
            this.list.itemForIndex = function (section,index) {
                var item = this.objectForItemIndex(section,index);
                return this.parentView.parentView.cellForObjectAtIndex(item);
            };
            this.list.selectionMayHaveChanged = function () {
                var arr = this.GetSelectedObjects();
                if (arr.length>0) {
                    this.parentView.parentView.selectedItem = JSON.parse(JSON.stringify(arr[0]));
                    this.parentView.parentView.itemSelected(this.parentView.parentView.selectedItem);

                } else {
                    this.parentView.parentView.selectedItem = null;
                }
            };
            this.list.initView(this.id + "_lst");
            this.list.DataSource = this.parentView.dataSource;
            this.attach(this.list);

            this.parentView._drawSelectedCell();

        };
        this.pane.parentView = this;
        this.pane.initView(this.id + ".pane");
        this.attach(this.pane);
        this.pane.setVisible(false);

    },

    _onDisplayList: function () {
        this.pane.setVisible(this.button.isToggled);
        if (this.button.isToggled==true) {

            this.pane.list.reloadData();


        } else {
            this._drawSelectedCell();
        }
    }


});