import { createReadStream } from "fs";

export async function* streamLines(fn) {
  const stream = createReadStream(fn, {
    encoding: "utf-8",
    highWaterMark: 256,
  });
  let previous = "";
  for await (const chunk of stream) {
    previous += chunk;
    let eolIndex;
    while ((eolIndex = previous.indexOf("\n")) >= 0) {
      const line = previous.slice(0, eolIndex);
      yield line;
      previous = previous.slice(eolIndex + 1);
    }
  }
  if (previous.length > 0) {
    yield previous;
  }
}

export const sumArray = (arr) => arr.reduce((prev, curr)=> prev + curr, 0);
