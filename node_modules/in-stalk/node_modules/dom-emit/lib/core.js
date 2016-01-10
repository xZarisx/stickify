import pollyfill from 'polyfill-custom-event';


export default function (element, evName, data) {
	return element.dispatchEvent(new CustomEvent(evName, { bubbles: true, detail: data }));
}
