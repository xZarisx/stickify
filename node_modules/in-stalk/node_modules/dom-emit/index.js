import emitter from './lib/core.js';
import map from './map.js';
import emit from './emit.js';


emit.from = emitter;
emit.map = map;


export default emit;
