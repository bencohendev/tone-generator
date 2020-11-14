<script>
    import { createEventDispatcher } from "svelte";

    export let showPitchSelector;

    const dispatch = createEventDispatcher();

    const pitches = [
        32.7032,
        34.6478,
        36.7081,
        38.8909,
        41.2034,
        43.6535,
        46.2493,
        48.9994,
        51.9131,
        55,
        58.2705,
        61.7354,
    ];
    const pitchNames = [
        "c",
        "c#",
        "d",
        "d#",
        "e",
        "f",
        "f#",
        "g",
        "g#",
        "a",
        "a#",
        "b",
    ];

    let octaves = [1, 2, 4, 8, 16, 32, 64, 128, 256];

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
            {#each octaves as octave}
                {#each pitches as pitch, i}
                    <button
                        on:click={() => sendPitch(pitch, octave)}>{pitchNames[i]}{octave * pitch}</button>
                {/each}
            {/each}
        </div>
    </section>
{/if}
