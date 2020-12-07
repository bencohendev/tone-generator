<script>
    import { audioCtx, pitches, octaves, pitchNames } from "../store.js";
    import { fade } from "svelte/transition";

    import StaticOscillator from "../components/static/StaticOscillator.svelte";
    import { onMount } from "svelte";

    $: console.group("static");

    let nodes = [];
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
        nodes = [...nodes, newNode];
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
        let nodeCopy = nodes;
        nodeCopy.splice(e.detail, 1);
        nodes = [...nodeCopy];
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
                nodes = [];
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
                nodes = [];
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

        .oscillator-master-control {
            display: flex;
            margin-bottom: 40px;
        }
    }
</style>

<section class="static">
    <section class="oscillator-master-control">
        <button
            class="create-oscillator"
            on:click={() => newOscillator(panVal, onOffVal, freqVal)}>Create
            Oscillator</button>
        <button class="play-all" on:click={playAllHandler}>Play All</button>
        <button class="mute-all" on:click={muteAllHandler}>Mute All</button>
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
    <section class="oscillator-container">
        {#each nodes as node, i (node.id)}
            <div transition:fade>
                <StaticOscillator
                    {node}
                    {i}
                    panVal={node.panVal}
                    onOffVal={node.onOffVal}
                    freqSliderVal={Math.log2(node.freqVal)}
                    {playAllStatus}
                    {muteAllStatus}
                    on:message={handlePitchSelector}
                    on:closeStaticOscillator={handleCloseStaticOscillator} />
            </div>
        {/each}
    </section>
</section>
