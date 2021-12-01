import { part1, part2 } from './01.mjs';
import { doDebugger } from './debugger-browser.mjs';

doDebugger([
    {
        partFn: part1,
        onStart: (step) => {

        },
        onStep: ({ curr, numLargers }, step) => {
            if (step) {
                console.log(curr, numLargers);
            }
            return numLargers;
        },
        onDone: (result, step) => !step && console.warn(result)
    },
    {
        partFn: part2,
        onStart: (step) => {
            
        },
        onStep: ({ sum, increased, numLargers }, step) => {
            if (step) {
                console.log(sum, increased, numLargers);
            }
            return numLargers;
        },
        onDone: (result, step) => !step && console.warn(result)
    }
])
