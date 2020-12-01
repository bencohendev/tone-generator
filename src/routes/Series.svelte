<script>
    import { audioCtx, pitches, octaves, pitchNames } from "../store.js";
    import StaticOscillator from "../components/static/StaticOscillator.svelte";
    import { onMount } from "svelte";
    console.group('series');
    //let nodes = [];
    let oscillatorNode;
    // let panVal = 0;
    // let onOffVal = 0;
    // let freqVal;
    let vol = 50;

    // let playAllStatus = false;
    // let muteAllStatus = false;
    // let selectedFundamental = 207.6523;
    // let selectedOvertones;

    onMount(() => {
        audioCtx.set(new (window.AudioContext || window.webkitAudioContext)());
        oscillatorNode = $audioCtx.createOscillator();
        oscillatorNode.freqVal = 440;
        oscillatorNode.panVal = 0;
        oscillatorNode.onOffVal = 0;
        oscillatorNode.started = false;    
    });

    // function newOscillator(panVal, onOffVal, freqVal) {
    //     oscillatorNode = $audioCtx.createOscillator();
    //     oscillatorNode.freqVal = freqVal;
    //     oscillatorNode.panVal = panVal;
    //     oscillatorNode.onOffVal = onOffVal;
    //     console.log(oscillatorNode.panVal, 'static')
    //     oscillatorNode.started = false;

    //     nodes = [...nodes, oscillatorNode];
    // }

   
    console.groupEnd();
</script>

<style lang="scss">
    .series{
        align-items: center;
        justify-content:center;
    }
</style>

<section class="series">

    <select>Select An Instrument
        <option>Electric Guitar</option>
        <option>Tenor Sax</option>
    </select>
    <div>Or Manually Choose a Pitch Range</div>
    <select>
        <option>initial pitch</option>
    </select>
    <select>
        <option>final pitch</option>
    </select>
    <div>Set Number of Pitches in Series and Speed</div>
    <input type="number" label="number of pitches">
    <input type="number" label="play speed">
    <div>Check to only play pitch set once</div>
    <input type="checkbox">
    <select>
        <option>sine</option>
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
</section>
