import inStalk from 'in-stalk';

var addListners = function (sticky, watch) {
    var boxCheck = function(){
            if (watch.getBoundingClientRect().top < 0 && watch.getBoundingClientRect().bottom > buffer) {
                sticky.classList.add('is-sticky');
            } else {
                sticky.classList.remove('is-sticky');
            }
        };

    window.addEventListener('in-stalk.in.top', boxCheck);
    window.addEventListener('in-stalk.out.top', boxCheck);
    window.addEventListener('in-stalk.in.bottom', boxCheck);
    window.addEventListener('in-stalk.out.bottom', boxCheck);
};
//TODO add a way to manage multiple elements and watchers

export default function(stickyElement, elementWatch = stickyElement){
    if (elementWatch) {
        inStalk.add(elementWatch);
    }
    else {
        inStalk.add(stickyElement);
    }
    addListners(stickyElement, elementWatch);
}
