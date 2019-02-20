function addListener(element, type, callback) {
    if (element.addEventListener) {
        element.addEventListener(type, callback);
    } else if (element.attachEvent) {
        element.attachEvent('on' + type, callback);
    }
}



