'use strict';

(function () {
    'use strict';

    var polyfilled = false;

    if (typeof window.CustomEvent !== "function") {
        var CustomEvent$1 = function CustomEvent$1(event) {
            var params = arguments.length <= 1 || arguments[1] === undefined ? { bubbles: false, cancelable: false, detail: undefined } : arguments[1];

            var evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        };

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

    var isWatching = false;
    var initialized = false;
    var watchedItems = [];
    var standardEvents = ['load', 'scroll', 'hashchange', 'touchend', 'resize'];
    var customEvents = [];
    var registerWatchListChange = function registerWatchListChange() {

        if (watchedItems.length > 0 && !isWatching) {
            attach();
        } else if (watchedItems.length === 0 && isWatching) {
            detach();
        }
    };
    var attach = function attach() {
        isWatching = true;
        standardEvents.concat(customEvents).forEach(function (ev) {
            return window.addEventListener(ev, checkItems);
        });
    };
    var detach = function detach() {
        isWatching = false;
        standardEvents.concat(customEvents).forEach(function (ev) {
            return window.removeEventListener(ev, checkItems);
        });
    };
    var checkItem = function checkItem(item) {
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
    var checkItems = function checkItems() {
        initialized = true;
        watchedItems.forEach(checkItem);
    };
    var inStalk = {

        // add element to stalk list
        add: function add(element) {
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
        remove: function remove(element) {
            var newlist = watchedItems.filter(function (item) {
                return item.element !== element;
            });

            if (newlist.length !== watchedItems.length) {
                watchedItems = newlist;
                registerWatchListChange();
                return true;
            }

            return false;
        },

        listenFor: function listenFor(eventName) {
            detach();
            customEvents = customEvents.filter(function (ev) {
                return ev !== eventName;
            }).concat(eventName);
            registerWatchListChange();
        },

        ignore: function ignore(eventName) {
            detach();
            customEvents = customEvents.filter(function (ev) {
                return ev !== eventName;
            });
            registerWatchListChange();
        },

        check: checkItems

    };

    var stickyArray = [];
    var boxCheck = function boxCheck(sticky, watch) {
        if (watch.getBoundingClientRect().top < 0 && watch.getBoundingClientRect().bottom > 0 && sticky.getBoundingClientRect().bottom < 0) {
            sticky.classList.add('is-sticky');
        } else {
            sticky.classList.remove('is-sticky');
        }
    };
    var checkEach = function checkEach(event) {
        var target = event.target;

        stickyArray.filter(function (stickyObj) {
            return stickyObj.sticky === target || stickyObj.watch === target;
        }).map(function (stickyObj) {
            boxCheck(stickyObj.sticky, stickyObj.watch);
        });
    };
    window.addEventListener('in-stalk.in.top', checkEach);
    window.addEventListener('in-stalk.out.top', checkEach);
    // window.addEventListener('in-stalk.in.bottom', checkEach);
    // window.addEventListener('in-stalk.out.bottom', checkEach);

    function stickify(stickyElement) {
        var elementWatch = arguments.length <= 1 || arguments[1] === undefined ? stickyElement : arguments[1];

        inStalk.add(elementWatch);
        inStalk.add(stickyElement);
        stickyArray.push({
            sticky: stickyElement,
            watch: elementWatch
        });
    }

    var header = document.querySelector('.header');
    var watcher = document.querySelector('.watcher');
    stickify(header, watcher);
})();