import { part1, part2 } from './01.mjs';
import { streamLines, selectElement, buttonElement, checkboxElement, brElement, divElement, setEnabled, setVisibility } from './shared-browser.mjs';

const body = document.body;

let step = true;
let fnToRun;



let mainFormDivEl = divElement();
let debuggerDivEl = divElement();
let nextDivEl = divElement();

body.appendChild(mainFormDivEl);
body.appendChild(debuggerDivEl);
body.appendChild(nextDivEl);



let nextPromiseResolve;

const nextBtnEl = buttonElement({
    label: 'next',
    onClick: () => {
        nextPromiseResolve && nextPromiseResolve();
    }
});

function nextButtonIsClicked() {
    const nextPromise = new Promise((resolve) => (nextPromiseResolve = resolve));
    return nextPromise;
}

nextDivEl.appendChild(nextBtnEl);
setVisibility(nextDivEl, false);



const [ stepCbEl, stepCbLabelEl ] = checkboxElement({
    label: 'step',
    checked: step,
    onChange: (checked) => (step = checked)
});
mainFormDivEl.appendChild(stepCbEl);
mainFormDivEl.appendChild(stepCbLabelEl);

mainFormDivEl.appendChild(brElement());



const [fnSelEl, fnSelLabelEl] = selectElement({
    label: 'data to use',
    items: [
        { label: 'example',    value: '01a.txt' },
        { label: 'real input', value: '01.txt'  }
    ],
    onChange: (fn) => (fnToRun = fn)
});
mainFormDivEl.appendChild(fnSelLabelEl);
mainFormDivEl.appendChild(fnSelEl);
fnToRun = fnSelEl.value;

mainFormDivEl.appendChild(brElement());



mainFormDivEl.appendChild( buttonElement({
    label: 'run part 1',
    onClick: () => runPart1()
}) );

mainFormDivEl.appendChild( buttonElement({
    label: 'run part 2',
    onClick: () => runPart2()
}) );



async function runPart1() {
    setVisibility(mainFormDivEl, false);
    setVisibility(nextDivEl, true);

    let g = part1(streamLines(fnToRun));

    let last;
    for await (const {curr, numLargers} of g) {
        step && console.log(curr, numLargers);
        last = numLargers;
        step && await nextButtonIsClicked();
    }
    console.log(last);

    setVisibility(mainFormDivEl, true);
    setVisibility(nextDivEl, false);
}



async function runPart2() {
    setVisibility(mainFormDivEl, false);
    setVisibility(nextDivEl, true);

    let g = part2(streamLines(fnToRun));

    let last;
    for await (const { sum, increased, numLargers } of g) {
        step && console.log(sum, increased, numLargers);
        last = numLargers;
        step && await nextButtonIsClicked();
    }
    console.log(last);

    setVisibility(mainFormDivEl, true);
    setVisibility(nextDivEl, false);
}
