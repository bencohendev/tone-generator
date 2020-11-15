<script>
    import { audioCtx, pitches, octaves, pitchNames } from "../store.js";
    import StaticOscillator from "../components/static/StaticOscillator.svelte";
    import { onMount } from "svelte";

    $: console.group("static");

    let nodes = [];
    let oscillatorNode 
    let panVal;
    let onOffVal;
    let freqVal;
    let playAllStatus = false
    let muteAllStatus = false
   
    onMount(() => {
		audioCtx.set(
			new (window.AudioContext || window.webkitAudioContext)()
        );
        newOscillator()
	});

    function newOscillator() {
        oscillatorNode = $audioCtx.createOscillator();
        nodes = [...nodes, oscillatorNode];
    }

    function handleMessage(e) {
        console.log(e)
        if(e.detail.text === 'playAll') {
            playAllStatus = false
            console.log(playAllStatus)
        }
        if(e.detail.text === 'muteAll') {
            muteAllStatus = false
            console.log(playAllStatus)
        }
    }

    function playAllHandler() {
        playAllStatus = true
    }
    function muteAllHandler() {
        muteAllStatus = true
    }
    console.groupEnd();
</script>

<div>This is the static page</div>
<section class="oscillator-control">
    <button class="create-oscillator" on:click={newOscillator}>Create Oscillator</button>
    <button class="play-all" on:click={playAllHandler}>Play All</button>
    <button class="mute-all" on:click={muteAllHandler}>Mute All</button>
    <div class="overtone-preset-container">
        <select name="fundamental-select" id="fundamental-select">
            {#each $octaves as octave, i}
                {#each $pitches as pitch, j}
                    <option
                        >{$pitchNames[j]}{i}</option>
                {/each}
            {/each}
        </select>
        <select name="overtone-series-select" id="overtone-series-select">
            <option>1 - 3 - 5</option>
            <option>1 - 3 - 5 - 7</option>
        </select>
    </div>
</section>
{#each nodes as node}
    <StaticOscillator {node} {panVal} {onOffVal} {freqVal} {playAllStatus} {muteAllStatus} on:message={handleMessage}/>
{/each}
