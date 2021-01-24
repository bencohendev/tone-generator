import { writable, readable } from "svelte/store";
export let audioCtx = writable(null);
export let pitches = readable([
    32.70319566257483,
    34.64782887210902,
    36.70809598967594,
    38.89087296526011,
    41.20344461410874,
    43.653528929125486,
    46.24930283895431,
    48.999429497718666,
    51.91308719749314,
    55,
    58.27047018976124,
    61.7354126570155,
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

// export let multipliers = readable([ 1, 2, 4, 8, 16, 32, 64, 128, 256]);
// export let octaves = readable([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

export let octaves = readable([
    {
        label: 0,
        multiplier: 1
    },
    {
        label: 1,
        multiplier: 1
    },
    {
        label: 2,
        multiplier: 2
    },
    {
        label: 3,
        multiplier: 4
    },
    {
        label: 4,
        multiplier: 8
    },
    {
        label: 5,
        multiplier: 16
    },
    {
        label: 6,
        multiplier: 32
    },
    {
        label: 7,
        multiplier: 64
    },
    {
        label: 8,
        multiplier: 128
    }, {
        label: 9,
        multiplier: 256
    }
])


export let allPitches = writable([])

export let showPitchSelector = writable(false)

