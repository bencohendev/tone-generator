<script>
    import { createEventDispatcher, onDestroy, onMount } from "svelte";

    import { audioCtx } from "../../store";
    import PitchSelector from "../PitchSelector.svelte";
    import { fade } from "svelte/transition";

    $: console.group("Static Oscillator");

    export let node;
    export let panVal = 0;
    export let onOffVal = 0;
    export let freqSliderVal = Math.log2(440);
    export let playAllStatus;
    export let muteAllStatus;
    export let i;

    let play = onOffVal === 1 ? true : false;
    let vol = 50;
    let freq = Math.round((440 + Number.EPSILON) * 1000) / 1000;
    let wavType = "Sine";
    let showPitchSelector = false;
    const dispatch = createEventDispatcher();
    //create nodes. oscillatorGainNode used for volume control. onOffNode used for playing and pausing. Pan Node for panning
    const oscillatorGainNode = $audioCtx.createGain();
    const onOffNode = $audioCtx.createGain();
    const panNode = $audioCtx.createPanner();

    //initialize node values
    oscillatorGainNode.gain.setValueAtTime(0.5, $audioCtx.currentTime);
    onOffNode.gain.setValueAtTime(onOffVal, $audioCtx.currentTime);
    panNode.panningModel = "equalpower";
    panNode.setPosition(panVal, 0, 0);

    //connect node chain
    node.connect(oscillatorGainNode);
    oscillatorGainNode.connect(onOffNode);
    onOffNode.connect(panNode);
    panNode.connect($audioCtx.destination);

    onMount(() => {
        if (!node.started) {
            node.start();
            node.started = true;
        }
    });
    node.frequency.setValueAtTime(freqSliderVal, $audioCtx.currentTime);

    onDestroy(() => {
        onOffNode.gain.setValueAtTime(0, $audioCtx.currentTime);
        play = false;
    });

    function playHandler() {
        if (!play) {
            onOffNode.gain.setValueAtTime(1, $audioCtx.currentTime);
            console.log(node, i);
            play = true;
        } else if (play) {
            onOffNode.gain.setValueAtTime(0, $audioCtx.currentTime);
            play = false;
        }
    }

    function playAll() {
        dispatch("message", { text: "playAll" });
        if (!play && playAllStatus) {
            onOffNode.gain.setValueAtTime(1, $audioCtx.currentTime);
            node.onOffVal = 1;
            play = true;
        }
    }
    function muteAll() {
        dispatch("message", { text: "muteAll" });
        if (play && muteAllStatus) {
            onOffNode.gain.setValueAtTime(0, $audioCtx.currentTime);
            onOffVal = 0;

            play = false;
        }
    }
    function closeStaticOscillator() {
        dispatch("message", { text: "closeOscillator" });
    }
    function pitchSelector() {
        showPitchSelector = true;
    }
    //pitch selector function
    function handleMessage(event) {
        if (event.detail.text === "close") {
            showPitchSelector = false;
        }
        if (event.detail.text === "pitch") {
            showPitchSelector = false;
            return (freqSliderVal = Math.log2(event.detail.frequency));
        }
    }
    $: {
        //frequency slider control
        node.freqSliderVal = freqSliderVal;
        freq = 2 ** freqSliderVal;

        node.frequency.setValueAtTime(freq, $audioCtx.currentTime);
        //volume control
        oscillatorGainNode.gain.setValueAtTime(
            vol / 100,
            $audioCtx.currentTime
        );
        //pan control
        node.panVal = panVal;
        panNode.setPosition(panVal / 100, 0, 0);

        //Wave Type Selector
        node.type = wavType.toLowerCase();

        node.onOffVal = onOffVal;

        playAllStatus = playAllStatus ? playAll() : false;
        muteAllStatus = muteAllStatus ? muteAll() : false;
    }

    console.groupEnd();
</script>

<style lang="scss">
    .oscillator-control {
        display: flex;
        margin: 10px;
        align-items: center;
        justify-content: center;
        box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2),
            0px 3px 4px 0px rgba(0, 0, 0, 0.14),
            0px 1px 8px 0px rgba(0, 0, 0, 0.12);
        padding: 50px;
    }
</style>

<section class="oscillator-control">
    <div>
        <div class="close-container">
            <button
                on:click={() => dispatch('closeStaticOscillator', i)}
                class="close">X</button>
        </div>
        <button
            class="play"
            on:click={playHandler}>{play ? 'Pause' : 'Play'}</button>
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
        <div class="slide-container pan">
            <input
                type="range"
                min="-1"
                max="1"
                step={0.01}
                bind:value={panVal}
                class="slider pan" />
            <div>Pan</div>
        </div>
    </div>
    <div>
        <div class="slide-container Frequency">
            <input
                type="range"
                min={3}
                max={14.4}
                step={0.001}
                bind:value={freqSliderVal}
                class="slider frequency" />
            <div>Frequency : {Math.round(freq)}</div>
        </div>
        <button class="pitch-selector" on:click={pitchSelector}>Select a Pitch</button>
    </div>
</section>

<PitchSelector {showPitchSelector} on:message={handleMessage} />
