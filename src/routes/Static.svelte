<script>
    import { audioCtx, pitches, octaves, pitchNames } from "../store.js";
    import {fade} from "svelte/transition"

    import StaticOscillator from "../components/static/StaticOscillator.svelte";
    import { onMount } from "svelte";

    $: console.group("static");

    let nodes = [];
    let node;
    let pan = 0;
    let onOff = 0;
    let freq = 440;
    let id = 0;
    let playAllStatus = false;
    let muteAllStatus = false;
    let selectedFundamental = 207.6523;
    let selectedOvertones;

    onMount(() => {
        audioCtx.set(new (window.AudioContext || window.webkitAudioContext)());
        newOscillator(pan, onOff, freq);
    });

    function newOscillator(pan, onOff, freq) {
        node = $audioCtx.createOscillator();
        node.freq = freq;
        node.pan = pan;
        node.onOff = onOff;
        node.started = false;
        node.id = id;
        id++;
        console.log(node.onOff)
        nodes = [...nodes, node];
    }

    function handleMessage(e) {

        if (e.detail.text === "playAll") {
            playAllStatus = false;
        }
        if (e.detail.text === "muteAll") {
            muteAllStatus = false;
        }
    }

    function handleCloseStaticOscillator(e) {
        console.log(nodes, ' before')
        let nodeCopy = nodes
        nodeCopy.splice(e.detail, 1)
        nodes=[...nodeCopy]
        console.log(nodes, ' after')

    }

    function playAllHandler() {
        playAllStatus = true;
    }
    function muteAllHandler() {
        muteAllStatus = true;
    }

    $: if(nodes) console.log(nodes ,' static')

    function handleSelectedOvertones(selectedFundamental) {
        switch (selectedOvertones) {
            case "1 - 3 - 5":
                nodes = [];
                onOff = 1
                newOscillator(
                    (pan = -1),
                    (onOff),
                    (freq = selectedFundamental)
                );

                newOscillator(
                    (pan = 1),
                    (onOff),
                    (freq = selectedFundamental * 3)
                );

                newOscillator(
                    (pan = -1),
                    (onOff),
                    (freq = selectedFundamental * 5)
                );
                selectedOvertones = "Select Overtone Set";
                onOff = 0;
                pan = 0
               freq = Math.log2(440)
                break;
            case "1 - 3 - 5 - 7":
            onOff = 1
                nodes = [];
                newOscillator(
                    (pan = -1),
                    (onOff),
                    (freq = selectedFundamental)
                );

                newOscillator(
                    (pan = 1),
                    (onOff),
                    (freq = selectedFundamental * 3)
                );

                newOscillator(
                    (pan = -1),
                    (onOff),
                    (freq = selectedFundamental * 5)
                );
                newOscillator(
                    (pan = 1),
                    (onOff),
                    (freq = selectedFundamental * 8)
                );
                selectedOvertones = "Select Overtone Set";
                onOff = 0;
                pan = 0
                freq = Math.log2(440)
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
        on:click={() => newOscillator(pan, onOff, freq)}>Create
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
<section class="oscillator-container" >
    {#each nodes as node , i (node.id) }
    <div transition:fade>
        {#key node}
        <StaticOscillator
            {node}      
            {i} 
            pan={node.pan}
            onOff={node.onOff}
            freq={node.freq}
            {playAllStatus}
            {muteAllStatus}
            on:message={handleMessage}
            on:closeStaticOscillator={handleCloseStaticOscillator} 
            />
            {/key}
</div>
    {/each}
</section>
</section>