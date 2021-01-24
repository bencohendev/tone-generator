<script>
    import { onMount } from "svelte";

    import { audioCtx, pitches, octaves, pitchNames } from "../store.js";
    import uuid from "shortid";
    import StaticOscillator from "../components/StaticOscillator.svelte";
    import { createNewOscillator } from "../services/NewOscillator.svelte";

    $: console.group("static");
    let oscillatorArray = [];
    let newNode;
    let pan = 0;
    let series = 1;
    let freq = 440;
    let selectedOctave;
    let selectedPitch;
    let selectedOvertones;
    let showGenerateOvertones = false;

    onMount(() => {
        audioCtx.set(new (window.AudioContext || window.webkitAudioContext)());
        addNewOscillator(freq, pan);
    });

    function addNewOscillator(freq, pan) {
        let id = uuid.generate();
        newNode = createNewOscillator($audioCtx, freq, pan, series);
        newNode.id = id;
        oscillatorArray = [...oscillatorArray, newNode];
    }

    function handleCloseStaticOscillator(e) {
        oscillatorArray.splice(e.detail, 1);
        oscillatorArray = oscillatorArray;
    }

    function playAllHandler() {
        let isAllPlaying = oscillatorArray.every(
            (oscillator) => oscillator.onOffNode.gain.value === 1
        );
        oscillatorArray.forEach(
            (oscillator) =>
                (oscillator.onOffNode.gain.value = isAllPlaying ? 0 : 1)
        );
        oscillatorArray = oscillatorArray;
    }
    function muteAllHandler() {
        oscillatorArray.forEach(
            (oscillator) => (oscillator.onOffNode.gain.value = 0)
        );
        oscillatorArray = oscillatorArray;
    }

    function handleSelectedOvertones(selectedOctave, selectedPitch) {
        switch (selectedOvertones) {
            case "1 - 3 - 5":
                oscillatorArray = [];
                addNewOscillator(selectedPitch * selectedOctave.multiplier, -1);
                addNewOscillator(
                    selectedPitch * selectedOctave.multiplier * 3,
                    1
                );
                addNewOscillator(
                    selectedPitch * selectedOctave.multiplier * 5,
                    -1
                );

                selectedOvertones = "Select Overtone Set";

                break;
            case "1 - 3 - 5 - 7":
                oscillatorArray = [];
                addNewOscillator(selectedPitch * selectedOctave.multiplier, -1);
                addNewOscillator(
                    selectedPitch * selectedOctave.multiplier * 3,
                    1
                );
                addNewOscillator(
                    selectedPitch * selectedOctave.multiplier * 5,
                    1
                );
                addNewOscillator(
                    selectedPitch * selectedOctave.multiplier * 8,
                    -1
                );
                selectedOvertones = "Select Overtone Set";
                break;
        }
    }

    console.groupEnd();
</script>

<div class="static">
    <section class="oscillator-master-control">
        <button
            class="create-oscillator"
            on:click={() => addNewOscillator(freq, pan)}
            >Add Tone Generator</button
        >
        <button class="play-all paused" on:click={playAllHandler}
            >Play All</button
        >
        <button class="mute-all playing" on:click={muteAllHandler}
            >Mute All</button
        >
        <button
            class="generate-overtones"
            on:click={() => {
                showGenerateOvertones
                    ? (showGenerateOvertones = false)
                    : (showGenerateOvertones = true);
            }}> Generate Overtone Presets </button>
    </section>
    {#if showGenerateOvertones}
        <div class="overtone-preset-container">
            <div>Select a Fundamental</div>
            <div class="overtone-select-container">
                <select
                    name="pitch-select"
                    id="pitch-select"
                    bind:value={selectedPitch}>
                    <option value="51.9131">Pitch</option>
                    {#each $pitches as pitch, j}
                        <option value={pitch}>{$pitchNames[j]}</option>
                    {/each}
                </select>
                <select
                    name="octave-select"
                    id="octave-select"
                    bind:value={selectedOctave}>
                    <option value={$octaves[3]}>Octave</option>
                    {#each $octaves as octave}
                        <option label={octave.label} value={octave} />
                    {/each}
                </select>

                <!-- svelte-ignore a11y-no-onchange -->
                <select
                    name="overtone-series-select"
                    id="overtone-series-select"
                    bind:value={selectedOvertones}
                    on:change={() =>
                        handleSelectedOvertones(selectedOctave, selectedPitch)}>
                    <option>Select Overtone Set</option>
                    <option>1 - 3 - 5</option>
                    <option>1 - 3 - 5 - 7</option>
                </select>
            </div>
        </div>
    {/if}
    {#each oscillatorArray as oscillator, i (oscillator.id)}
        <StaticOscillator
            {oscillator}
            {i}
            pan={oscillator.panNode.positionX.value}
            onOffVal={oscillator.onOffNode.gain.value}
            freq={oscillator.oscNode.frequency.value}
            on:closeStaticOscillator={handleCloseStaticOscillator}
        />
    {/each}
</div>

<style lang="scss">
    .static {
        align-items: center;
        justify-content: center;
        background-color: #4c4c4c;

        .oscillator-master-control {
            display: flex;
            margin-bottom: 2rem;

            button {
                margin: 1rem;
            }
        }
        .overtone-preset-container {
            margin: 1rem;
            select {
                margin-right: 1rem;
            }
        }
    }
    @media only screen and (max-width: 768px) {
        .static {
            .overtone-preset-container {
                margin: 0 0 1rem 0;
            }
        }
    }
</style>
