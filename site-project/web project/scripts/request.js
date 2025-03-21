export function sendRequest(url,options, successCallback,failCallback) {

    var request = new XMLHttpRequest();

    request.open(options.method, url, true);
    request.setRequestHeader('Content-Type', options.contentType);
    
    if(options.method === 'GET') {
        request.send();
    }
    else if(options.method === 'POST') {
        request.send(options.params);
    }

    request.addEventListener("load", function () {
        if (request.readyState === 4 && request.status === 200) {
            var response = request.responseText;
            successCallback(response);
        } else {
            failCallback();
        }
    });
}