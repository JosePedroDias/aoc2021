import { part1, part2 } from './01.mjs';
import { streamLines } from './shared-browser.mjs';

async function go() {
    const fn = '01.txt';

    let last;

    let g = part1(streamLines(fn));
    for await (const {curr, numLargers} of g) {
        //console.log(curr, numLargers);
        last = numLargers;
    }
    console.log(last);

    g = part2(streamLines(fn));
    for await (const { sum, increased, numLargers } of g) {
        //console.log(sum, increased, numLargers);
        last = numLargers;
    }
    console.log(last);
}

go();
