<script>
    import { audioCtx } from "../../store";

    $: console.group("Static Oscillator");

    export let node;
    let vol = "50";
    let pan = "0";
    let freq = Math.round((440 + Number.EPSILON) * 1000) / 1000;
    let freqVal = Math.log2(440);
    //create nodes. oscillatorGainNode used for volume control. onOffNode used for playing and pausing. Pan Node for panning
    const oscillatorGainNode = $audioCtx.createGain();
    const onOffNode = $audioCtx.createGain();
    const panNode = $audioCtx.createPanner();

    //initialize node values
    oscillatorGainNode.gain.setValueAtTime(0.15, $audioCtx.currentTime);
    onOffNode.gain.setValueAtTime(0.5, $audioCtx.currentTime);
    panNode.panningModel = "equalpower";
    panNode.setPosition(0, 0, 0);

    //connect node chain
    node.connect(oscillatorGainNode);
    oscillatorGainNode.connect(onOffNode);
    onOffNode.connect(panNode);
    panNode.connect($audioCtx.destination);

    node.start();

    node.frequency.setValueAtTime(440, $audioCtx.currentTime);

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
        panNode.setPosition(pan / 100, 0, 0);
    }
    console.groupEnd();
</script>

<div>static oscillator</div>
<section class="oscillator-container">
    <button class="play">Play</button>
    <select name="wav-type" class="wav-select">
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
            bind:value={pan}
            class="slider pan" />
    </div>
    <div class="slide-container">
        <input
            type="range"
            min={3}
            max={14.5}
            step={0.001}
            bind:value={freqVal}
            class="slider frequency" />
        <div>{freq}</div>
    </div>
    <button class="pitch-selector">Select a Pitch</button>
</section>
