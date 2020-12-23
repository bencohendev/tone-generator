<script>
    import { onMount } from "svelte";

    import { audioCtx, pitches, octaves, pitchNames } from "../store.js";

    import StaticOscillator from "../components/StaticOscillator.svelte";

    $: console.group("static");
    let oscillatorNodes = [];
    let newNode;
    let panVal = 0;
    let onOffVal = 0;
    let freqVal = 440;
    let id = 0;
    let playAllStatus = false;
    let muteAllStatus = false;
    let selectedOctave;
    let selectedPitch;
    let selectedOvertones;
    let showGenerateOvertones = false;

    onMount(() => {
        audioCtx.set(new (window.AudioContext || window.webkitAudioContext)());
        newOscillator(panVal, onOffVal, freqVal);
    });

    function newOscillator(panVal, onOffVal, freqVal) {
        newNode = $audioCtx.createOscillator();
        newNode.freqVal = freqVal;
        newNode.panVal = panVal;
        newNode.onOffVal = onOffVal;
        newNode.started = false;
        newNode.id = id;
        id++;
        oscillatorNodes = [...oscillatorNodes, newNode];
    }

    function handlePitchSelector(e) {
        if (e.detail.text === "playAll") {
            playAllStatus = false;
        }
        if (e.detail.text === "muteAll") {
            muteAllStatus = false;
        }
    }

    function handleCloseStaticOscillator(e) {
        let oscillatorNodeCopy = oscillatorNodes;
        oscillatorNodeCopy.splice(e.detail, 1);
        oscillatorNodes = [...oscillatorNodeCopy];
    }

    function playAllHandler() {
        playAllStatus = true;
    }
    function muteAllHandler() {
        muteAllStatus = true;
    }

    function handleSelectedOvertones(selectedOctave, selectedPitch) {
        console.log(typeof selectedOctave, selectedOctave);
        typeof selectedOctave === "number"
            ? selectedOctave
            : (selectedOctave = 4);
        typeof selectedPitch === "number"
            ? selectedPitch
            : (selectedPitch = 51.9131);
        switch (selectedOvertones) {
            case "1 - 3 - 5":
                oscillatorNodes = [];
                onOffVal = 0;
                newOscillator(
                    (panVal = -1),
                    onOffVal,
                    (freqVal = selectedPitch * (selectedOctave + 1))
                );

                newOscillator(
                    (panVal = 1),
                    onOffVal,
                    (freqVal = selectedPitch * (selectedOctave + 1) * 3)
                );

                newOscillator(
                    (panVal = -1),
                    onOffVal,
                    (freqVal = selectedPitch * (selectedOctave + 1) * 5)
                );
                selectedOvertones = "Select Overtone Set";
                onOffVal = 0;
                panVal = 0;
                freqVal = 440;
                break;
            case "1 - 3 - 5 - 7":
                onOffVal = 0;
                oscillatorNodes = [];
                newOscillator(
                    (panVal = -1),
                    onOffVal,
                    (freqVal = selectedPitch * (selectedOctave + 1))
                );

                newOscillator(
                    (panVal = 1),
                    onOffVal,
                    (freqVal = selectedPitch * (selectedOctave + 1) * 3)
                );

                newOscillator(
                    (panVal = -1),
                    onOffVal,
                    (freqVal = selectedPitch * (selectedOctave + 1) * 5)
                );
                newOscillator(
                    (panVal = 1),
                    onOffVal,
                    (freqVal = selectedPitch * (selectedOctave + 1) * 8)
                );
                selectedOvertones = "Select Overtone Set";
                onOffVal = 0;
                panVal = 0;
                freqVal = 440;
                break;
        }
    }
    console.groupEnd();
</script>

<style lang="scss">
    .static {
        align-items: center;
        justify-content: center;
        background-color: beige;

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
</style>

<div class="static">
    <section class="oscillator-master-control">
        <button
            class="create-oscillator"
            on:click={() => newOscillator(panVal, onOffVal, freqVal)}>Add Tone
            Generator</button>
        <button class="play-all paused" on:click={playAllHandler}>Play All</button>
        <button class="mute-all playing" on:click={muteAllHandler}>Mute All</button>
        <button
            class="generate-overtones"
            on:click={() => {
                showGenerateOvertones ? (showGenerateOvertones = false) : (showGenerateOvertones = true);
            }}>
            Generate Overtone Presets
        </button>
    </section>
    {#if showGenerateOvertones}
        <div class="overtone-preset-container">
            <div>Select a Fundamental</div>
            <div class="overtone-select-container">
                <select
                    name="pitch-select"
                    id="pitch-select"
                    bind:value={selectedPitch}>
                    <option>Pitch</option>
                    {#each $pitches as pitch, j}
                        <option value={pitch}>{$pitchNames[j]}</option>
                    {/each}
                </select>
                <select
                    name="octave-select"
                    id="octave-select"
                    bind:value={selectedOctave}>
                    <option>Octave</option>
                    {#each $octaves as octave, i}
                        <option value={octave}>{i}</option>
                    {/each}
                </select>

                <!-- svelte-ignore a11y-no-onchange -->
                <select
                    name="overtone-series-select"
                    id="overtone-series-select"
                    bind:value={selectedOvertones}
                    on:change={() => handleSelectedOvertones(selectedOctave, selectedPitch)}>
                    <option>Select Overtone Set</option>
                    <option>1 - 3 - 5</option>
                    <option>1 - 3 - 5 - 7</option>
                </select>
            </div>
        </div>
    {/if}
    {#each oscillatorNodes as oscillatorNode, i (oscillatorNode.id)}
        <StaticOscillator
            {oscillatorNode}
            {i}
            panVal={oscillatorNode.panVal}
            onOffVal={oscillatorNode.onOffVal}
            freq={oscillatorNode.freqVal}
            {playAllStatus}
            {muteAllStatus}
            on:message={handlePitchSelector}
            on:closeStaticOscillator={handleCloseStaticOscillator} />
    {/each}
</div>
