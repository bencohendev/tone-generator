<script context="module">
    export function createNewOscillator(audioCtx, freq, pan, series) {
        let oscNode;
        let oscillator = {};
        if (audioCtx) {
            const oscGainNode = audioCtx.createGain();
            const seriesGainNode = audioCtx.createGain();
            const onOffNode = audioCtx.createGain();
            const panNode = audioCtx.createPanner();

            oscNode = audioCtx.createOscillator();
            oscNode.started = false;
            oscNode.playing = false;
            //initialize node values
            oscNode.frequency.value = freq;
            oscGainNode.gain.value = 0.5;
            seriesGainNode.gain.value = series;
            onOffNode.gain.value = 0;
            panNode.panningModel = "equalpower";
            if (panNode.positionX) {
                panNode.positionX.value = pan;
                panNode.positionY.value = 0;
                panNode.positionZ.value = -1;
            } else {
                panNode.setPosition(0, 0, -1);
            }

            //connect node chain
            oscNode.connect(oscGainNode);
            oscGainNode.connect(seriesGainNode);
            seriesGainNode.connect(onOffNode);
            onOffNode.connect(panNode);
            panNode.connect(audioCtx.destination);

            oscNode.start();
            return (oscillator = {
                oscNode,
                oscGainNode,
                seriesGainNode,
                onOffNode,
                panNode,
            });
        }
    }
</script>
