<script>
    import { createEventDispatcher } from "svelte";
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
        grid-template-rows: 10% 75%;
        box-shadow: 5px 4px 8px 8px #888888;
        position: fixed;
        width: 50%;
        top: 20%;
        background: white;

        .close-container {
            margin: 10px 10px 0px 0px;
            .close {
                width: 50px;
                height: 50px;
                border-radius: 25px;
                float: right;
            }
        }

        .pitch-row-container {
            .octave-name {
                margin: 6px;
            }
            .pitch-row {
                display: grid;
                grid-template-columns: 2% 8% 8% 8% 8% 8% 8% 8% 8% 8% 8% 8% 8%;
                padding: 10px 0px;
                .pitch-button {
                    margin: 6px;
                }
            }
        }
    }
</style>

{#if showPitchSelector}
    <section class="pitch-selector-container">
        <div class="close-container">
            <button on:click={closePitchSelector} class="close">X</button>
        </div>
        <div class="pitch-row-container">
            {#each $octaves as octave, i}
                <div class="pitch-row">
                    <div class="octave-name">{i + 1}</div>
                    {#each $pitches as pitch, j}

                            <button
                                class="pitch-button"
                                disabled={(lowerClicked && upperVal && upperVal.frequency <= pitch * octave) || (upperClicked && lowerVal && lowerVal.frequency >= pitch * octave)}
                                on:click={() => sendPitch(pitch, octave, $pitchNames[j], i+1)}>{$pitchNames[j]}
                            </button>
                        
                    {/each}
                </div>
            {/each}
        </div>
    </section>
{/if}
