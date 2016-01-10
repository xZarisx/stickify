import polyfill from 'polyfill-custom-event';
import inStalk from 'in-stalk';

var windowEvents = ['scroll', 'resize', 'load', 'hashchange', 'touchend'],
    windowChange = new CustomEvent('windowChange'),

    //TODO replace with in-stalk
    boxCheck = function(child, parent = child.parentElement, buffer = 50){
        if (parent.getBoundingClientRect().top < 0 && parent.getBoundingClientRect().bottom > buffer) {
            child.classList.add('is-sticky');
        } else {
            child.classList.remove('is-sticky');
        }
    };

windowEvents.map(function(event){
    window.addEventListener(event, function(){
        window.dispatchEvent(windowChange);
    });
});

export default function(stickyElement, elementWatch){
    // inStalk.add

    if(!!stickyElement && !!elementWatch){
        window.addEventListener('windowChange', function(){
            boxCheck(stickyElement, elementWatch, 100);
        });
    }
}
