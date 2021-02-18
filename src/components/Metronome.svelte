<script>
    import { BufferLoader } from "../helpers/BufferLoader.svelte";
    import { playFile } from "../helpers/PlayFile.svelte";
    import { audioCtx } from "../store.js";
    import { onDestroy, onMount } from "svelte";
    import uuid from "shortid";
    import { createNewOscillator } from "../helpers/NewOscillator.svelte";

    console.group("metronome");
    //oscillator creation
    let oscillator = {};
    let oscillatorArray = [];
    let newNode;
    let vol = 50;
    let play = false;
    let freq = 440;
    let pan = 0;
    let series = 0;
    let metronome = false;

    //speed and pitch range
    let bpm = 120;
    let playSpeed = 120;
    let numOfPitches = 4;

    //advanced controls

    //new variables
    var startTime; // The start time of the entire sequence.
    var current16thNote; // What note is currently last scheduled?
    var lookahead = 25.0; // How frequently to call scheduling function
    //(in milliseconds)
    var scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)
    // This is calculated from lookahead, and overlaps
    // with next interval (in case the timer is late)
    var nextNoteTime = 0.0; // when the next note is due.
    var noteResolution = 0; // 0 == 16th, 1 == 8th, 2 == quarter note
    var noteLength = 0.05; // length of "beep" (in seconds)
    var notesInQueue = []; // the notes that have been put into the web audio,
    // and may or may not have played yet. {note, time}
    var timerWorker = null; // The Web Worker used to fire timer messages
    var unlocked = false;
    let tickTrack;
    let tickTrackUp;
    let tick;
    let tickUp;
    let bufferLoader;

    let id;
    //Create Audio Context and Oscillator
    onMount(() => {
        audioCtx.set(new (window.AudioContext || window.webkitAudioContext)());

        // if we wanted to load audio files, etc., this is where we should do it.
        bufferLoader = new BufferLoader(
            $audioCtx,
            ["./audio/tick.wav", "./audio/tick_up.wav"],
            finishedLoading
        );

        bufferLoader.load();

        // // get the audio element
        // tick = document.querySelector("audio");

        // // pass it into the audio context
        // tickTrack = $audioCtx.createMediaElementSource(tick);
        // tickTrack.connect($audioCtx.destination);

        // tickUp = document.querySelector("audio");

        // // pass it into the audio context
        // tickTrackUp = $audioCtx.createMediaElementSource(tickUp);
        // tickTrackUp.connect($audioCtx.destination);

        timerWorker = new Worker("./metronomeworker.js");
        // console.log(timerWorker);
        timerWorker.onmessage = function (e) {
            if (e.data == "tick") {
                // console.log("tick!");
                scheduler();
            } else console.log("message: " + e.data);
        };
        timerWorker.postMessage({ interval: lookahead });
    });

    onDestroy(() => {
        if (play) play = false;
    });

    function finishedLoading(bufferList) {
        // Create two sources and play them both together.
        var source1 = $audioCtx.createBufferSource();
        var source2 = $audioCtx.createBufferSource();
        source1.buffer = bufferList[0];
        source2.buffer = bufferList[1];

        source1.connect($audioCtx.destination);
        source2.connect($audioCtx.destination);
        source1.start(0);
        source2.start(0);
        console.log(source1);
    }

    $: {
        //checks to ensure node has been created
        if (oscillatorArray[0]) {
            //volume control
            oscillatorArray.map((oscillator) =>
                oscillator.volGainNode.gain.setTargetAtTime(
                    vol / 100,
                    $audioCtx.currentTime,
                    0.001
                )
            );
        }
    }
    $: playHandler(play);

    //new functions
    function nextNote() {
        // Advance current note and time by a 16th note...
        var secondsPerBeat = 60.0 / bpm; // Notice this picks up the CURRENT
        // bpm value to calculate beat length.
        nextNoteTime += 0.25 * secondsPerBeat; // Add beat length to last beat time

        current16thNote++; // Advance the beat number, wrap to zero
        if (current16thNote == 16) {
            current16thNote = 0;
        }
    }

    function scheduleNote(beatNumber, time) {
        // push the note on the queue, even if we're not playing.
        notesInQueue.push({ note: beatNumber, time: time });

        if (noteResolution == 1 && beatNumber % 2) return; // we're not playing non-8th 16th notes
        if (noteResolution == 2 && beatNumber % 4) return; // we're not playing non-quarter 8th notes

        // create an oscillator
        var osc = $audioCtx.createOscillator();
        osc.connect($audioCtx.destination);
        //  if (beatNumber % 16 === 0)
        // beat 0 == high pitch
        //  console.log(bufferLoader);
        //   else if (beatNumber % 4 === 0)
        // quarter notes = medium pitch
        //   source2.play(time);
        //  console.log(bufferList);

        // other 16th notes = low pitch
    }

    function scheduler() {
        // while there are notes that will need to play before the next interval,
        // schedule them and advance the pointer.
        while (nextNoteTime < $audioCtx.currentTime + scheduleAheadTime) {
            scheduleNote(current16thNote, nextNoteTime);
            nextNote();
        }
    }
    function playHandler(play) {
        if ($audioCtx) {
            if (!unlocked) {
                // play silent buffer to unlock the audio
                var buffer = $audioCtx.createBuffer(1, 1, 22050);
                var node = $audioCtx.createBufferSource();
                node.buffer = buffer;
                node.start(0);
                unlocked = true;
            }

            if (play) {
                console.log(bufferLoader);
                playFile($audioCtx, bufferLoader);
                // start playing
                current16thNote = 0;
                nextNoteTime = $audioCtx.currentTime;
                timerWorker.postMessage("start");
            } else {
                timerWorker.postMessage("stop");
            }
        }
    }

    console.groupEnd();
</script>

<style lang="scss">
</style>

<section class="metronome">
    <button
        on:click={() => {
            metronome ? (metronome = false) : (metronome = true);
        }}>Metronome</button
    >
    {#if metronome}
        <div class="slide-container volume">
            <img
                class="volume-low"
                src={vol === 0
                    ? "../icons/volume-off-light.png"
                    : "../icons/volume-low-light.png"}
                alt="volume"
                on:click={() => (vol = 0)}
            />
            <input
                type="range"
                min="0"
                max="100"
                bind:value={vol}
                class="slider volume"
            />
            <img
                class="volume-full"
                src="../icons/volume-full-light.png"
                alt="volume"
                on:click={() => (vol = 100)}
            />
        </div>
        <div class="play-container">
            <button
                class="play-button {play ? 'playing' : 'paused'}"
                on:click={() => {
                    !play ? (play = true) : (play = false);
                }}
            >
                {play ? "Pause" : "Play"}
            </button>
        </div>
    {/if}
</section>
<audio src="./audio/tick.wav" />
<audio src="./audio/tick_up.wav" />
