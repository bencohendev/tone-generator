<script>
    import { audioCtx, allPitches } from "../store.js";
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
    let showPitchSelector = false;
    let wasClicked;
    let lowerVal;
    let upperVal;
    let bpm;
    let playSpeed = 120;
    let numOfPitches = 4;
    let playOnce = false;
    let freqRange = [];
    let selectedInstrument;
    let i = 0;

    onMount(() => {
        audioCtx.set(new (window.AudioContext || window.webkitAudioContext)());
        oscillator = createNewOscillator($audioCtx, freq, pan, series);
    });
    let playHandler = () => {
        if (play) {
            setTimeout(seriesPlayer, bpm);
        } else if (!play && oscillator.onOffNode) {
            oscillator.onOffNode.gain.setValueAtTime(0, $audioCtx.currentTime);
        }
    };

    function seriesPlayer() {
        oscillator.onOffNode.gain.setValueAtTime(1, $audioCtx.currentTime);

        if (!playOnce) {
            if (i === parseInt(numOfPitches)) {
                oscillator.seriesGainNode.gain.setValueAtTime(
                    0,
                    $audioCtx.currentTime
                );
                i = 0;
            } else {
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
            }
            setTimeout(() => {
                oscillator.seriesGainNode.gain.setTargetAtTime(
                    0,
                    $audioCtx.currentTime,
                    0.001
                );
            }, bpm - bpm * 0.25);
            playHandler();
        } else if (playOnce) {
            for (let i = 0; i < numOfPitches; i++) {
                setTimeout(() => {
                    const pitchToPlay =
                        freqRange[Math.floor(Math.random() * freqRange.length)];
                    oscillator.oscNode.frequency.setValueAtTime(
                        pitchToPlay.frequency,
                        $audioCtx.currentTime
                    );
                    oscillator.seriesGainNode.gain.setTargetAtTime(
                        1,
                        $audioCtx.currentTime,
                        0.001
                    );
                    setTimeout(() => {
                        oscillator.seriesGainNode.gain.setTargetAtTime(
                            0,
                            $audioCtx.currentTime,
                            0.001
                        );
                    }, bpm - bpm * 0.25);
                }, bpm * i);
            }
            setTimeout(() => {
                play = false;
            }, bpm * numOfPitches);
        }
    }

    //pitch selector function
    function handleMessage(e) {
        if (e.detail.text === "close") {
            showPitchSelector = false;
        }
        if (e.detail.text === "pitch") {
            if (wasClicked === "range") {
                if (lowerVal) {
                    upperVal = e.detail;
                    showPitchSelector = false;
                    wasClicked = null;
                } else {
                    lowerVal = e.detail;
                }
            } else {
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
        //if statement checks to ensure all node values are returned
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
        <div class="text-info">Choose a Pitch Range</div>
        {#if !(lowerVal && upperVal)}
            <button id="range" class="pitch-selector" on:click={pitchSelector}
                >Select a Pitch Range</button
            >
        {/if}

        {#key lowerVal}
            <button id="lower" class="pitch-selector" on:click={pitchSelector}
                >{lowerVal
                    ? lowerVal.pitchName + lowerVal.i
                    : "Select a Lower Pitch"}</button
            >
        {/key}
        {#key upperVal}
            <button id="upper" class="pitch-selector" on:click={pitchSelector}
                >{upperVal
                    ? upperVal.pitchName + upperVal.i
                    : "Select an Upper Pitch"}</button
            >
        {/key}
    </div>
    <div class="instrument-select-container">
        <div class="text-info">Or Set Range By Instrument</div>

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
    <div class="bpm-container">
        <div class="text-info">Set Number of Pitches to Play and Speed</div>

        <input
            type="number"
            label="number of pitches"
            bind:value={numOfPitches}
        />
        <input type="number" label="play speed" bind:value={playSpeed} />
    </div>
    <div class="play-once-container">
        <div class="text-info">Check to only play pitch set once</div>

        <input type="checkbox" bind:checked={playOnce} disabled={play} />
    </div>

    <div class="slide-container volume">
        <img
            class="volume-low"
            src={vol === 0
                ? "../icons/volume-off.png"
                : "../icons/volume-low.png"}
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
            src="../icons/volume-full.png"
            alt="volume"
            on:click={() => (vol = 100)}
        />
    </div>
    <div class="play-container">
        <button
            class="play"
            disabled={!(lowerVal && upperVal)}
            on:click={() => (!play ? (play = true) : (play = false))}
            >{play ? "Pause" : "Play"}
        </button>
        {#if !(lowerVal && upperVal)}
            <div class="text-info">Select a Pitch Range to Play</div>
        {/if}
    </div>
</section>

<div class="pitch">
    {#if showPitchSelector}
        <PitchSelector
            bind:showPitchSelector
            {lowerVal}
            {upperVal}
            bind:wasClicked
            on:message={handleMessage}
        />
    {/if}
</div>

<style lang="scss">
    .card {
        display: grid;
        box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2),
            0px 3px 4px 0px rgba(0, 0, 0, 0.14),
            0px 1px 8px 0px rgba(0, 0, 0, 0.12);
        background-color: grey;
    }

    .text-info {
        text-align: center;
        margin-bottom: 0.25rem;
    }

    .pitch-select-container,
    .instrument-select-container,
    .bpm-container,
    .play-once-container {
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
    .pitch {
        position: relative;
        top: -24rem;
    }
</style>
