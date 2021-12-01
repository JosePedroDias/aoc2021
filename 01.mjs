import {streamLines, sumArray} from './shared.mjs';

async function part1(fn) {
    let numLargers = 0;
    let last = NaN;

    for await (const line of streamLines(fn)) {
        const curr = parseInt(line, 10);
        if (isFinite(last) && curr > last) {
            ++numLargers;
        }
        last = curr;
    }

    return numLargers;
}

async function part2(fn) {
    const windows = [
        { data: [], start: 0 },
        { data: [], start: 1 },
        { data: [], start: 2 },
        { data: [], start: 3 },
    ];

    let numLargers = 0;
    let i = -1;
    let lastSum = NaN;

    for await (const line of streamLines(fn)) {
        const curr = parseInt(line, 10);
        ++i;

        for (let w of windows) {
            if (w.start <= i) {
                const j = (i - w.start) % 4;
                if (j === 3) w.data = [];
                else         w.data.push(curr);
            }
        }

        const windowsWith3 = windows
        .map((w, i) => [i, w.data.length])
        .filter(([_i, l]) => l === 3)
        .map(([i, _l]) => i);

        const windowIndex = windowsWith3[0];

        if (isFinite(windowIndex)) {
            const sum = sumArray(windows[windowIndex].data);
            const increased = isFinite(lastSum) && sum > lastSum;
            //console.log(sum, increased);
            if (increased) ++numLargers;
            lastSum = sum;
        }

        //console.log(windows.map(w => w.data));
    }

    return numLargers;
}

async function go() {
    const r1a = await part1('01a.txt');
    console.log('r1a', r1a);

    const r1 = await part1('01.txt');
    console.log('r1', r1);

    const r2a = await part2('01a.txt');
    console.log('r2a', r2a);

    const r2 = await part2('01.txt');
    console.log('r2', r2);
}

go();
