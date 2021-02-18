<script context="module">
    export function playFile(audioCtx, bufferLoader, tick, vol) {
        //   let startTime = context.currentTime;
        let source = audioCtx.createBufferSource();
        let gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(vol * 0.01, audioCtx.currentTime);
        switch (tick) {
            case "middle":
                //   Connect graph
                source.buffer = bufferLoader.bufferList[0];
                //  source.loop = true;
                source.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                // Start playback, but make sure we stay in bound of the buffer.
                source.start(0);
                break;
            case "high":
                //   Connect graph
                source.buffer = bufferLoader.bufferList[1];
                //     source.loop = true;
                source.connect(audioCtx.destination);
                // Start playback, but make sure we stay in bound of the buffer.
                source.start(0);
                break;
            case "low":
                //   Connect graph
                source.buffer = bufferLoader.bufferList[2];
                //     source.loop = true;
                source.connect(audioCtx.destination);
                // Start playback, but make sure we stay in bound of the buffer.
                source.start(0);
                break;
        }
        //   console.log(source);
    }
</script>
