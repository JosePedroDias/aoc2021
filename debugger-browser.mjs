import { streamLines, selectElement, buttonElement, checkboxElement, brElement, divElement, setVisibility, changeText, setAttributes } from './shared-browser.mjs';

export async function doDebugger({ parts, items }) {
    const body = document.body;

    let step = true;
    let fnToRun;



    let mainFormDivEl = divElement();
    let nextDivEl = divElement();
    let debuggerDivEl = divElement({ className: 'debugger' });

    body.appendChild(mainFormDivEl);
    body.appendChild(nextDivEl);
    body.appendChild(debuggerDivEl);



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
        label: 'step by step',
        checked: step,
        onChange: (checked) => (step = checked)
    });
    mainFormDivEl.appendChild(stepCbEl);
    mainFormDivEl.appendChild(stepCbLabelEl);

    mainFormDivEl.appendChild(brElement());



    const [fnSelEl, fnSelLabelEl] = selectElement({
        label: 'data to use: ',
        items,
        onChange: (fn) => (fnToRun = fn)
    });
    mainFormDivEl.appendChild(fnSelLabelEl);
    mainFormDivEl.appendChild(fnSelEl);
    fnToRun = fnSelEl.value;

    mainFormDivEl.appendChild(brElement());



    const el = debuggerDivEl;

    async function runPart(partFn, onStep) {
        if (step) {
            setVisibility(mainFormDivEl, false, true);
            setVisibility(nextDivEl, true);
        }

        let g = partFn(streamLines(fnToRun));

        let last;
        for await (const data of g) {
            last = onStep( { data, step, el });
            step && await nextButtonIsClicked();
        }

        if (step) {
            setVisibility(mainFormDivEl, true, true);
            setVisibility(nextDivEl, false);
        }
        
        return last;
    }
    
    for (const { partFn, onStart, onStep, onDone } of parts) {
        mainFormDivEl.appendChild( buttonElement({
            label: partFn.name,
            onClick: () => {
                onStart({ step, el });
                runPart(partFn, onStep)
                .then((result) => onDone({ result, step, el }))
            }
        }) );
    }
}
