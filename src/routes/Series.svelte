<script>
    import {
        audioCtx,
        allPitches,
        pitches,
        pitchNames,
        showPitchSelector,
    } from "../store.js";
    import { onMount } from "svelte";
    import PitchSelector from "../components/PitchSelector.svelte";
    import uuid from "shortid";

    import { createNewOscillator } from "../services/NewOscillator.svelte";

    console.group("series");

    let oscillator = {};
    let oscillatorArray = [];
    let newNode;
    let vol = 50;
    let play = false;
    let freq = 440;
    let pan = 0;
    let series = 0;
    let wavType = "sine";
    let wasClicked = null;
    let lowerVal;
    let upperVal;
    let bpm;
    let playSpeed = 120;
    let numOfPitches = 4;
    let playOnce = false;
    let freqRange = [];
    let selectedInstrument;
    let interval;
    let intervalType;
    let keySelect;
    let modeSelect;
    //array representing pitches in a scale
    let modeSetter = [0, 2, 4, 5, 7, 9, 11];
    //key array places pitches in order of key chosen by user
    let keyArray = ["C", "D", "E", "F", "G", "A", "B"];
    let allowedPitches = [];
    let i = 0;
    //Create Audio Context and Oscillator
    onMount(() => {
        audioCtx.set(new (window.AudioContext || window.webkitAudioContext)());
        addNewOscillator(freq, pan);
    });

    function addNewOscillator(freq, pan) {
        let id = uuid.generate();
        newNode = createNewOscillator($audioCtx, freq, pan, series);
        newNode.id = id;
        newNode.j = 0;
        oscillatorArray = [...oscillatorArray, newNode];
    }

    let playHandler = () => {
        if (play) {
            setTimeout(seriesPlayer, bpm);
        } else if (!play && oscillator.onOffNode) {
            oscillatorArray.map((oscillator) => {
                oscillator.j = 0;
                oscillator.onOffNode.gain.setValueAtTime(
                    0,
                    $audioCtx.currentTime
                );
            });
        }
    };

    function seriesPlayer() {
        oscillatorArray.map((oscillator) => {
            //sets on/off oscillator volume to full
            oscillator.onOffNode.gain.setValueAtTime(1, $audioCtx.currentTime);
            if (oscillator.j < parseInt(numOfPitches)) {
                //chooses and plays a random pitch from within the set range
                let pitchToPlay =
                    freqRange[Math.floor(Math.random() * freqRange.length)];

                oscillator.oscNode.frequency.setValueAtTime(
                    pitchToPlay.frequency,
                    $audioCtx.currentTime
                );
                oscillator.seriesGainNode.gain.setTargetAtTime(
                    1,
                    $audioCtx.currentTime,
                    0.0001
                );
                oscillator.j++;
            } else {
                //if player has played requested number of pitches either leave a blank and restart, or turn off depending on playOnce
                oscillator.seriesGainNode.gain.setValueAtTime(
                    0,
                    $audioCtx.currentTime
                );
                if (playOnce) {
                    play = false;
                }

                oscillator.j = 0;
            }
            //shaves the last 25% of each note off so there is a gap between notes
            setTimeout(() => {
                oscillator.seriesGainNode.gain.setTargetAtTime(
                    0,
                    $audioCtx.currentTime,
                    0.001
                );
            }, bpm - bpm * 0.25);
        });

        //loop playhandler
        playHandler();
    }

    //pitch selector function
    function handleMessage(e) {
        if (e.detail.text === "close") {
            $showPitchSelector = false;
        }
        if (e.detail.text === "pitch") {
            //pitch range selector on first time
            if (wasClicked === "range") {
                if (lowerVal) {
                    upperVal = e.detail;
                    $showPitchSelector = false;
                    wasClicked = null;
                } else {
                    lowerVal = e.detail;
                    wasClicked = "upper";
                }
            } else {
                //general pitch selector setter
                wasClicked === "lower"
                    ? (lowerVal = e.detail)
                    : (upperVal = e.detail);
                $showPitchSelector = false;
                wasClicked = null;
            }
        }
    }

    function pitchSelector(e) {
        $showPitchSelector = true;
        wasClicked = e.srcElement.id;
    }

    let handleSelectedInstrument = (selectedInstrument) => {
        switch (selectedInstrument) {
            case "Electric Guitar":
                lowerVal = {
                    text: "pitch",
                    frequency: 82.406,
                    name: "E2",
                    i: 2,
                };
                upperVal = {
                    text: "pitch",
                    frequency: 1174.656,
                    name: "D6",
                    i: 6,
                };
                break;
            case "Tenor Saxophone":
                lowerVal = {
                    text: "pitch",
                    frequency: 103,
                    name: "G#/Ab3",
                    i: 3,
                };
                upperVal = {
                    text: "pitch",
                    frequency: 622,
                    name: "D#/Eb7",
                    i: 7,
                };
                break;
        }
    };

    function intervalHandler() {
        for (let j = interval; j > oscillatorArray.length; j) {
            let id = uuid.generate();
            newNode = createNewOscillator($audioCtx, freq, pan, series);
            newNode.id = id;
            newNode.j = 0;
            oscillatorArray = [...oscillatorArray, newNode];
        }
    }

    function intervalSelectHandler() {}

    async function populateAllowedPitches() {
        allowedPitches = [];
        $allPitches.map((pitch) =>
            keyArray.forEach((key) => {
                if (pitch.name.slice(0, pitch.name.length - 1) === key)
                    allowedPitches.push(pitch);
            })
        );
    }

    async function populateKeyedPitches() {
        allowedPitches = [];
        //get array of correct
        modeSetter = await modeSelectHandler();
        keyArray = await keyHandler();
        populateAllowedPitches();
    }

    //mode setter is used to create array of pitches for specific modes
    async function modeSelectHandler() {
        modeSetter = [];
        switch (modeSelect) {
            case "maj":
                modeSetter = [0, 2, 4, 5, 7, 9, 11];
                break;
            case "min":
                modeSetter = [0, 2, 3, 5, 7, 9, 11];
                break;
            case "dim":
                modeSetter = [0, 2, 3, 5, 6, 8, 9, 11];

                break;
            case "aug":
                modeSetter = [0, 4, 8];
                break;
        }
        return modeSetter;
    }
    //key handler returns keyArray with pitches in the correct order based on key chosen by user. mode default to major
    async function keyHandler() {
        keyArray = [];

        //reorders array of pitches based on key
        let pitchFront = $pitchNames.slice(keySelect, 12);
        let pitchBack = $pitchNames.slice(0, keySelect);
        let keyOrdered = pitchFront.concat(pitchBack);

        //populates key array with pitches based on mode setter
        modeSetter.map((key) => {
            let pitchToReturn = keyOrdered[key];
            keyArray.push(pitchToReturn);
        });

        //sets allPitches
        populateAllowedPitches();

        return keyArray;
    }
    $: {
        //checks to ensure some node values are returned
        if (oscillatorArray[0]) {
            //volume control
            oscillatorArray[0].oscGainNode.gain.setTargetAtTime(
                vol / 100,
                $audioCtx.currentTime,
                0.001
            );

            //Wave Type Selector
            oscillatorArray[0].oscNode.type = wavType.toLowerCase();
            //frequency range selector
            if (lowerVal && upperVal) {
                allowedPitches[0]
                    ? (allowedPitches = allowedPitches)
                    : (allowedPitches = $allPitches);
                freqRange = allowedPitches.filter(
                    (pitch) =>
                        pitch.frequency >= lowerVal.frequency &&
                        pitch.frequency <= upperVal.frequency
                );
            }
        }
    }
    $: playHandler(play);

    $: bpm = (60 * 1000) / playSpeed;

    console.groupEnd();
