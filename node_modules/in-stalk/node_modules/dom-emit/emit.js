import emitter from './lib/core.js';

export default (evName, data) => emitter(window, evName, data);

