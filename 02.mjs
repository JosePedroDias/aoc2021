function parse(line) {
    let [command, arg] = line.split(' ');
    return { command, arg: +arg };
}

export async function* part1(asyncGen) {
    let horizontal = 0;
    let depth = 0;

    for await (const line of asyncGen) {
        let { command, arg } = parse(line);

        if (command === 'forward') horizontal += arg;
        else if (command === 'down') depth += arg;
        else if (command === 'up') depth -= arg;

        yield { command, arg, horizontal, depth };
    }
}

export async function* part2(asyncGen) {
    let horizontal = 0;
    let depth = 0;
    let aim = 0;

    for await (const line of asyncGen) {
        let { command, arg } = parse(line);

        if (command === 'forward') { horizontal += arg; depth += aim * arg }
        else if (command === 'down') aim += arg;
        else if (command === 'up') aim -= arg;

        yield { command, arg, horizontal, depth, aim };
    }
}
