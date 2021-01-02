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
    let lowerClicked = false;
    let upperClicked = false;
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
    let start = () => {
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
            start();
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
    function handleMessage(event) {
        if (event.detail.text === "close") {
            showPitchSelector = false;
            upperClicked = false;
            lowerClicked = false;
        }
        if (event.detail.text === "pitch") {
            showPitchSelector = false;
            if (lowerClicked) {
                lowerClicked = false;
                return (lowerVal = event.detail);
            }
            if (upperClicked) {
                upperClicked = false;
                return (upperVal = event.detail);
            }
        }
    }
    function pitchSelector(event) {
        if (event.srcElement.id === "lower-val") {
            showPitchSelector = true;
            lowerClicked = true;
            upperClicked = false;
        }
        if (event.srcElement.id === "upper-val") {
            showPitchSelector = true;
            upperClicked = true;
            lowerClicked = false;
        }
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
    $: start(play);

    $: bpm = (60 * 1000) / playSpeed;

    console.groupEnd();
</script>

<style lang="scss">
    .card {
        align-items: center;
        justify-content: center;
        box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2),
            0px 3px 4px 0px rgba(0, 0, 0, 0.14),
            0px 1px 8px 0px rgba(0, 0, 0, 0.12);
        background-color: grey;
    }
    .series {
        align-items: center;
        justify-content: center;
    }
</style>

<section class="series card">
    <!-- svelte-ignore a11y-no-onchange -->
    <select
        name="select-instrument"
        id="select-instrument"
        bind:value={selectedInstrument}
        on:change={() => handleSelectedInstrument(selectedInstrument, lowerVal, upperVal)}>
        <option>Select and Instrument</option>
        <option>Electric Guitar</option>
        <option>Tenor Saxophone</option>
    </select>
    <div>Or Manually Choose a Pitch Range</div>
    {#key lowerVal}
        <button
            id="lower-val"
            class="pitch-selector"
            on:click={pitchSelector}>{lowerVal ? lowerVal.pitchName + lowerVal.i : 'Select a Pitch'}</button>
    {/key}
    {#key upperVal}
        <button
            id="upper-val"
            class="pitch-selector"
            on:click={pitchSelector}>{upperVal ? upperVal.pitchName + upperVal.i : 'Select a Pitch'}</button>
    {/key}
    <div>Set Number of Pitches in Series and Speed</div>
    <input type="number" label="number of pitches" bind:value={numOfPitches} />
    <input type="number" label="play speed" bind:value={playSpeed} />
    <div>Check to only play pitch set once</div>
    <input type="checkbox" bind:checked={playOnce} disabled={play} />
    <select name="wav-type" class="wav-select" bind:value={wavType}>
        <option>Sine</option>
        <option>Triangle</option>
        <option>Sawtooth</option>
        <option>Square</option>
    </select>
    <div class="slide-container volume">
        <input
            type="range"
            min="0"
            max="100"
            bind:value={vol}
            class="slider volume" />
        <div>Volume</div>
    </div>

    <button
        class="play"
        disabled={!(lowerVal && upperVal)}
        on:click={() => (!play ? (play = true) : (play = false))}>{play ? 'Pause' : 'Play'}
    </button>
    {#if !(lowerVal && upperVal)}
        <div>Please Select a Pitch Range</div>
    {/if}
</section>

<div>
    {#if showPitchSelector}
        <PitchSelector
            {showPitchSelector}
            {lowerVal}
            {upperVal}
            {lowerClicked}
            {upperClicked}
            on:message={handleMessage} />
    {/if}
</div>
