<script>
    import { createEventDispatcher } from "svelte";
    import { fade } from "svelte/transition";

    import { pitches, pitchNames, octaves } from "../store.js";

    export let showPitchSelector;
    export let lowerVal = null;
    export let upperVal = null;
    export let lowerClicked = null;
    export let upperClicked = null;

    const dispatch = createEventDispatcher();

    function closePitchSelector() {
        dispatch("message", { text: "close" });
    }

    function sendPitch(pitch, octave, pitchName, i) {
        let frequency = pitch * octave;
        dispatch("message", {
            text: "pitch",
            frequency,
            pitchName,
            i,
        });
    }
</script>

<style lang="scss">
    .pitch-selector-container {
        display: grid;
        grid-template-rows: 2% 75%;
        box-shadow: 5px 4px 8px 8px #888888;
        background: white;
        max-width: 56rem;
        width: 96%;
        top: 20vh;

        .close-container {
            margin: 1rem 1rem 0rem 0rem;
            .close {
                float: right;
            }
        }

        .pitch-row-container {
            .octave-name {
                margin: 6px;
            }
            .pitch-row {
                display: grid;

                grid-template-columns: 25% 25% 25% 25%;
                padding: 1rem 0px;
                grid-template-rows: 25% 25% 25% 25%;
                align-items: center;
                .pitch-button {
                    margin: 0.5rem;
                }
            }
        }
    }
</style>

{#if showPitchSelector}
    <section class="pitch-selector-container" transition:fade>
        <div class="close-container">
            <button on:click={closePitchSelector} class="close">X</button>
        </div>
        <div class="pitch-row-container">
            {#each $octaves as octave, i}
                <div class="octave-name">{i}</div>
                <div class="pitch-row">
                    {#each $pitches as pitch, j}
                        <button
                            class="pitch-button"
                            disabled={(lowerClicked && upperVal && upperVal.frequency <= pitch * octave) || (upperClicked && lowerVal && lowerVal.frequency >= pitch * octave)}
                            on:click={() => sendPitch(pitch, octave, $pitchNames[j], i + 1)}>{$pitchNames[j]}
                        </button>
                    {/each}
                </div>
            {/each}
        </div>
    </section>
{/if}
