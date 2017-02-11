

MentatJS.TableView = MentatJS.View.extend({

    delegate: null,
    viewHeaderContainer: null,
    viewHeader: null,

    viewContentContainer: null,
    viewContent: null,

    dataSource: null,

    setDelegate: function (_delegate) {
        "use strict";
        this.delegate = _delegate;
    },

    heightForHeader: function (tableView) {
        "use strict";
        return 30;
    },
    numberOfColumns: function (tableView) {
        "use strict";
        return 1;
    },

    widthForColumn: function (tableView,index) {
        "use strict";
        return 100;
    },
    titleForColumn: function (tableView,index) {
        "use strict";
        return "COLUMN";
    },
    numberOfRows: function (tableView) {
        "use strict";
        if (this.dataSource !== null) {
            return this.dataSource.numberOfItems();
        }
        return 0;
    },
    heightForRow: function (tableView, index) {
        "use strict";
        return 30;
    },
    cellForPath: function (tableView, cell, path) {
        "use strict";

    },



    viewWillLoad: function () {
        "use strict";
        if (this.delegate === null) {
            this.delegate = this;
        }
    },
    viewWasAttached: function () {
        "use strict";
        //this.reload();
    },


    reload: function () {
        "use strict";
        this.renderUI();
    },


    renderUI: function () {
        "use strict";

        this.viewHeaderContainer = new MentatJS.View();
        this.viewHeaderContainer.tableRef = this;
        this.viewHeaderContainer.boundsForView = function (parentBounds) {
            var headerHeight = (this.parentView.delegate["heightForHeader"] === undefined) ? this.parentView["heightForHeader"](this.tableRef) : this.parentView.delegate["heightForHeader"](this.tableRef);
            return {
                x: 0,
                y: 0,
                width: parentBounds.width,
                height: headerHeight,
                unit: "px",
                position: "absolute"
            };
        };
        this.viewHeaderContainer.viewWasAttached = function () {
            this.getDiv().style.overflowX = 'hidden';

        };
        this.viewHeaderContainer.initView(this.id + ".headerContainer");
        this.attach(this.viewHeaderContainer);

        this.viewHeader = new MentatJS.View();
        this.viewHeader.tableRef = this;
        this.viewHeader.boundsForView = function (parentBounds) {
            var nbCols = (this.tableRef.delegate["numberOfColumns"] === undefined) ? this.tableRef["numberOfColumns"](this.tableRef) : this.tableRef.delegate["numberOfColumns"](this.tableRef);
            var size = 0;
            for (var i = 0; i < nbCols; i++) {
                size += (this.tableRef.delegate["widthForColumn"] === undefined) ? this.tableRef["widthForColumn"](this.tableRef, i) : this.tableRef.delegate["widthForColumn"](this.tableRef, i);
            }
            return {
                x: 0,
                y: 0,
                width: size,
                height: parentBounds.height,
                unit: "px",
                position: "absolute"
            };
        };
        this.viewHeader.viewWasAttached =  function () {
            //this.getDiv().style.backgroundColor = "blue";

            var nbCols = (this.tableRef.delegate["numberOfColumns"] === undefined) ? this.tableRef["numberOfColumns"](this.tableRef) : this.tableRef.delegate["numberOfColumns"](this.tableRef);
            var size = 0;
            for (var i = 0; i < nbCols; i++) {
                var colSize = (this.tableRef.delegate["widthForColumn"] === undefined) ? this.tableRef["widthForColumn"](this.tableRef, i) : this.tableRef.delegate["widthForColumn"](this.tableRef, i);
                var cell = new MentatJS.View();
                cell.columnStart = size;
                cell.columnIndex = i;
                cell.columnWidth = colSize;
                cell.tableRef = this.tableRef;
                cell.boundsForView = function (parentBounds) {
                    return {
                        x: this.columnStart,
                        y: 0,
                        width: this.columnWidth,
                        height: parentBounds.height,
                        unit: "px",
                        position: "absolute"
                    };
                };
                cell.viewWasAttached = function () {
                    var r = Math.floor((Math.random() * 255) + 1);
                    var g = Math.floor((Math.random() * 255) + 1);
                    var b = Math.floor((Math.random() * 255) + 1);
                    this.getDiv().style.backgroundColor = "rgb("+r+","+g+","+b+")";
                    this.getDiv().style.color = "white";
                    this.getDiv().style.borderRight = "1px solid #afafaf";
                    this.label = new MentatJS.Label();
                    this.label.boundsForView = function (parentBounds) {
                        return {
                            x: 5,
                            y: 0,
                            width: parentBounds.width - 10,
                            height: parentBounds.height,
                            unit: "px",
                            position: "absolute"
                        };
                    };
                    this.label.text = (this.tableRef.delegate["titleForColumn"] === undefined) ? this.tableRef["titleForColumn"](this.tableRef, i) : this.tableRef.delegate["titleForColumn"](this.tableRef, i);
                    this.label.fillLineHeight = true;
                    this.label.textAlignment = 'left';
                    this.label.fontColor = "white";
                    this.label.initView(this.id + ".label");
                    this.attach(this.label);
                }
                cell.initView(this.id + ".cell" + i);
                this.attach(cell);
                size += colSize;
            }
        };
        this.viewHeader.dragScroll = true;
        this.viewHeader.scrollCallback = function (event) {
            this.getDiv().style.top = "0px";
            var x = MentatJS._offsetX + event.clientX - MentatJS._startX;
            if (x>=0)
                x = 0;
            if ( x < -this.bounds.width + this.parentView.bounds.width ) {
                x = -this.bounds.width + this.parentView.bounds.width;
            }
            this.getDiv().style.left = x + 'px';

            this.tableRef.viewContent.getDiv().style.left = x + "px";
        };
        this.viewHeader.initView(this.id + ".header");
        this.viewHeaderContainer.attach(this.viewHeader);

        document.onmousedown = MentatJS.onMouseDown;
        document.ontouchstart = MentatJS.onMouseDown;
        document.onmouseup = MentatJS.onMouseUp;
        document.ontouchend = MentatJS.onMouseUp;

        MentatJS._dragElement = this.viewHeader.getDiv();


        this.viewContentContainer = new MentatJS.View();
        this.viewContentContainer.tableRef = this;
        this.viewContentContainer.boundsForView = function (parentBounds) {
            var headerHeight = (this.tableRef.delegate["heightForHeader"] === undefined) ? this.tableRef["heightForHeader"](this.tableRef) : this.tableRef.delegate["heightForHeader"](this.tableRef);
            return {
                x: 0,
                y: headerHeight + 1,
                width: parentBounds.width,
                height: parentBounds.height - headerHeight - 1,
                unit: "px",
                position: "absolute"
            };
        };
        this.viewContentContainer.viewWasAttached = function () {
            this.getDiv().style.overflowX = 'auto';
            this.getDiv().style.overflowY = 'auto';

        };
        this.viewContentContainer.initView(this.id + ".viewContentContainer");
        this.attach(this.viewContentContainer);

        this.viewContent = new MentatJS.View();
        this.viewContent.tableRef = this;
        this.viewContent.boundsForView = function (parentBounds) {
            var nbCols = (this.tableRef.delegate["numberOfColumns"] === undefined) ? this.tableRef["numberOfColumns"](this.tableRef) : this.tableRef.delegate["numberOfColumns"](this.tableRef);
            var size = 0;
            for (var i = 0; i < nbCols; i++) {
                size += (this.tableRef.delegate["widthForColumn"] === undefined) ? this.tableRef["widthForColumn"](this.tableRef,i) : this.tableRef.delegate["widthForColumn"](this.tableRef, i);
            }
            var nbRows = (this.tableRef.delegate["numberOfRows"] === undefined) ? this.tableRef["numberOfRows"](this.tableRef) : this.tableRef.delegate["numberOfRows"](this.tableRef);
            var height = 0;
            for (var j = 0; j < nbRows; j++) {
                height += (this.tableRef.delegate["heightForRow"] === undefined) ? this.tableRef["heightForRow"](this.tableRef,j) : this.tableRef.delegate["heightForRow"](this.tableRef,j);
            }

            return {
                x: 0,
                y: 0,
                width: size,
                height: height,
                unit: "px",
                position: "absolute"
            };
        };
        this.viewContent.initView(this.id + ".content");
        this.viewContentContainer.attach(this.viewContent);

        this.drawCells();

    },

    drawCells: function () {
        "use strict";
        var x = 0,
            y = 0,
            cellStartX = 0,
            cellStartY = 0,
            nbCols = (this.delegate["numberOfColumns"] === undefined) ? this["numberOfColumns"](this) : this.delegate["numberOfColumns"](this),
            nbRows = (this.delegate["numberOfRows"] === undefined) ? this["numberOfRows"](this) : this.delegate["numberOfRows"](this);

        for ( y = 0; y < nbRows; y++ ) {
            var rowHeight = (this.delegate["heightForRow"] === undefined) ? this["heightForRow"](this,y) : this.delegate["heightForRow"](this,y);

            cellStartX = 0;

            for ( x = 0; x < nbCols; x++) {
                var cellWidth = (this.delegate["widthForColumn"] === undefined) ? this["widthForColumn"](this,x) : this.delegate["widthForColumn"](this,x);
                var cell = new MentatJS.View();
                cell.tableRef = this;
                cell.size = [cellWidth, rowHeight];
                cell.origin = [cellStartX, cellStartY]
                cell.row = y;
                cell.col = x;
                cell.boundsForView = function (parentBounds) {
                    return {
                        x: this.origin[0],
                        y: this.origin[1],
                        width: this.size[0],
                        height: this.size[1],
                        unit: "px",
                        position: "absolute"
                    };
                };
                cell.viewWasAttached = function () {
                    if (this.tableRef !== undefined) {
                        if (this.tableRef.delegate["cellForPath"] === undefined) {
                            this.tableRef["cellForPath"](this.tableRef,this, { row: this.row, col: this.col});
                        } else {
                            this.tableRef.delegate["cellForPath"](this.tableRef,this, { row: this.row, col: this.col});
                        }
                    }
                };
                cell.initView(this.id + ".cell[" + y + "][" + x + "]");
                this.viewContent.attach(cell);


                cellStartX = cellStartX + cellWidth;
            }
            cellStartY = cellStartY + rowHeight;
        }



    }



});
