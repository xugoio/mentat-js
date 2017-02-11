# mentat-js

MentatJS is a javascript library for the creation of Single Page Applications.

Features:
- No dependencies
- No build steps
- Module loading


GET STARTED

1. MyApplication

Create a new javascript file MyApplication.js:


```javascript
MyApplication = MentatJS.Application.extend({

    applicationWillStart: function () {
        // add code here
    }
});
```

and hook up the onload event

```javascript
var _myApp = null;
window.onload = function () {
    _myApp = new MyApplication();
    _myApp.launch();
};
```

2. Define a new View and its Controller

Create the file MyView.js:
```javascript
MentatJS.declare("MyView", function () {
    MyView = MentatJS.View.extend({
        boundsForView: function (parentBounds) {
            return MentatJS.fillParentBounds(parentBounds);
        },

        viewWasAttached: function () {
            this.label = new MentatJS.Label();
            this.label.boundsForView = function (parentBounds) {
                return {
                    x: 0,
                    y: parentBounds.height - 11,
                    width: parentBounds.width,
                    height: 11,
                    unit: "px",
                    position: "absolute"
                };
            };
            this.label.textAlignment = 'center';
            this.label.initView(this.id + ".label");
            this.attach(this.label);
        }
    });
});
```

the view declaration is done by the the code
```javascript
MyView = MentatJS.View.extend({

});
```

we define its position with boundsForView which should return the view boundaries
```javascript
boundsForView: function (parentBounds) {
    return {
        x: 0,
        y: 0,
        width: parentBounds.width,
        height: parentBounds.height,
        unit: "px",
        position: "absolute"
    };
}
```

as we want to use all the space from the rootView ( created automatically by the call MyApplication.launch() ),
we just use the utility function MentatJS.fillParentBounds()

```javascript
boundsForView: function (parentBounds) {
            return MentatJS.fillParentBounds(parentBounds);
        }
```


we override the function viewWasAttached which is called after our view is attached to the rootView; and we create a
label centered in the middle

```javascript
this.label = new MentatJS.Label();
this.label.boundsForView = function (parentBounds) {
                return {
                    x: 0,
                    y: parentBounds.height - 11,
                    width: parentBounds.width,
                    height: 11,
                    unit: "px",
                    position: "absolute"
                };
};
this.label.textAlignment = 'center';
this.label.initView(this.id + ".label");
this.attach(this.label);
```

here we set the label's text to be aligned in the center
and we initialise and give it an id based on the view id and by adding ".label" to it.

finally, we attach the label to our view.

We enclose our code with MentatJS.declare as to allow the view to be loaded at runtime


Now lets create the Controller:
Create the file MyViewController.js:

```javascript
MentatJS.declare("MyViewController", function () {
    MyViewController = MentatJS.ViewController.extend({
        viewForViewController: function () {
            return new MyView();
        },

        viewWasPresented: function () {
            this.view.label.setText("HELLO WORLD!");
        }
    });
});
```

the ViewController is loaded by the NavigationController,
we specify which view to use by overriding viewForViewController:
```javascript
viewForViewController: function () {
    return new MyView();
}
```

and finally we override viewWasPresented which is called when the view is displayed on the screen; and set the label's text
```javascript
viewWasPresented: function () {
    this.view.label.setText("HELLO WORLD")
}
```



3. Load our View and Controller

lets return to our MyApplication.js file  and load our V/VC.

```javascript
MyApplication = MentatJS.Application.extend({

    applicationWillStart: function () {
        this.navigationController.loadViewController(
                    { class: 'MyViewController', id: 'MyViewController' },
                [
                    { id: 'MyView', uri:'MyView.js'},
                    { id : "MyViewController", uri:'MyViewController.js'}
                ], this);
    },

    viewControllerWasLoadedSuccessfully : function (vc) {
        this.navigationController.present(vc, {animated: false});
    }

});

var _myApp = null;
window.onload = function () {
    _myApp = new MyApplication();
    _myApp.launch();
};

```

In applicationWillStart, we ask the navigationController to load our view controller and its view
```javascript
this.navigationController.loadViewController(
                    { class: 'MyViewController', id: 'MyViewController' },
                [
                    { id: 'MyView', uri:'MyView.js'},
                    { id : "MyViewController", uri:'MyViewController.js'}
                ], this);
```

the first parameter is the view controller class we want to instantiate and the unique id we want to give it.<br/>
the second parameter is an array of the files to load, the id must match the id given by the MentatJS.declare call
the third parameter is the delegate object which should implement the function viewControllerWasLoadedSuccessfully.
<br/>
viewControllerWasLoadedSuccessfully is called when MentatJS.declare is called for every file specified in the second parameter of the call loadViewController
<br/>
Here we tell the navigation controller to present the view on the web page.<br/>
```javascript
this.navigationController.present(vc, {animated: false});
```


4. BRINGING IT ALL TOGETHER

Finally, we just add the mentat.js library and our MyApplication.js file to HTML page

```html
<script type="text/javascript" src="../../mentat.min.js"></script>

<script type='text/javascript'>
    <!--
    document.write("<script type='text/javascript' src='MyApplication.js?v=" + Date.now() + "'><\/script>");
    -->
</script>
```

