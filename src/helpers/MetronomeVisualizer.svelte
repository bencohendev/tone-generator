<script context="module">
    let start;
    let elapsed;
    let brightness = 1;
    let theElement;
    let isDownbeat;
    export function metronomeVisualizer(audioCtx, element, downbeat) {
        /* set up start time. 
        set up elapsed time
        set up brightness
        if elapsed time is less than start time plus some time
            run the animation
            add to elapse
            lessen brightness

        */

        start = audioCtx.currentTime;
        elapsed = audioCtx.currentTime;
        isDownbeat = downbeat;
        theElement = element.getContext("2d");
        requestAnimationFrame(visualize);
    }
    function visualize() {
        if (elapsed < start + 10) {
            theElement.clearRect(0, 0, 75, 75);
            theElement.fillStyle = `rgba(20, 25, 155, ${brightness})`;
            theElement.fillRect(0, 0, 75, 75);
            elapsed += 0.5;
            brightness -= 0.2;
            console.log(theElement, start, elapsed);
            requestAnimationFrame(visualize);
        } else {
            theElement.clearRect(0, 0, 75, 75);
            //      brightness = 1;
        }
    }
</script>
