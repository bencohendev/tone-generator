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
        position: absolute;
        width: 75%;
        top: 21rem;
        left: 2rem;
        padding: 1rem;
        background-color: rgb(221, 221, 221);
        box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2),
            0px 3px 4px 0px rgba(0, 0, 0, 0.14),
            0px 1px 8px 0px rgba(0, 0, 0, 0.12);
        &::after {
            content: "";
            position: absolute;
            width: 12px;
            height: 12px;
            left: 50%;
            top: -10px;
            transform: translate(-50%, 50%) rotate(45deg);
            background-color: rgb(221, 221, 221);
        }

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

<svelte:window
    on:click={(e) => {
        if (!e.target.classList.value.includes('pitch')) showPitchSelector = false;
    }} />

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
