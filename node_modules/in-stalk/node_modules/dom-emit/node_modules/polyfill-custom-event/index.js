let polyfilled = false;

if(typeof window.CustomEvent !== "function") {

	function CustomEvent ( event, params = { bubbles: false, cancelable: false, detail: undefined } ) {
    	var evt = document.createEvent( 'CustomEvent' );
    	evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    	return evt;
	}

	CustomEvent.prototype = window.Event.prototype;

	window.CustomEvent = CustomEvent;

	polyfilled = true;

};

export default polyfilled;


