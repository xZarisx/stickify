(function () {
    'use strict';

    let polyfilled = false;

    if (typeof window.CustomEvent !== "function") {

        function CustomEvent$1(event, params = { bubbles: false, cancelable: false, detail: undefined }) {
            var evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        }

        CustomEvent$1.prototype = window.Event.prototype;

        window.CustomEvent = CustomEvent$1;

        polyfilled = true;
    };

    function emitter(element, evName, data) {
        return element.dispatchEvent(new CustomEvent(evName, { bubbles: true, detail: data }));
    }

    function isInView(element) {
        var bounds = element.getBoundingClientRect();

        return element.offsetParent !== null && bounds.bottom >= 0 && bounds.top <= window.innerHeight && bounds.right >= 0 && bounds.left <= window.innerWidth;
    }

    let isWatching = false;
    let initialized = false;
    let watchedItems = [];
    let standardEvents = ['load', 'scroll', 'hashchange', 'touchend', 'resize'];
    let customEvents = [];
    let registerWatchListChange = function () {

        if (watchedItems.length > 0 && !isWatching) {
            attach();
        } else if (watchedItems.length === 0 && isWatching) {
            detach();
        }
    };
    let attach = function () {
        isWatching = true;
        standardEvents.concat(customEvents).forEach(ev => window.addEventListener(ev, checkItems));
    };
    let detach = function () {
        isWatching = false;
        standardEvents.concat(customEvents).forEach(ev => window.removeEventListener(ev, checkItems));
    };
    let checkItem = function (item) {
        var inview = isInView(item.element);

        if (item.status === 'in' && !inview) {
            emitter(item.element, "in-stalk.out");
            emitter(item.element, item.element.getBoundingClientRect().bottom < 0 ? 'in-stalk.out.top' : 'in-stalk.out.bottom');
            item.status = 'out';
        } else if (item.status === 'out' && inview) {
            emitter(item.element, "in-stalk.in");
            emitter(item.element, item.element.getBoundingClientRect().top < 0 ? 'in-stalk.in.top' : 'in-stalk.in.bottom');
            item.status = 'in';
        } else if (item.status === 'new') {
            item.status = inview ? 'in' : 'out';

            if (inview) {
                emitter(item.element, "in-stalk.in");
            }
        }
    };
    let checkItems = function () {
        initialized = true;
        watchedItems.forEach(checkItem);
    };
    var inStalk = {

        // add element to stalk list
        add: function (element) {
            var config = {
                element: element,
                status: 'new'
            };

            watchedItems.push(config);

            if (initialized) {
                checkItem(config);
            }

            registerWatchListChange();
        },

        // remove an element from stalk list
        remove: function (element) {
            var newlist = watchedItems.filter(item => item.element !== element);

            if (newlist.length !== watchedItems.length) {
                watchedItems = newlist;
                registerWatchListChange();
                return true;
            }

            return false;
        },

        listenFor: function (eventName) {
            detach();
            customEvents = customEvents.filter(ev => ev !== eventName).concat(eventName);
            registerWatchListChange();
        },

        ignore: function (eventName) {
            detach();
            customEvents = customEvents.filter(ev => ev !== eventName);
            registerWatchListChange();
        },

        check: checkItems

    };

    var stickyArray = [];
    var boxCheck = function (sticky, watch, buffer) {
        if (watch.getBoundingClientRect().top < 0 && watch.getBoundingClientRect().bottom > buffer) {
            sticky.classList.add('is-sticky');
        } else {
            sticky.classList.remove('is-sticky');
        }
    };
    var checkEach = function (event) {
        var target = event.target;

        stickyArray.filter(function (stickyObj) {
            return stickyObj.watch === target;
        }).map(function (stickyObj) {
            boxCheck(stickyObj.sticky, stickyObj.watch, stickyObj.buffer);
        });
    };
    window.addEventListener('in-stalk.in.top', checkEach);
    window.addEventListener('in-stalk.out.top', checkEach);
    window.addEventListener('in-stalk.in.bottom', checkEach);
    window.addEventListener('in-stalk.out.bottom', checkEach);

    function stickify(stickyElement, elementWatch = stickyElement, buff = 50) {
        inStalk.add(elementWatch);
        stickyArray.push({
            sticky: stickyElement,
            watch: elementWatch,
            buffer: buff
        });
    }

    stickify();
})();