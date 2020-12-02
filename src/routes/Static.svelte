<script>
    import { audioCtx, pitches, octaves, pitchNames } from "../store.js";
    import StaticOscillator from "../components/static/StaticOscillator.svelte";
    import { onMount } from "svelte";

    $: console.group("static");

    let nodes = [];
    let oscillatorNode;
    let panVal;
    let onOffVal;
    let freqVal;

    let playAllStatus = false;
    let muteAllStatus = false;
    let selectedFundamental = 207.6523;
    let selectedOvertones;

    onMount(() => {
        audioCtx.set(new (window.AudioContext || window.webkitAudioContext)());
        newOscillator();
    });

    function newOscillator(panVal, onOffVal, freqVal) {
        oscillatorNode = $audioCtx.createOscillator();
        oscillatorNode.freqVal = freqVal;
        oscillatorNode.panVal = panVal;
        oscillatorNode.onOffVal = onOffVal;
        console.log(oscillatorNode.panVal, 'static')
        oscillatorNode.started = false;

        nodes = [...nodes, oscillatorNode];
    }

    function handleMessage(e) {
        if (e.detail.text === "playAll") {
            playAllStatus = false;
        }
        if (e.detail.text === "muteAll") {
            muteAllStatus = false;
        }
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
                onOffVal = 1
                newOscillator(
                    (panVal = -1),
                    (onOffVal),
                    (freqVal = Math.log2(selectedFundamental))
                );

                newOscillator(
                    (panVal = 1),
                    (onOffVal),
                    (freqVal = Math.log2(selectedFundamental * 3))
                );

                newOscillator(
                    (panVal = -1),
                    (onOffVal),
                    (freqVal = Math.log2(selectedFundamental * 5))
                );
                selectedOvertones = "Select Overtone Set";
                onOffVal = 0;
                panVal = 0
                freqVal = Math.log2(440)
                break;
            case "1 - 3 - 5 - 7":
            onOffVal = 1
                nodes = [];
                newOscillator(
                    (panVal = -1),
                    (onOffVal),
                    (freqVal = Math.log2(selectedFundamental))
                );

                newOscillator(
                    (panVal = 1),
                    (onOffVal),
                    (freqVal = Math.log2(selectedFundamental * 3))
                );

                newOscillator(
                    (panVal = -1),
                    (onOffVal),
                    (freqVal = Math.log2(selectedFundamental * 5))
                );
                newOscillator(
                    (panVal = 1),
                    (onOffVal),
                    (freqVal = Math.log2(selectedFundamental * 8))
                );
                selectedOvertones = "Select Overtone Set";
                onOffVal = 0;
                panVal = 0
                freqVal = Math.log2(440)
                break;
        }
    }
    console.groupEnd();
</script>

<style lang="scss">
    .static{
        align-items: center;
        justify-content:center;

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
                    <option value={pitch * octave}>{$pitchNames[j]}{i}</option>
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
    {#key nodes}
    {#each nodes as node, i}
        <StaticOscillator
            {node}        
            panVal={node.panVal}
            onOffVal={node.onOffVal}
            freqVal={node.freqVal}
            {playAllStatus}
            {muteAllStatus}
            on:message={handleMessage} />
    {/each}
{/key}
</section>
</section>