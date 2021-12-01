export async function* streamLines(fn) {
    const resp = await fetch(fn);
    const reader = resp.body.getReader();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunkString = new TextDecoder().decode(value); // we receive a uint8array
        const lines = chunkString.split('\n');
        for (let line of lines) {
            if (line.length > 0) yield line;
        }
    }
    reader.releaseLock();
}
