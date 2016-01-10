# DOM Emit

A micro-lib (es6 module) for emitting custom events in the DOM. For modern browsers and IE9+

	import emit from 'dom-emit';

	emit('my-event-name');
	emit.from(document.body, 'my-event-name');
	[document.body, window].map( emit.map('my-event-name') );



## Usage


### `emit('my-event-name', detail)`

Emits a custom event named `my-event-name` from the `window` passing along data in the `detail` variable. `detail` is _optional_.

	emit('my-event', {food: 'pizza'});



### `emit.from(elm, 'my-event-name', detail)`

Emits a bubbling custom event named `my-event-name` from element `elm` passing along data in the `detail` variable. `detail` is optional.

	emit.from(document.body, 'my-event', {food: 'pizza'});




### `emit.map('my-event-name', detail)`

Produces lambda function to be included in a map/forEach function. `detail` is optional.

	[].slice.call(document.querySelector('p'))
		.map( emit.map('my-event') );



## Optional Hyper-Modularity

`emit`, `.from`, and `.map` can be used separately.

	// just the map functionality
	import emitMap from 'dom-emit/map';

	// just the .from functionality
	import emitFrom from 'dom-emit/from';

	// just the basic functionality
	import emit from 'dom-emit/emit';


## Listening

Listening for these emitted events happens via standard event-listeners.

	window.addEventListener('my-event', function(e) {

		//true if emitted from window.
		e.target===window;

		// true if emmited via `emit.from()`
		e.target===document.querySelector('.my-element');

		// contains any data that passed along
		console.log(e.detail);
	}
