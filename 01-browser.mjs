import { doDebugger } from './debugger-browser.mjs';
import { sumArray } from './shared.mjs';
import { divElement, changeText, scrollToBottom } from './shared-browser.mjs';
import { part1, part2 } from './01.mjs';

let state;

function deleteLater(el) {
    setTimeout(() => el.classList.add('hidden'), 400);
    setTimeout(() => {
        el.innerHTML = '';
        el.classList.remove('hidden');
    }, 400 + 500 + 50);
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
                el.style.display = '';
                el.classList.add('max-half-height');
            },
            onStep: ({ data: { curr, numLargers }, step, el }) => {
                if (step) {
                    const stepEls = Array.from(el.children);
                    for (let oldEl of stepEls) oldEl.classList.remove('highlighted');
                    el.appendChild( divElement(
                        { className: 'highlightable highlighted hideable' },
                        `curr: ${curr}, numLargers: ${numLargers}`
                    ) );
                    scrollToBottom(el);
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
                el.style.display = 'flex';
                el.classList.remove('max-half-height');
                const div1El = divElement({ className: 'steps' });
                const div2El = divElement({ className: 'aux' });
                div1El.classList.add('max-half-height');
                for (let i = 0; i < 4; ++i) div2El.appendChild( divElement({ className: 'highlightable' }, '__') );
                el.appendChild(div1El);
                el.appendChild(div2El);
                state = { div1El, div2El };
            },
            onStep: ({ data: { prevSum, sum, increased, windows, windowIndex, numLargers }, step }) => {
                if (step) {
                    const { div1El, div2El } = state;

                    for (let oldEl of Array.from(div1El.children)) oldEl.classList.remove('highlighted');
                    div1El.appendChild( divElement(
                        { className: 'highlightable highlighted' },
                        `prevSum: ${prevSum}, sum: ${sum}, increased: ${increased ? 'Y' : 'N'}, numLargers: ${numLargers}`
                    ) );
                    scrollToBottom(div1El);

                    const windowEls = Array.from(div2El.children);
                    for (let [index_, win] of Object.entries(windows)) {
                        const index = +index_;
                        const winEl = windowEls[index];
                        const isHighlighted = index === windowIndex;
                        if (isHighlighted) {
                            changeText(winEl, `#${index}: ${win.join(' + ')} = ${sumArray(win)}`);
                        } else {
                            changeText(winEl, `#${index}: ${win.join(', ')}`);
                        }
                        winEl.classList.toggle('highlighted', isHighlighted);
                    }
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
