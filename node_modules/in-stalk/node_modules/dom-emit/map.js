import emitter from './lib/core.js';

export default function(evName, data) {
	return function(elm) {
		emitter(elm, evName, data);
		return elm;
	}
};
