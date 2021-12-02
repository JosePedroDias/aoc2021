import { doDebugger } from './debugger-browser.mjs';
import { divElement, scrollToBottom } from './shared-browser.mjs';
import { part1, part2 } from './02.mjs';

function deleteLater(el) {
    setTimeout(() => el.classList.add('hidden'), 400);
    setTimeout(() => {
        el.innerHTML = '';
        el.classList.remove('hidden');
    }, 400 + 500 + 50);
}

doDebugger({ 
    items: [
        { label: 'example',    value: '02a.txt' },
        { label: 'real input', value: '02.txt'  }
    ],
    parts: [
        {
            partFn: part1,
            onStart: ({ step, el }) => {
                if (!step) return;
                el.innerHTML = '';
                el.classList.add('max-half-height');
            },
            onStep: ({ data: { command, arg, horizontal, depth }, step, el }) => {
                if (step) {
                    const stepEls = Array.from(el.children);
                    for (let oldEl of stepEls) oldEl.classList.remove('highlighted');
                    el.appendChild( divElement(
                        { className: 'highlightable highlighted hideable' },
                        `command: ${command}, arg: ${arg}, horizontal: ${horizontal}, depth: ${depth}`
                    ) );
                    scrollToBottom(el);
                }
                return horizontal * depth;
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
                el.classList.add('max-half-height');
            },
            onStep: ({ data: { command, arg, horizontal, depth, aim }, step, el }) => {
                if (step) {
                    const stepEls = Array.from(el.children);
                    for (let oldEl of stepEls) oldEl.classList.remove('highlighted');
                    el.appendChild( divElement(
                        { className: 'highlightable highlighted hideable' },
                        `command: ${command}, arg: ${arg}, horizontal: ${horizontal}, depth: ${depth}, aim: ${aim}`
                    ) );
                    scrollToBottom(el);
                }
                return horizontal * depth;
            },
            onDone: ({ result, step, el }) => {
                if (step) deleteLater(el);
                else el.innerHTML = result;
            }
        }
    ]
});
