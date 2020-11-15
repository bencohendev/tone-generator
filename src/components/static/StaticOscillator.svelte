<script>
    import { audioCtx } from "../../store";
    import PitchSelector from "../PitchSelector.svelte";

    $: console.group("Static Oscillator");

    export let node;
    export let panVal = 0;
    export let onOffVal = 0;
    export let freqVal = Math.log2(440);

    let play = false;
    let vol = 50;
    let freq = Math.round((440 + Number.EPSILON) * 1000) / 1000;
    let wavType = "Sine";
    let showPitchSelector = false;

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

    node.start();

    node.frequency.setValueAtTime(freqVal, $audioCtx.currentTime);

    function playHandler() {
        if (!play) {
            onOffNode.gain.setValueAtTime(1, $audioCtx.currentTime);
            play = true;
        } else if (play) {
            onOffNode.gain.setValueAtTime(0, $audioCtx.currentTime);
            play = false;
        }
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
            return (freqVal = Math.log2(event.detail.pitchVal.pitchVal));
        }
    }
    $: {
        //frequency slider control
        freq = 2 ** freqVal;
        node.frequency.setValueAtTime(freq, $audioCtx.currentTime);
        //volume control
        oscillatorGainNode.gain.setValueAtTime(
            vol / 100,
            $audioCtx.currentTime
        );
        //pan control
        panNode.setPosition(panVal / 100, 0, 0);

        //Wave Type Selector
        node.type = wavType.toLowerCase();
    }
    console.groupEnd();
</script>

<div>static oscillator</div>
<section class="oscillator-container">
    <button
        class="play"
        on:click={playHandler}>{play ? 'Pause' : 'Play'}</button>
    <select name="wav-type" class="wav-select" bind:value={wavType}>
        <option>Sine</option>
        <option>Triangle</option>
        <option>Sawtooth</option>
        <option>Square</option>
    </select>
    <div class="slide-container">
        <input
            type="range"
            min="0"
            max="100"
            bind:value={vol}
            class="slider volume" />
    </div>
    <div class="slide-container">
        <input
            type="range"
            min="-100"
            max="100"
            bind:value={panVal}
            class="slider pan" />
    </div>
    <div class="slide-container">
        <input
            type="range"
            min={3}
            max={14.4}
            step={0.001}
            bind:value={freqVal}
            class="slider frequency" />
        <div>{Math.round(freq)}</div>
    </div>
    <button class="pitch-selector" on:click={pitchSelector}>Select a Pitch</button>
</section>

<PitchSelector {showPitchSelector} on:message={handleMessage} />
