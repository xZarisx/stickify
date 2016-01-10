import emit from '../index.js';


document.addEventListener('DOMContentLoaded', ()=>{

	var hud = document.querySelector('.hud'),
		windowEmitter = document.querySelector('.window-emitter'),
		elementEmitter = document.querySelector('.element-emitter'),
		bulkEmitter = document.querySelector('.bulk-emitter');


	windowEmitter.nextElementSibling.addEventListener('click', ()=> {
		emit.from(windowEmitter, 'my-custom-event', `from window: ${windowEmitter.value}`);
	});

	elementEmitter.nextElementSibling.addEventListener('click', ()=> {
		emit.from(elementEmitter, 'my-custom-event', `from element: ${elementEmitter.value}`);
	});

	bulkEmitter.addEventListener('click', () => {
			[...bulkEmitter.parentNode.querySelectorAll('input') ]
				.map( emit.map('my-custom-event', 'bulk click') );
		}
	);


	window.addEventListener('my-custom-event', e=>hud.innerHTML = `${hud.innerHTML}\n${e.detail}`);


});
