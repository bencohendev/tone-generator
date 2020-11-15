<script>
    import { audioCtx } from "../store.js";
    import StaticOscillator from "../components/static/StaticOscillator.svelte";
    $: console.group("static");

    let node;
    let nodes = [];

    let onOff = 0;
    //node.start();
    function newOscillator(onOff) {
        const oscillatorNode = $audioCtx.createOscillator();

        nodes = [...nodes, oscillatorNode];

        // console.log(nodes);
    }

    // $: if ($audioCtx) {
    //     node = $audioCtx.createOscillator();
    //     console.log(node, "node");
    // }
    console.groupEnd();
</script>

<div>This is the static page</div>
<section class="oscillator-control">
    <button class="create-oscillator" on:click={newOscillator}>Create Oscillator</button>
    <button class="play-all">Play All</button>
    <button class="mute-all">Mute All</button>
    <div class="overtone-preset-container">
        <select name="fundamental-select" id="fundamental-select"></select>
        <select name="overtone-series-select" id="overtone-series-select"></select>
    </div>
</section>
{#each nodes as node}
    <StaticOscillator {node} />
{/each}
