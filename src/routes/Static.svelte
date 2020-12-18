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
    let selectedFundamental = 207.6523;
    let selectedOvertones;

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

    function handleSelectedOvertones(selectedFundamental) {
        switch (selectedOvertones) {
            case "1 - 3 - 5":
                oscillatorNodes = [];
                onOffVal = 1;
                newOscillator(
                    (panVal = -1),
                    onOffVal,
                    (freqVal = selectedFundamental)
                );

                newOscillator(
                    (panVal = 1),
                    onOffVal,
                    (freqVal = selectedFundamental * 3)
                );

                newOscillator(
                    (panVal = -1),
                    onOffVal,
                    (freqVal = selectedFundamental * 5)
                );
                selectedOvertones = "Select Overtone Set";
                onOffVal = 0;
                panVal = 0;
                freqVal = 440;
                break;
            case "1 - 3 - 5 - 7":
                onOffVal = 1;
                oscillatorNodes = [];
                newOscillator(
                    (panVal = -1),
                    onOffVal,
                    (freqVal = selectedFundamental)
                );

                newOscillator(
                    (panVal = 1),
                    onOffVal,
                    (freqVal = selectedFundamental * 3)
                );

                newOscillator(
                    (panVal = -1),
                    onOffVal,
                    (freqVal = selectedFundamental * 5)
                );
                newOscillator(
                    (panVal = 1),
                    onOffVal,
                    (freqVal = selectedFundamental * 8)
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
            margin-bottom: 4rem;
            button {
                margin: 1rem;
            }

            .overtone-preset-container {
                display: flex;
                align-items: center;
                select {
                    margin-left: 1rem;
                }
            }
        }
    }
</style>

<div class="static">
    <section class="oscillator-master-control">
        <button
            class="create-oscillator"
            on:click={() => newOscillator(panVal, onOffVal, freqVal)}>Create
            Oscillator</button>
        <button class="play-all paused" on:click={playAllHandler}>Play All</button>
        <button class="mute-all playing" on:click={muteAllHandler}>Mute All</button>
        <div class="overtone-preset-container">
            <select
                name="fundamental-select"
                id="fundamental-select"
                bind:value={selectedFundamental}>
                <option>Select Fundamental</option>
                {#each $octaves as octave, i}
                    {#each $pitches as pitch, j}
                        <option value={pitch * octave}>
                            {$pitchNames[j]}{i}
                        </option>
                    {/each}
                {/each}
            </select>
            <!-- svelte-ignore a11y-no-onchange -->
            <select
                name="overtone-series-select"
                id="overtone-series-select"
                bind:value={selectedOvertones}
                on:change={() => handleSelectedOvertones(selectedFundamental)}>
                <option>Select Overtone Set</option>
                <option>1 - 3 - 5</option>
                <option>1 - 3 - 5 - 7</option>
            </select>
        </div>
    </section>
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
