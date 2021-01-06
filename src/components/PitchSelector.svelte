<script>
    import { createEventDispatcher } from "svelte";
    import { fade } from "svelte/transition";

    import { pitches, pitchNames, octaves } from "../store.js";

    export let showPitchSelector;
    export let lowerVal = NaN;
    export let upperVal = NaN;
    export let wasClicked;

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
        position: relative;

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
        .pitch-selector-inner {
            position: absolute;
            width: 100%;
            background-color: rgb(221, 221, 221);
            padding: 1rem;
        }

        .close-container {
            margin: 1rem 1rem 2rem 0rem;
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
    <div class="pitch-selector-inner">
        <div class="close-container">
            <button on:click={closePitchSelector} class="close">X</button>
        </div>
        <div class="pitch-row-container">
            {#each $octaves as octave, i}
                <div class="octave-name">{i + 1}</div>
                <div class="pitch-row">
                    {#each $pitches as pitch, j}
                        <button
                            class="pitch-button"
                            disabled={(wasClicked != 'upper' && upperVal.frequency <= pitch * octave) || (wasClicked != 'lower' && lowerVal.frequency >= pitch * octave)}
                            on:click={() => sendPitch(pitch, octave, $pitchNames[j], i)}>{$pitchNames[j]}
                        </button>
                    {/each}
                </div>
            {/each}
        </div>
    </div>
</section>
