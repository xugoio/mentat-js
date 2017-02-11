
MentatJS.declare("MainView", function () {

    MainView = MentatJS.View.extend({

        boundsForView: function (parentBounds, oldBounds) {
            return {
                x: 0,
                y: 0,
                width: parentBounds.width,
                height: parentBounds.height,
                unit: 'px',
                position: 'absolute'
            };
        },

        viewWasAttached: function () {

            this.search = new MentatJS.TextField();
            this.list = new MentatJS.ListView();
            this.content = new MentatJS.View();

            this.search.boundsForView = function (parentBounds, oldBounds) {
                return {
                    x: 0,
                    y: 0,
                    width: 340,
                    height: 30,
                    unit: 'px',
                    position: 'absolute'
                };
            };
            this.search.iconText = '&#x1F50D;';
            this.search.initView(this.id + ".search");
            this.attach(this.search);


            this.list.boundsForView = function (parentBounds, oldBounds) {
                return {
                    x: 0,
                    y: 31,
                    width: 340,
                    height: parentBounds.height - 31,
                    unit: 'px',
                    position: 'absolute'
                };
            };
            this.list.SelectionMode = MentatJS.kSingleSelection;
            this.list.SectionnedByLetters = true;
            this.list.alphabetSectionForObjectAtIndex = function (index) {
                var item = this.DataSource.objectForSortedIndex(index);
                return item.lastName[0].toUpperCase();
            }
            this.list.itemForIndex = function (section_index, item_index) {
                var item = this.objectForItemIndex(section_index,item_index);

                var cell = new MentatJS.View();
                cell.item = item;
                cell.boundsForView = function (parentBounds, oldBounds) {
                    return {
                        x: 0,
                        y: 0,
                        width: parentBounds.width,
                        height: parentBounds.height,
                        unit: 'px',
                        position: 'absolute'
                    };
                };
                cell.viewWasAttached = function () {
                    var text = "<b>" + this.item.fullName + "</b> " + this.item.jobTitle + "<p>" + this.item.company + "</p>";
                    this.getDiv().innerHTML = text;
                };
                cell.initView(this.id + ".cell." + section_index + "." + item_index);

                return cell;
            };

            this.list.initView(this.id + ".list");
            this.attach(this.list);


            this.content.boundsForView = function (parentBounds, oldBounds) {
                return {
                    x: 301,
                    y: 0,
                    width: parentBounds.width - 301,
                    height: parentBounds.height,
                    unit: 'px',
                    position: 'absolute'
                };
            };
            this.content.initView(this.id + ".content");
            this.attach(this.content);


        }


    });

});