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
            //  oscNode.playing = false;

            //initialize node values
            // oscNode.frequency.value = freq;
            // volGainNode.gain.value = 0.5;
            // sequenceGainNode.gain.value = sequence;
            onOffNode.gain.value = 0;
            // panNode.panningModel = "equalpower";
            // if (panNode.positionX) {
            //     panNode.positionX.value = pan;
            //     panNode.positionY.value = 0;
            //     panNode.positionZ.value = -1;
            // } else {
            //     panNode.setPosition(0, 0, -1);
            // }

            //connect node chain
            oscNode.connect(volGainNode);
            volGainNode.connect(sequenceGainNode);
            sequenceGainNode.connect(onOffNode);
            onOffNode.connect(panNode);
            panNode.connect(audioCtx.destination);

            oscNode.start();
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
