


MentatJS.ViewAnimationKey = class {
    view =  null;
    easingFunction= MentatJS.Easing.easeLinear;
    duration= 300;
    transform= 'translateX';
    startValue= 0;
    endValue= 0;
    direction= 1;
    offset= 0;

    executeOnStart  () {

    }

    drawFrame (x) {
        var newposition = this.startValue + this.direction * ((this.endValue - this.startValue) * x);
        if (this.startValue>this.endValue) {
            newposition = this.startValue + this.direction * ((this.startValue - this.endValue) * x);
        }
        var newTransform = this.transform + "(" + newposition + "px)";
        this.view.getDiv().style.transform = newTransform;
    }


};




MentatJS.Animation = class {
    id = '';
    keys = [];
    activeKeys =  [];
    delegate = null;

    initWithDelegate (_id, _delegate) {
        this.id = _id;
        this.delegate = _delegate;
        this.keys = new Array();
        this.activeKeys = new Array();
    }


    pushAnimationKey (viewAnimation) {
        if (this.keys['key' + viewAnimation.offset] == undefined) {
            this.keys['key' + viewAnimation.offset] = [];
        }
        this.keys['key' + viewAnimation.offset].push(viewAnimation);
    }

    startPlaying () {

        this.activeKeys = [];
        this.stopping = false;
        this.milliKey = -1;

        this.fps = 60;
        this.fpsInterval = 0;
        this.startTime = window.performance.now();
        this.now = 0;
        this.then = 0;
        this.elapsed = 0;

        this.fpsInterval = 1000 / this.fps;
        this.then = window.performance.now();
        this.startTime = this.then;

        this.totalElapsed = 0;

        if (this.keys['key0']!=undefined) {
            if (this.keys['key0'].length>0) {
                for ( var  i = 0; i < this.keys['key0'].length; i++) {
                    this.activeKeys.push(this.keys['key0'][i]);
                }
            }
        }
        this.endOfAnimation = -1;


        for (var x in this.keys) {

            if (this.keys[x]!=undefined) {
                // is it an array ?
                if (Array.isArray(this.keys[x])) {
                    for (var i = 0; i < this.keys[x].length; i++) {
                        if (this.keys[x][i] == undefined) {
                            console.log('error key is broken');
                            console.dir(this.keys[x][i]);
                        }
                        if (this.keys[x][i].offset + this.keys[x][i].duration > this.endOfAnimation) {
                            this.endOfAnimation = this.keys[x][i].offset + this.keys[x][i].duration;
                        }
                    }
                }
            }


        }

        this.animate();
    }


    animate () {
        var ptr = this;
        this.now = window.performance.now();
        this.elapsed = this.now - this.then;
        this.totalElapsed = Math.floor(this.now - this.startTime);
        if (this.totalElapsed>10500) {
            if (this.delegate!=null) {
                if (this.delegate.animationDidFinish!=undefined) {
                    this.delegate.animationDidFinish(this.id);
                }
            }
        }

        if (this.elapsed > this.fpsInterval) {
            this.then = this.now - (this.elapsed % this.fpsInterval);
            this.drawFrame();
        }

        if (this.totalElapsed > this.endOfAnimation) {

            if (this.delegate!=null) {
                if (this.delegate.animationDidFinish!=undefined) {
                    this.delegate.animationDidFinish(this.id);
                }
            }
            return;
        }
        requestAnimationFrame(function () {
            ptr.animate();
        });
    }

    drawFrame () {
        for ( var i = 0; i < this.activeKeys.length; i++) {
            var k = this.activeKeys[i];
            var expectedEnd = Math.floor(this.startTime + k.offset + k.duration );
            var t = window.performance.now() - this.startTime + k.offset;
            var x = this.totalElapsed/expectedEnd;
            var d = k.duration;
            var b = 0;
            var c = 1;
            var value = k.easingFunction(x,t,b,c,d);

            k.drawFrame(value);

            if (t>d) {
                k.drawFrame(1.000);
                this.activeKeys.splice(i,1);
                i = 0;
            }
        }

    }
    
};

