
MentatJS.DownloadData = function (uri,callback,errorCallback) {

    if (!!window.Worker) {

        var worker = new Worker("FrameworkUI/dev/Workers/Download.js");
        worker.onmessage = function (event) {
            callback(event.data);
        };
        worker.onerror = function (event) {
            var o = event.message;
            errorCallback(event);
        };

        worker.postMessage(uri);

    } else {
        var xmlHttpReq = createXMLHttpRequest();
        xmlHttpReq.open("GET", uri, false);
        xmlHttpReq.send(null);
        callback(xmlHttpReq.responseText);

    }

};


MentatJS.PostDataWithDelegate = function (dataID, uri, postData, delegate) {

    var json = JSON.stringify(postData);



    if (!!window.Worker) {
        var worker = new Worker("FrameworkUI/dev/Workers/Post.js");
        worker.onmessage = function (event) {
            delegate.dataWasPosted(dataID,event.data);
        };
        worker.onerror = function (event) {
            var o = event.message;
            delegate.couldNotPostData(dataID,event);
        };
        var obj = {};
        obj.uri = uri;
        obj.postData = json;
        worker.postMessage(obj);
    } else {
        var xmlHttpReq = createXMLHttpRequest();
        xmlHttpReq.open("POST", uri, true);
        xmlHttpReq.setRequestHeader("Content-type", "application/json");
        //xmlHttpReq.setRequestHeader("Content-length", json.length);
        xmlHttpReq.send(json);
        delegate.dataWasPosted(dataID,xmlHttpReq.responseText);
    }

};


MentatJS.DownloadDataWithDelegate = function (dataID, uri, delegate) {

    if (!!window.Worker) {

        var worker = new Worker("FrameworkUI/dev/Workers/Download.js");
        worker.onmessage = function (event) {
            delegate.dataWasDownloaded(dataID,event.data);
        };
        worker.onerror = function (event) {
            var o = event.message;
            delegate.couldNotDownload(dataID,event);
        };
        worker.postMessage(uri);

    } else {
        var xmlHttpReq = createXMLHttpRequest();
        xmlHttpReq.open("GET", uri, false);
        xmlHttpReq.send(null);
        delegate.dataWasDownloaded(dataID,xmlHttpReq.responseText);

    }

};


MentatJS.PutDataWithDelegate = function (dataID, uri, putData, delegate) {
    if (!!window.Worker) {

        var worker = new Worker("FrameworkUI/dev/Workers/Put.js");
        worker.onmessage = function (event) {
            delegate['dataWasPut'](dataID,event.data);
        };
        worker.onerror = function (event) {
            var o = event.message;
            delegate['couldNotPut'](dataID,event);
        };
        var obj = {};
        obj.uri = uri;
        obj.putData = putData;
        worker.postMessage(obj);

    } else {
        var xmlHttpReq = createXMLHttpRequest();
        xmlHttpReq.open("PUT", uri, false);
        xmlHttpReq.send(null);
        delegate['dataWasPut'](dataID,xmlHttpReq.responseText);

    }
};


MentatJS.LoadScript = function (dataID, uri) {

    var tag = document.createElement("script");
    tag.src = uri;
    document.getElementsByTagName("head")[0].appendChild(tag);

};

MentatJS.declare = function (scriptID, fn) {

    fn();
    MentatJS.Application.instance.downloadCache.push(scriptID);

    for ( var i = 0; i < MentatJS.Application.instance.downloadStack.length; i++) {
        var stack = MentatJS.Application.instance.downloadStack[i];
        if (stack.counter>0) {
            if (stack.files.contains(scriptID)) {
                stack.counter--;
                if (stack.counter==0) {
                    stack.navigationController._initViewController(stack);
                }
            }
        }


    }


}