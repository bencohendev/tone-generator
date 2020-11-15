<script>
    import { createEventDispatcher, onMount } from "svelte";
    import {pitches, pitchNames, octaves} from "../store.js"

    export let showPitchSelector;

    const dispatch = createEventDispatcher();

 

    function closePitchSelector() {
        dispatch("message", { text: "close" });
    }

    function sendPitch(pitch, octave) {
        let pitchVal = pitch * octave;
        dispatch("message", { text: "pitch", pitchVal: { pitchVal } });
    }
</script>

<style>
    .pitch-selector-container {
        position: fixed;
        width: 50vw;
        height: 50vw;
        display: flex;
        box-shadow: 0px 0px 3px 8px;
    }

    .close {
        width: 50px;
        height: 50px;
        border-radius: 25px;
    }
</style>

{#if showPitchSelector}
    <section class="pitch-selector-container">
        <div>I'm a pitch selector!</div>
        <button on:click={closePitchSelector} class="close">X</button>
        <div>
            {#each $octaves as octave}
                {#each $pitches as pitch, i}
                    <button
                        on:click={() => sendPitch(pitch, octave)}>{$pitchNames[i]}</button>
                {/each}
            {/each}
        </div>
    </section>
{/if}
