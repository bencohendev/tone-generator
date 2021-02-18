<script context="module">
    export function playFile(context, bufferLoader) {
        let startTime = context.currentTime;
        let source = context.createBufferSource();

        console.log(source);
        //   Connect graph
        source.buffer = bufferLoader.bufferList[0];
        source.loop = true;
        source.connect(context.destination);
        // Start playback, but make sure we stay in bound of the buffer.
        source.start(0);
    }
</script>
