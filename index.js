import inStalk from 'in-stalk';

/*
sticky should have is-sticky when and only when
sticky is not in the viewport and the watch is in the viewport
*/

var stickyArray = [],
    boxCheck = function (sticky, watch){
        if (watch.getBoundingClientRect().top < 0 && watch.getBoundingClientRect().bottom > 0 && sticky.getBoundingClientRect().bottom < 0) {
            sticky.classList.add('is-sticky');
        } else {
            sticky.classList.remove('is-sticky');
        }
    },
    checkEach = function (event) {
        var target = event.target;

        stickyArray.filter(function (stickyObj) {
            return stickyObj.sticky === target || stickyObj.watch === target;
        })
        .map(function (stickyObj) {
            boxCheck(stickyObj.sticky, stickyObj.watch);
        });
    };

    window.addEventListener('in-stalk.in.top', checkEach);
    window.addEventListener('in-stalk.out.top', checkEach);
    // window.addEventListener('in-stalk.in.bottom', checkEach);
    // window.addEventListener('in-stalk.out.bottom', checkEach);

export default function(stickyElement, elementWatch = stickyElement){
    inStalk.add(elementWatch);
    inStalk.add(stickyElement);
    stickyArray.push({
        sticky: stickyElement,
        watch: elementWatch
    });
}
