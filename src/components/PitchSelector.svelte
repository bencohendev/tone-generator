<script>
    import { createEventDispatcher } from "svelte";
    import { fade } from "svelte/transition";
    import { octaves, showPitchSelector, allPitches } from "../store.js";

    export let lowerVal = NaN;
    export let upperVal = NaN;
    export let wasClicked = null;

    const dispatch = createEventDispatcher();

    function closePitchSelector() {
        dispatch("message", { text: "close" });
    }

    function sendPitch(frequency, name, i) {
        dispatch("message", {
            text: "pitch",
            frequency,
            name,
            i,
        });
    }
</script>

<svelte:window
    on:click={(e) => {
        if (!e.target.classList.value.includes("pitch"))
            $showPitchSelector = false;
    }}
/>

<section class="pitch-selector-container" transition:fade>
    <div class="pitch-selector-inner">
        <div class="close-container">
            {#if wasClicked}
                <div class="text-info">
                    Set the {wasClicked != "upper" ? "lower" : "upper"} pitch range
                </div>
            {/if}
            <button on:click={closePitchSelector} class="close">X</button>
        </div>
        <div class="pitch-row-container">
            {#each $octaves as octave, i}
                <div class="pitch-row">
                    {#each $allPitches as pitch, j}
                        {#if octave.label === pitch.octave}
                            <button
                                class="pitch-button {pitch.name.length > 2
                                    ? 'halftone'
                                    : ''}"
                                disabled={(wasClicked != "upper" &&
                                    upperVal.frequency <= pitch.frequency) ||
                                    (wasClicked != "lower" &&
                                        lowerVal.frequency >= pitch.frequency)}
                                on:click={() =>
                                    sendPitch(pitch.frequency, pitch.name, i)}
                                >{pitch.name}
                                <div class="pitch-frequency">
                                    ~{Math.floor(pitch.frequency)}
                                </div>
                            </button>
                        {/if}
                    {/each}
                </div>
            {/each}
        </div>
    </div>
</section>

<style lang="scss">
    .pitch-selector-container {
        display: grid;
        position: fixed;
        width: 100%;
        max-width: 45rem;
        height: 100vh;
        overflow-y: auto;
        top: 10%;
        background-color: rgb(47, 52, 55);
        box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2),
            12px 12px 4px 0px rgba(0, 0, 0, 0.14),
            0px 1px 8px 0px rgba(0, 0, 0, 0.12);
        z-index: 2;
        left: 50%;
        transform: translate(-50%, 0);
        max-height: 45rem;

        .pitch-selector-inner {
            position: absolute;
            width: 100%;
            background-color: rgb(47, 52, 55);
        }

        .close-container {
            margin: 1rem 1rem 2rem 0rem;
            .text-info {
                margin: 0rem 0 0 1rem;
                float: left;
            }

            .close {
                float: right;
            }
        }

        .pitch-row-container {
            margin-top: 4rem;
            padding: 0 1rem 1rem 1rem;

            .pitch-row {
                display: grid;
                grid-template-columns: 8.3% 8.3% 8.3% 8.3% 8.3% 8.3% 8.3% 8.3% 8.3% 8.3% 8.3% 8.3%;
                align-items: center;
                margin-bottom: 0.5rem;
            }
        }
    }

    @media only screen and (max-width: 768px) {
        .pitch-selector-container {
            left: 0;
            top: 0;
            transform: unset;
            max-height: unset;
            .pitch-row-container {
                .pitch-row {
                    grid-template-columns: 16.6% 16.6% 16.6% 16.6% 16.6% 16.6%;
                    grid-template-rows: 50% 50%;
                }
            }
        }
    }
</style>
