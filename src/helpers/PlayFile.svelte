<script context="module">
    export function playFile(audioCtx, bufferLoader, tick, vol) {
        let source = audioCtx.createBufferSource();
        let gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(vol * 0.01, audioCtx.currentTime);
        switch (tick) {
            case "middle":
                //   get audio from bufferList
                source.buffer = bufferLoader.bufferList[0];
                //  source.loop = true;
                source.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                // Start playback, but make sure we stay in bound of the buffer.
                source.start(0);
                break;
            case "high":
                source.buffer = bufferLoader.bufferList[1];
                source.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                source.start(0);
                break;
            case "low":
                source.buffer = bufferLoader.bufferList[2];
                source.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                source.start(0);
                break;
        }
    }
</script>
