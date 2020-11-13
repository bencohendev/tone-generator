<script>
    import { context } from "../store.js";

    //this function creates the audio context that the entire app will use
    function createAudioContext() {
        context.set(new (AudioContext || webkitAudioContext)());
    }
</script>

<!--We use this to access the window object on load-->
<svelte:window on:load={createAudioContext()} />
