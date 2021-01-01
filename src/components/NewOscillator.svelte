<script context="module">
    import { onMount } from "svelte";
    let oscNode;
    //export const audioCtx = new (window.AudioContext || webkitAudioContext)();

    //const audioCtx = new AudioContext();

    export function createNewOscillator() {
        //audioCtx.set();
        const oscillatorGainNode = audioCtx.createGain();
        const seriesGainNode = audioCtx.createGain();
        const onOffNode = audioCtx.createGain();
        const panNode = audioCtx.createPanner();

        oscNode = audioCtx.createOscillator();
        oscNode.freqVal = 440;
        oscNode.panVal = 0;
        oscNode.onOffVal = 0;
        oscNode.started = false;

        //initialize node values
        oscillatorGainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        seriesGainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        onOffNode.gain.setValueAtTime(0, audioCtx.currentTime);
        panNode.panningModel = "equalpower";
        panNode.setPosition(0, 0, 0);

        //connect node chain
        oscNode.connect(oscillatorGainNode);
        oscillatorGainNode.connect(seriesGainNode);
        seriesGainNode.connect(onOffNode);
        onOffNode.connect(panNode);
        panNode.connect(audioCtx.destination);

        oscNode.start();
        return (node = {
            oscNode,
            oscillatorGainNode,
            seriesGainNode,
            onOffNode,
            panNode,
        });
    }
</script>
