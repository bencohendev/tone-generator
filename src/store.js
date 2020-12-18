import { writable, readable } from "svelte/store";
export let audioCtx = writable(null);
export let pitches = readable([
    32.7032,
    34.6478,
    36.7081,
    38.8909,
    41.2034,
    43.6535,
    46.2493,
    48.9994,
    51.9131,
    55,
    58.2705,
    61.7354,
]);
export let pitchNames = readable([
    "C",
    "Db/C#",
    "D",
    "Eb/D#",
    "E",
    "F",
    "Gb/F#",
    "G",
    "Ab/G#",
    "A",
    "Bb/A#",
    "B",
]);

export let octaves = readable([1, 2, 4, 8, 16, 32, 64, 128, 256]);



export let allPitches = writable([])

