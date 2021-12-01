import {sumArray} from './shared.mjs';

export async function* part1(asyncGen) {
    let numLargers = 0;
    let last = NaN;

    for await (const line of asyncGen) {
        const curr = parseInt(line, 10);
        if (isFinite(last) && curr > last) ++numLargers;
        yield {curr, numLargers};
        last = curr;
    }
}

export async function* part2(asyncGen) {
    const windows = [
        { data: [], start: 0 },
        { data: [], start: 1 },
        { data: [], start: 2 },
        { data: [], start: 3 },
    ];

    let numLargers = 0;
    let i = -1;
    let lastSum = NaN;

    for await (const line of asyncGen) {
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
            if (increased) ++numLargers;
            yield { sum, increased, numLargers };
            lastSum = sum;
        }

        //console.log(windows.map(w => w.data));
    }
}
