import { doDebugger } from './debugger-browser.mjs';
import { divElement } from './shared-browser.mjs';
import { part1, part2 } from './01.mjs';


let arr;

function deleteLater(el) {
    setTimeout(() => {
        el.classList.add('hidden');
    }, 400);
    setTimeout(() => {
        el.innerHTML = '';
        el.classList.remove('hidden');
    }, 1500);
}

doDebugger({ 
    items: [
        { label: 'example',    value: '01a.txt' },
        { label: 'real input', value: '01.txt'  }
    ],
    parts: [
        {
            partFn: part1,
            onStart: ({ step, el }) => {
                if (!step) return;
                el.innerHTML = '';
                arr = [];
            },
            onStep: ({ data: { curr, numLargers }, step, el }) => {
                if (step) {
                    const divEl = divElement({}, `curr: ${curr}, numLargers: ${numLargers}`);
                    arr.push(divEl);
                    el.appendChild(divEl);
                }
                return numLargers;
            },
            onDone: ({ result, step, el }) => {
                if (step) deleteLater(el);
                else el.innerHTML = result;
            }
        },
        {
            partFn: part2,
            onStart: ({ step, el }) => {
                if (!step) return;
                el.innerHTML = '';
                arr = [];r = [];
            },
            onStep: ({ data: { sum, increased, numLargers }, step, el }) => {
                if (step) {
                    const divEl = divElement({}, `sum: ${sum}, increased: ${increased ? 'Y' : 'N'}, numLargers: ${numLargers}`);
                    arr.push(divEl);
                    el.appendChild(divEl);
                }
                return numLargers;
            },
            onDone: ({ result, step, el }) => {
                if (step) deleteLater(el);
                else el.innerHTML = result;
            }
        }
    ]
});
