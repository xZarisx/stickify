import inStalk from 'in-stalk';

var stickyArray = [],
    boxCheck = function (sticky, watch, buffer){
        if (watch.getBoundingClientRect().top < 0 && watch.getBoundingClientRect().bottom > buffer) {
            sticky.classList.add('is-sticky');
        } else {
            sticky.classList.remove('is-sticky');
        }
    },
    checkEach = function (event) {
        var target = event.target;

        stickyArray.filter(function (stickyObj) {
            return stickyObj.watch === target;
        })
        .map(function (stickyObj) {
            boxCheck(stickyObj.sticky, stickyObj.watch, stickyObj.buffer);
        });
    };

    window.addEventListener('in-stalk.in.top', checkEach);
    window.addEventListener('in-stalk.out.top', checkEach);
    window.addEventListener('in-stalk.in.bottom', checkEach);
    window.addEventListener('in-stalk.out.bottom', checkEach);

export default function(stickyElement, elementWatch = stickyElement, buff = 50){
    inStalk.add(elementWatch);
    stickyArray.push({
        sticky: stickyElement,
        watch: elementWatch,
        buffer: buff
    });
}
