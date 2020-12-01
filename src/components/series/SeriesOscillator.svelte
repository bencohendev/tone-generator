<script>
    import { createEventDispatcher, onDestroy, onMount } from "svelte";

    import { audioCtx } from "../../store";
    import PitchSelector from "../PitchSelector.svelte";

    $: console.group("Series Oscillator");

    console.groupEnd();

    export let node;
    export let panVal = 0;
    export let onOffVal = 0;
    export let freqVal = Math.log2(440);
    export let playAllStatus;
    export let muteAllStatus;

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
        console.log("mounted", node);
        if (!node.started) {
            node.start();
            node.started = true;
        }
    });
    node.frequency.setValueAtTime(freqVal, $audioCtx.currentTime);

    onDestroy(() => {
        onOffNode.gain.setValueAtTime(0, $audioCtx.currentTime);
        play = false;
    });

    function playHandler() {
        console.log(freqVal);
        if (!play) {
            onOffNode.gain.setValueAtTime(1, $audioCtx.currentTime);
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
            return (freqVal = Math.log2(event.detail.pitchVal.pitchVal));
        }
    }

    $: {
        //frequency slider control
        node.freqVal = freqVal;
        freq = 2 ** freqVal;

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

</script>

<style lang="scss">
    .oscillator-control {
        display: flex;
        margin: 10px;
        align-items: center;
        justify-content: center;
        box-shadow: 5px 4px 8px 8px #888888;
        padding: 50px;
    }
</style>

<section class="oscillator-control">
    <div>
        
    </div>
</section>