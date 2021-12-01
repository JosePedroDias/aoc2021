import { streamLines, selectElement, buttonElement, checkboxElement, brElement, divElement, setVisibility } from './shared-browser.mjs';

export async function doDebugger(parts) {
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



    async function runPart(partFn, onStep) {
        setVisibility(mainFormDivEl, false);
        setVisibility(nextDivEl, true);

        let g = partFn(streamLines(fnToRun));

        let last;
        for await (const yieldedData of g) {
            last = onStep(yieldedData, step);
            step && await nextButtonIsClicked();
        }

        setVisibility(mainFormDivEl, true);
        setVisibility(nextDivEl, false);

        return last;
    }



    for (const { partFn, onStep, onResult } of parts) {
        mainFormDivEl.appendChild( buttonElement({
            label: partFn.name,
            onClick: () => {
                runPart(partFn, onStep).then(onResult);
            }
        }) );
    }
}
