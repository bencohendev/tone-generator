<script>
    import SeriesAdvancedControls from "../components/SeriesAdvancedControls.svelte";
    import { audioCtx, allPitches } from "../store.js";
    import { onDestroy, onMount } from "svelte";
    import PitchSelector from "../components/PitchSelector.svelte";
    import uuid from "shortid";
    import { createNewOscillator } from "../helpers/NewOscillator.svelte";

    console.group("series");
    let unlocked = false;
    //oscillator creation
    let oscillator = {};
    let oscillatorArray = [];
    let newNode;
    let vol = 50;
    let play = false;
    let freq = 440;
    let pan = 0;
    let series = 0;
    let wavType = "sine";
    let showPitchSelector = false;

    //speed and pitch range
    let wasClicked = null;
    let lowerVal;
    let upperVal;
    let bpm;
    let playSpeed = 120;
    let numOfPitches = 4;
    let pitchesPlayed = [];
    let showPitches = false;
    let showAllPitches = false;
    let playOnce = false;
    let freqRange = [];

    //advanced controls
    let showAdvanced = false;
    let selectedInstrument;
    let keySelect;
    //array representing pitches in a scale
    let modeSetter = [0, 2, 4, 5, 7, 9, 11];
    //key array places pitches in order of key chosen by user
    let keyArray = ["C", "D", "E", "F", "G", "A", "B"];
    let allowedPitches = [];
    let id;
    //Create Audio Context and Oscillator
    onMount(() => {
        audioCtx.set(new (window.AudioContext || window.webkitAudioContext)());
        id = uuid.generate();
        newNode = createNewOscillator($audioCtx, freq, pan, series);
        newNode.onOffNode.gain.setValueAtTime(0, $audioCtx.currentTime);
        newNode.id = id;
        //counter for number of pitches played in sequence
        newNode.i = 0;
        newNode.oscNode.start();

        oscillatorArray = [newNode];
    });

    onDestroy(() => {
        if (play) play = false;
    });

    let playHandler = () => {
        if (!unlocked) {
            $audioCtx.resume();
            unlocked = true;
        }

        if (play) {
            //sequencePlayer runs after waiting bpm. sequencePlayer ends in a call to playHandler
            setTimeout(sequencePlayer, bpm);
        } else if (!play && oscillator.onOffNode) {
            oscillatorArray.map((oscillator) => {
                oscillator.i = 0;
                oscillator.onOffNode.gain.setTargetAtTime(
                    0,
                    $audioCtx.currentTime,
                    0.01
                );
            });
        }
    };

    function sequencePlayer() {
        let pitchToPlay;
        oscillatorArray.map((oscillator) => {
            //on/off oscillator volume to full volume
            oscillator.onOffNode.gain.setTargetAtTime(
                1,
                $audioCtx.currentTime,
                0.01
            );
            if (oscillator.i < parseInt(numOfPitches) && play) {
                //chooses and plays a random pitch from within the set range
                pitchToPlay =
                    freqRange[Math.floor(Math.random() * freqRange.length)];
                oscillator.oscNode.frequency.setValueAtTime(
                    pitchToPlay.frequency,
                    $audioCtx.currentTime
                );
                oscillator.sequenceGainNode.gain.setTargetAtTime(
                    1,
                    $audioCtx.currentTime,
                    0.01
                );
                oscillator.i++;
            } else {
                //if player has played requested number of pitches either leave a blank and restart, or turn off depending on playOnce
                oscillator.sequenceGainNode.gain.setTargetAtTime(
                    0,
                    $audioCtx.currentTime,
                    0.01
                );
                if (playOnce) {
                    play = false;
                }

                oscillator.i = 0;
            }
            //shaves the last 25% of each note off so there is a gap between notes
            setTimeout(() => {
                oscillator.sequenceGainNode.gain.setTargetAtTime(
                    0,
                    $audioCtx.currentTime,
                    0.01
                );
            }, bpm - bpm * 0.25);
        });

        //loop playhandler
        playHandler();

        //add latest pitch to end of array of pitches played
        if (pitchToPlay) {
            pitchesPlayed.push(pitchToPlay.note);
            pitchesPlayed = pitchesPlayed;
        }
    }
    //pitch selector function
    function handleMessage(e) {
        if (e.detail.text === "close") {
            showPitchSelector = false;
        }
        if (e.detail.text === "pitch") {
            //pitch range selector on first time
            if (wasClicked === "range") {
                if (lowerVal) {
                    upperVal = e.detail;
                    showPitchSelector = false;
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
                showPitchSelector = false;
                wasClicked = null;
            }
        }
    }

    function pitchSelector(e) {
        showPitchSelector = true;
        wasClicked = e.srcElement.id;
    }

    let handleSelectedInstrument = (selectedInstrument) => {
        switch (selectedInstrument) {
            case "Electric Guitar":
                lowerVal = $allPitches.find((pitch) => pitch.note === "E2");
                upperVal = $allPitches.find((pitch) => pitch.note === "D6");
                break;
            case "Tenor Saxophone":
                lowerVal = $allPitches.find((pitch) => pitch.note === "G#/Ab2");
                upperVal = $allPitches.find((pitch) => pitch.note === "E5");
                break;
            case "Soprano Saxophone":
                lowerVal = $allPitches.find((pitch) => pitch.note === "G#/Ab3");
                upperVal = $allPitches.find((pitch) => pitch.note === "E6");
                break;
            case "Alto Saxophone":
                lowerVal = $allPitches.find((pitch) => pitch.note === "C#/Db3");
                upperVal = $allPitches.find((pitch) => pitch.note === "G#/Ab5");
                break;
            case "Bari Saxophone":
                lowerVal = $allPitches.find((pitch) => pitch.note === "C#/Db2");
                upperVal = $allPitches.find((pitch) => pitch.note === "G#/Ab4");
                break;
            case "Trumpet":
                lowerVal = $allPitches.find((pitch) => pitch.note === "F#/Gb3");
                upperVal = $allPitches.find((pitch) => pitch.note === "D6");
                break;
            case "Trombone":
                lowerVal = $allPitches.find((pitch) => pitch.note === "E2");
                upperVal = $allPitches.find((pitch) => pitch.note === "F5");
                break;
            case "Flute":
                lowerVal = $allPitches.find((pitch) => pitch.note === "C4");
                upperVal = $allPitches.find((pitch) => pitch.note === "D7");
                break;
            case "Clarinet":
                lowerVal = $allPitches.find((pitch) => pitch.note === "D3");
                upperVal = $allPitches.find((pitch) => pitch.note === "C7");
                break;
        }
    };

    function handleKeydown(e) {
        if (e.keyCode === 32 && lowerVal && upperVal)
            //space
            play ? (play = false) : (play = true);
    }

    $: {
        //checks to ensure node has been created
        if (oscillatorArray[0]) {
            //volume control
            oscillatorArray.map((oscillator) =>
                oscillator.volGainNode.gain.setTargetAtTime(
                    vol * 0.01,
                    $audioCtx.currentTime,
                    0.001
                )
            );

            //Wave Type Selector
            oscillatorArray[0].oscNode.type = wavType.toLowerCase();
            //frequency range setter
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

<style lang="scss">
    .play-once-container {
        margin: 1rem 0;
    }
    .series {
        text-align: center;
    }

    .text-info {
        text-align: center;
        margin-bottom: 0.25rem;
    }

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
    .pitch-selector {
        margin-bottom: 1rem;
    }
    .bpm-container {
        label {
            margin: 0 1rem;
            input {
                width: 3rem;
            }
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
    }

    .advanced-toggle {
        margin-bottom: 1rem;
    }

    .chevron {
        font-size: 2rem;
        height: 1rem;
        margin: 0.5rem;
        transition: transform 0.5s;
        &.down {
            transform: rotate(180deg);
        }
    }
</style>

<svelte:head>
    <title>Random Pitch Sequences</title>
</svelte:head>

<svelte:window on:keydown={handleKeydown} />

<section class="series card">
    <div class="pitch-select-container">
        <h3 class="text-info">
            Choose a Pitch Range By Instrument Or Set Range Manually
        </h3>

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
                    )}
            >
                <option>Select an Instrument</option>
                <option>Electric Guitar</option>
                <option>Soprano Saxophone</option>
                <option>Alto Saxophone</option>
                <option>Tenor Saxophone</option>
                <option>Bari Saxophone</option>
                <option>Trumpet</option>
                <option>Trombone</option>
                <option>Flute</option>
                <option>Clarinet</option>
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
                        on:click={pitchSelector}>{lowerVal.note}</button
                    >
                {/key}
                {#key upperVal}
                    <button
                        id="upper"
                        class="pitch-selector upper"
                        on:click={pitchSelector}>{upperVal.note}</button
                    >
                {/key}
                <div>Lower</div>
                <div>Upper</div>
            </div>
        {/if}
    </div>
    <div class="pitch-number-container">
        <label>
            number of pitches:
            <input
                type="number"
                name="number of pitches"
                bind:value={numOfPitches}
            />
        </label>
    </div>

    <div class="bpm-container">
        <label>
            bpm:
            <input type="number" label="play speed" bind:value={playSpeed} />
        </label>
    </div>

    <div class="play-once-container">
        <label>
            play once
            <input
                type="checkbox"
                id="play-once-checkbox"
                bind:checked={playOnce}
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
            on:click={() => {
                !play ? (play = true) : (play = false);
            }}
        >
            {#if !(lowerVal && upperVal)}
                Select a Pitch Range to Play
            {:else}
                {play ? "Pause" : "Play"}
            {/if}
        </button>
    </div>

    <button
        class="advanced-toggle"
        on:click={() =>
            showAdvanced ? (showAdvanced = false) : (showAdvanced = true)}
        >{showAdvanced ? "Hide Advanced Controls" : "Show Advanced Controls"}
        <div class={showAdvanced ? "chevron down" : "chevron"}>&#8963;</div>
    </button>

    {#if showAdvanced}
        <SeriesAdvancedControls
            bind:keyArray
            bind:keySelect
            bind:oscillatorArray
            bind:modeSetter
            bind:allowedPitches
            bind:showAllPitches
            bind:pitchesPlayed
            bind:showPitches
        />
    {/if}
</section>

{#if showPitchSelector}
    <PitchSelector
        {lowerVal}
        {upperVal}
        bind:showPitchSelector
        bind:wasClicked
        on:message={handleMessage}
    />
{/if}
