<script context="module">
    export function createNewOscillator(audioCtx, freq, pan, series) {
        let oscNode;
        let oscillator = {};
        if (audioCtx) {
            const oscillatorGainNode = audioCtx.createGain();
            const seriesGainNode = audioCtx.createGain();
            const onOffNode = audioCtx.createGain();
            const panNode = audioCtx.createPanner();

            oscNode = audioCtx.createOscillator();
            // oscNode.freqVal = 440;
            // oscNode.panVal = 0;
            // oscNode.onOffVal = 0;
            oscNode.started = false;
            oscNode.playing = false;
            //initialize node values
            oscNode.frequency.value = freq;
            oscillatorGainNode.gain.value = 0.5;
            seriesGainNode.gain.value = series;
            onOffNode.gain.value = 0;
            panNode.panningModel = "equalpower";
            panNode.setPosition(pan, 0, 0);

            //connect node chain
            oscNode.connect(oscillatorGainNode);
            oscillatorGainNode.connect(seriesGainNode);
            seriesGainNode.connect(onOffNode);
            onOffNode.connect(panNode);
            panNode.connect(audioCtx.destination);

            oscNode.start();
            return (oscillator = {
                oscNode,
                oscillatorGainNode,
                seriesGainNode,
                onOffNode,
                panNode,
            });
        }
    }
</script>
