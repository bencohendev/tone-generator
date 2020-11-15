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

    console.groupEnd();
</script>

<div>This is the static page</div>
<section class="oscillator-control">
    <button class="create-oscillator" on:click={newOscillator}>Create Oscillator</button>
    <button class="play-all">Play All</button>
    <button class="mute-all">Mute All</button>
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
    <StaticOscillator {node} {panVal} {onOffVal} {freqVal}/>
{/each}
