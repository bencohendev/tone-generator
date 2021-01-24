<script>
    import SeriesAdvancedControls from "../components/SeriesAdvancedControls.svelte";

    import {
        audioCtx,
        allPitches,
        showPitchSelector,
        pitches,
    } from "../store.js";
    import { onMount } from "svelte";
    import PitchSelector from "../components/PitchSelector.svelte";
    import uuid from "shortid";

    import { createNewOscillator } from "../services/NewOscillator.svelte";

    console.group("series");
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

    //Create Audio Context and Oscillator
    onMount(() => {
        audioCtx.set(new (window.AudioContext || window.webkitAudioContext)());
        let id = uuid.generate();
        newNode = createNewOscillator($audioCtx, freq, pan, series);
        newNode.id = id;
        newNode.i = 0;
        oscillatorArray = [newNode];
    });

    let playHandler = () => {
        if (play) {
            setTimeout(seriesPlayer, bpm);
        } else if (!play && oscillator.onOffNode) {
            oscillatorArray.map((oscillator) => {
                oscillator.i = 0;
                oscillator.onOffNode.gain.setValueAtTime(
                    0,
                    $audioCtx.currentTime
                );
            });
        }
    };

    function seriesPlayer() {
        let pitchToPlay;
        oscillatorArray.map((oscillator) => {
            //sets on/off oscillator volume to full
            oscillator.onOffNode.gain.setValueAtTime(1, $audioCtx.currentTime);
            if (oscillator.i < parseInt(numOfPitches) && play) {
                //chooses and plays a random pitch from within the set range
                pitchToPlay =
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
                oscillator.i++;
            } else {
                //if player has played requested number of pitches either leave a blank and restart, or turn off depending on playOnce
                oscillator.seriesGainNode.gain.setValueAtTime(
                    0,
                    $audioCtx.currentTime
                );
                if (playOnce) {
                    play = false;
                }

                oscillator.i = 0;
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

        //add latest pitch to end of array of pitches played
        if (pitchToPlay) {
            pitchesPlayed.push(pitchToPlay.name);
            pitchesPlayed = pitchesPlayed;
        }
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
                lowerVal = $allPitches.find((pitch) => pitch.name === "E2");
                upperVal = $allPitches.find((pitch) => pitch.name === "D6");
                break;
            case "Tenor Saxophone":
                lowerVal = $allPitches.find((pitch) => pitch.name === "G#/Ab2");
                upperVal = $allPitches.find((pitch) => pitch.name === "E5");
                break;
            case "Soprano Saxophone":
                lowerVal = $allPitches.find((pitch) => pitch.name === "G#/Ab3");
                upperVal = $allPitches.find((pitch) => pitch.name === "E6");
                break;
            case "Alto Saxophone":
                lowerVal = $allPitches.find((pitch) => pitch.name === "C#/Db3");
                upperVal = $allPitches.find((pitch) => pitch.name === "G#/Ab5");
                break;
            case "Bari Saxophone":
                lowerVal = $allPitches.find((pitch) => pitch.name === "C#/Db2");
                upperVal = $allPitches.find((pitch) => pitch.name === "G#/Ab4");
                break;
            case "Trumpet":
                lowerVal = $allPitches.find((pitch) => pitch.name === "F#/Gb3");
                upperVal = $allPitches.find((pitch) => pitch.name === "D6");
                break;
            case "Trombone":
                lowerVal = $allPitches.find((pitch) => pitch.name === "E2");
                upperVal = $allPitches.find((pitch) => pitch.name === "F5");
                break;
            case "Flute":
                lowerVal = $allPitches.find((pitch) => pitch.name === "C4");
                upperVal = $allPitches.find((pitch) => pitch.name === "D7");
                break;
            case "Clarinet":
                lowerVal = $allPitches.find((pitch) => pitch.name === "D3");
                upperVal = $allPitches.find((pitch) => pitch.name === "C7");
                break;
        }
    };
    $: {
        //checks to ensure node has been created
        if (oscillatorArray[0]) {
            //volume control
            oscillatorArray.map((oscillator) =>
                oscillator.oscGainNode.gain.setTargetAtTime(
                    vol / 100,
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
    $: console.log("pitches: ", pitchesPlayed);
    console.groupEnd();
</script>

<svelte:head>
    <title>Series</title>
</svelte:head>
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
                    )}>
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
            }}>
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
        <div class={showAdvanced ? "chevron down" : "chevron"}>
            &#8963;
        </div></button
    >

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
        {lowerVal}
        {upperVal}
        bind:wasClicked
        on:message={handleMessage}
    />
{/if}

<style lang="scss">
    .series {
        text-align: center;
    }
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

    .pitch-display-container {
        margin-bottom: 1rem;
    }
</style>
