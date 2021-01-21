<script>
    import { audioCtx, allPitches, showPitchSelector } from "../store.js";
    import { onMount } from "svelte";
    import PitchSelector from "../components/PitchSelector.svelte";

    import { createNewOscillator } from "../services/NewOscillator.svelte";

    console.group("series");

    let oscillator = {};
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
    let i = 0;

    //Create Audio Context and Oscillator
    onMount(() => {
        audioCtx.set(new (window.AudioContext || window.webkitAudioContext)());
        oscillator = createNewOscillator($audioCtx, freq, pan, series);
    });

    let playHandler = () => {
        if (play) {
            setTimeout(seriesPlayer, bpm);
        } else if (!play && oscillator.onOffNode) {
            i = 0;
            oscillator.onOffNode.gain.setValueAtTime(0, $audioCtx.currentTime);
        }
    };

    function seriesPlayer() {
        //sets on/off oscillator volume to full
        oscillator.onOffNode.gain.setValueAtTime(1, $audioCtx.currentTime);

        if (i < parseInt(numOfPitches)) {
            //chooses and plays a random pitch from within the set range
            const pitchToPlay =
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
            i++;
        } else {
            //if player has played requested number of pitches either leave a blank and restart, or turn off depending on playOnce
            oscillator.seriesGainNode.gain.setValueAtTime(
                0,
                $audioCtx.currentTime
            );
            if (playOnce) {
                play = false;
            }

            i = 0;
        }
        //shaves the last 25% of each note off so there is a gap between notes
        setTimeout(() => {
            oscillator.seriesGainNode.gain.setTargetAtTime(
                0,
                $audioCtx.currentTime,
                0.001
            );
        }, bpm - bpm * 0.25);
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
                    pitchName: "e",
                    i: 2,
                };
                upperVal = {
                    text: "pitch",
                    frequency: 1174.656,
                    pitchName: "d",
                    i: 6,
                };
                break;
            case "Tenor Saxophone":
                lowerVal = {
                    text: "pitch",
                    frequency: 103,
                    pitchName: "g#",
                    i: 3,
                };
                upperVal = {
                    text: "pitch",
                    frequency: 622,
                    pitchName: "eb",
                    i: 7,
                };
                break;
        }
    };

    $: {
        //checks to ensure some node values are returned
        if (oscillator.panNode) {
            //volume control
            oscillator.oscillatorGainNode.gain.setTargetAtTime(
                vol / 100,
                $audioCtx.currentTime,
                0.001
            );

            //Wave Type Selector
            oscillator.oscNode.type = wavType.toLowerCase();
            if (lowerVal && upperVal) {
                freqRange = $allPitches.filter(
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
                        on:click={pitchSelector}
                        >{lowerVal
                            ? lowerVal.pitchName + lowerVal.i
                            : "Select a Lower Pitch"}</button
                    >
                {/key}
                {#key upperVal}
                    <button
                        id="upper"
                        class="pitch-selector upper"
                        on:click={pitchSelector}
                        >{upperVal
                            ? upperVal.pitchName + upperVal.i
                            : "Select an Upper Pitch"}</button
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
    {#if $showPitchSelector}
        <PitchSelector
            bind:$showPitchSelector
            {lowerVal}
            {upperVal}
            bind:wasClicked
            on:message={handleMessage}
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
