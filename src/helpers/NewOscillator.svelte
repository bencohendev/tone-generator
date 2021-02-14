<script context="module">
    export function createNewOscillator(audioCtx, freq, pan, sequence) {
        let oscNode;
        let oscillator = {};
        if (audioCtx) {
            const volGainNode = audioCtx.createGain();
            const sequenceGainNode = audioCtx.createGain();
            const onOffNode = audioCtx.createGain();
            const panNode = audioCtx.createPanner();

            oscNode = audioCtx.createOscillator();
            oscNode.started = false;

            // onOffNode.gain.value = 0;

            //connect node chain
            oscNode.connect(volGainNode);
            volGainNode.connect(sequenceGainNode);
            sequenceGainNode.connect(onOffNode);
            onOffNode.connect(panNode);
            panNode.connect(audioCtx.destination);

            return (oscillator = {
                oscNode,
                volGainNode,
                sequenceGainNode,
                onOffNode,
                panNode,
                initVals: {
                    freq,
                    pan,
                    sequence,
                },
            });
        }
    }
</script>
