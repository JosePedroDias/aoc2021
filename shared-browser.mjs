export async function* streamLines(fn) {
    const resp = await fetch(fn);
    const reader = resp.body.getReader();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunkString = new TextDecoder().decode(value); // we receive a uint8array
        const lines = chunkString.split('\n');
        for (let line of lines) {
            if (line.length > 0) yield line;
        }
    }
    reader.releaseLock();
}

/////

function randomString() {
    return (Math.random() + 1).toString(36).substring(7);
}

//// HTML-RELATED

export function setAttributes(el, attributesObj) {
    for (let [k, v] of Object.entries(attributesObj)) {
        if (k === 'className') {
            el.className = v;
        } else if (typeof v === 'function') {
            el.addEventListener(k, v);
        } else {
            el.setAttribute(k, v);
        }
    }
}

function elementFactory(nodeName) {
    return function(attributesObj, text) {
        const el = document.createElement(nodeName);

        attributesObj && setAttributes(el, attributesObj);
        if (text) el.appendChild( document.createTextNode(text) );

        return el;
    }
}


export function selectElement({ items, label, onChange }) {
    const selectEl = document.createElement('select');
    const id = randomString();
    selectEl.setAttribute('id', id);

    for (let [index, item] of Object.entries(items)) {
        index = +index;
        const optionEl = document.createElement('option');
        const {value, label} = item;
        optionEl.setAttribute('value', value);
        if (index === 0) optionEl.setAttribute('selected', 'selected');
        optionEl.appendChild( document.createTextNode(label) );
        selectEl.appendChild(optionEl);
    }

    const labelEl = document.createElement('label');
    labelEl.appendChild( document.createTextNode(label) );
    labelEl.setAttribute('for', id);

    selectEl.addEventListener('change', () => {
        onChange(selectEl.value);
    });

    return [selectEl, labelEl];
}


export function buttonElement({ label, onClick }) {
    const buttonEl = document.createElement('button');
    buttonEl.appendChild( document.createTextNode(label) );
    buttonEl.addEventListener('click', onClick);
    return buttonEl;
}


export function checkboxElement({ label, onChange, checked }) {
    const inputEl = document.createElement('input');
    const id = randomString();
    inputEl.setAttribute('type', 'checkbox');
    inputEl.setAttribute('id', id);

    inputEl.addEventListener('change', () => {
        onChange(inputEl.checked);
    });

    if (checked) inputEl.setAttribute('checked', 'checked');

    const labelEl = document.createElement('label');
    labelEl.appendChild( document.createTextNode(label) );
    labelEl.setAttribute('for', id);

    return [inputEl, labelEl];
}


export const brElement = elementFactory('br');
export const spanElement = elementFactory('span');
export const divElement = elementFactory('div');


export function setEnabled(buttonEl, enabled) {
    buttonEl.disabled = !enabled;
}


export function setVisibility(el, visible, keepingLayout) {
    if (keepingLayout) {
        el.style.visibility = visible ? '' : 'hidden';
    } else {
        el.style.display = visible ? '' : 'none';
    }
}

export function changeText(el, text) {
    el.firstChild.nodeValue = text;
}

export function scrollToBottom(el) {
    el.scrollTop = el.scrollHeight;
}
