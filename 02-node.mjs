import { part1, part2 } from './02.mjs';
import { streamLines } from './shared-node.mjs';

async function go() {
    const fn = '02.txt';

    let last;

    let g = part1(streamLines(fn));
    for await (const { command, arg, horizontal, depth } of g) {
        console.log(command, arg, horizontal, depth);
        last = horizontal * depth;
    }
    console.log(last);

    g = part2(streamLines(fn));
    for await (const { command, arg, horizontal, depth, aim } of g) {
        console.log(command, arg, horizontal, depth, aim);
        last = horizontal * depth;
    }
    console.log(last);
}

go();
