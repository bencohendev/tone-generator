<script context="module">
    export function playFile(context, bufferLoader, tick) {
        //   let startTime = context.currentTime;
        let source = context.createBufferSource();
        console.log(source);
        switch (tick) {
            case "middle":
                //   Connect graph
                source.buffer = bufferLoader.bufferList[0];
                //  source.loop = true;
                source.connect(context.destination);
                // Start playback, but make sure we stay in bound of the buffer.
                source.start(0);
                break;
            case "high":
                //   Connect graph
                source.buffer = bufferLoader.bufferList[1];
                //     source.loop = true;
                source.connect(context.destination);
                // Start playback, but make sure we stay in bound of the buffer.
                source.start(0);
                break;
            case "low":
                //   Connect graph
                source.buffer = bufferLoader.bufferList[2];
                //     source.loop = true;
                source.connect(context.destination);
                // Start playback, but make sure we stay in bound of the buffer.
                source.start(0);
                break;
        }
        //   console.log(source);
    }
</script>