</script>

<section class="series card">
    <div class="pitch-select-container">
        <div class="text-info">
            Choose a Pitch Range By Instrument Or Set Range Manually
        </div>

        <div class="instrument-select-container">
            <!-- svelte-ignore a11y-no-onchange -->
            <select
                name="select-instrument"
                id="select-instrument"
                bind:value={selectedInstrument}
                on:change={() =>
                    handleSelectedInstrument(
                        selectedInstrument,
                        lowerVal,
                        upperVal
                    )}>
                <option>Select an Instrument</option>
                <option>Electric Guitar</option>
                <option>Tenor Saxophone</option>
            </select>
        </div>
        {#if !(lowerVal && upperVal)}
            <button id="range" class="pitch-selector" on:click={pitchSelector}
                >Select a Pitch Range</button
            >
        {/if}
        {#if lowerVal && upperVal}
            <div class="freq-select-container">
                {#key lowerVal}
                    <button
                        id="lower"
                        class="pitch-selector lower"
                        on:click={pitchSelector}>{lowerVal.name}</button
                    >
                {/key}
                {#key upperVal}
                    <button
                        id="upper"
                        class="pitch-selector upper"
                        on:click={pitchSelector}>{upperVal.name}</button
                    >
                {/key}
                <div>Lower</div>
                <div>Upper</div>
            </div>
        {/if}
    </div>

    <div class="bpm-container">
        <label>
            number of pitches:
            <input
                type="number"
                name="number of pitches"
                bind:value={numOfPitches}
            />
        </label>
        <label>
            bpm:
            <input type="number" label="play speed" bind:value={playSpeed} />
        </label>
        <label>
            play once

            <input
                type="checkbox"
                id="play-once-checkbox"
                bind:checked={playOnce}
                disabled={play}
            />
        </label>
    </div>

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
            disabled={!(lowerVal && upperVal)}
            on:click={() => (!play ? (play = true) : (play = false))}>
            {#if !(lowerVal && upperVal)}
                Select a Pitch Range to Play
            {:else}
                {play ? "Pause" : "Play"}
            {/if}
        </button>
    </div>

    <div class="interval-select-container">
        <!-- svelte-ignore a11y-no-onchange -->
        <select
            name="select-interval"
            id="select-interval"
            bind:value={interval}
            on:change={intervalHandler}>
            <option>Select Number Of Intervals</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={5}>5</option>
        </select>
        <!-- svelte-ignore a11y-no-onchange -->
        <select
            name="select-interval-type"
            id="select-interval-type"
            bind:value={intervalType}
            on:change={intervalSelectHandler}>
            <option>Select Number Of Intervals</option>
            <option value="maj">Major</option>
            <option value="min">Minor</option>
            <option value="dim">Diminished</option>
            <option value="aug">Augment</option>
        </select>
    </div>
    <!-- svelte-ignore a11y-no-onchange -->

    <select
        name="select-key"
        id="select-key"
        bind:value={keySelect}
        on:change={keyHandler}>
        {#each $pitchNames as pitchName, i}
            <option value={i}>{pitchName}</option>
        {/each}
    </select>
    <!-- svelte-ignore a11y-no-onchange -->

    <select
        name="mode-key"
        id="mode-key"
        bind:value={modeSelect}
        on:change={populateKeyedPitches}>
        <option value="maj">Major</option>
        <option value="min">Minor</option>
        <option value="dim">Diminished</option>
        <option value="aug">Augment</option>
    </select>
</section>
<section class="page-info">
    <h3>About This Random Note Generator</h3>
    <div>
        This random note generator will play random pitches from within whatever
        range you set! Select a lower and upper pitch boundary or automatically
        set the range to an instrument. You can choose how many pitches to play
        in a set, the speed at which the pitches will play, and whether the tool
        will play a set of pitches once, or continually.
    </div>
</section>
{#if $showPitchSelector}
    <PitchSelector
        bind:$showPitchSelector
        {lowerVal}
        {upperVal}
        bind:wasClicked
        on:message={handleMessage}
    />
{/if}

<style lang="scss">
    .page-info {
        padding: 1rem;
        margin-bottom: 2rem;
    }

    .text-info {
        text-align: center;
        margin-bottom: 0.25rem;
    }

    .pitch-select-container,
    .instrument-select-container,
    .bpm-container {
        text-align: center;
        margin: 1rem 0;
    }

    .play-container {
        text-align: center;
        margin: 1rem 0;

        button {
            padding: 1rem 2.5rem;
        }
    }

    .bpm-container {
        label {
            margin: 0 1rem;
            input {
                width: 3rem;
            }
        }

        #play-once-checkbox {
            width: 1rem;
        }
    }

    .volume {
        display: flex;
        justify-content: center;
        align-items: center;
        input {
            width: 60%;
            margin: 0rem 0.5rem;
        }
        img {
            width: 20px;
        }
    }

    .freq-select-container {
        display: grid;
        grid-template-columns: auto auto;
        justify-content: center;

        .pitch-selector {
            width: 5rem;
            margin: 0rem 0.5rem;
        }
    }
</style>
