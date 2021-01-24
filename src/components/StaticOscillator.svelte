<script>
    import { createEventDispatcher, onDestroy } from "svelte";
    import { fade } from "svelte/transition";

    import { audioCtx, allPitches, showPitchSelector } from "../store";
    import PitchSelector from "./PitchSelector.svelte";
    import Pan from "./Pan.svelte";
    import WaveType from "./WaveType.svelte";

    $: console.group("Static Oscillator");

    export let oscillator;
    export let i;
    export let pan = pan ? pan : 1;
    export let onOffVal;
    export let freq = freq ? freq : 440;

    let vol = 50;
    let wavType = "sine";
    let showWavSelector = false;
    let showPanSelector = false;
    let inputFrequency = false;
    let pitchName;
    let closestPitch;
    let freqSliderVal = Math.log2(freq);

    const dispatch = createEventDispatcher();
    onDestroy(() => {
        oscillator.onOffNode.gain.setValueAtTime(0, $audioCtx.currentTime);
    });

    function playHandler() {
        if (onOffVal === 1) {
            oscillator.onOffNode.gain.setValueAtTime(1, $audioCtx.currentTime);
        } else if (onOffVal === 0) {
            oscillator.onOffNode.gain.setValueAtTime(0, $audioCtx.currentTime);
        }
    }

    function handlePitchSelector(event) {
        if (event.detail.text === "close") {
            $showPitchSelector = false;
        }
        if (event.detail.text === "pitch") {
            $showPitchSelector = false;
            pitchName = event.detail.pitchName;
            freqSliderVal = Math.log2(event.detail.frequency);
            changeFreqSlider();
        }
    }
    function changeFreqSlider() {
        freq = 2 ** freqSliderVal;
    }

    $: {
        //frequency control
        oscillator.oscNode.frequency.setValueAtTime(
            freq,
            $audioCtx.currentTime
        );
        // freqSliderVal = Math.log2(freq);
        closestPitch = $allPitches.reduce((a, b) => {
            //            console.log(b);
            return Math.abs(b.frequency - freq) < Math.abs(a.frequency - freq)
                ? b
                : a;
        });
    }

    //pan control
    $: oscillator.panNode.setPosition(pan, 0, -1);
    //Wave Type Selector
    $: oscillator.oscNode.type = wavType;
    $: playHandler(onOffVal);
    //   $: changeFreqSlider(freqSliderVal);

    //volume control
    $: oscillator.oscGainNode.gain.setValueAtTime(
        vol / 100,
        $audioCtx.currentTime
    );
    console.groupEnd();
</script>

<section class="card oscillator-container" transition:fade>
    <div class="close-container">
        <button
            on:click={() => dispatch("closeStaticOscillator", i)}
            class="close">X</button
        >
    </div>

    <div class="vol-pan-wav-container">
        <button
            class="play-button {onOffVal === 1 ? 'playing' : 'paused'}"
            on:click={() => {
                onOffVal === 1 ? (onOffVal = 0) : (onOffVal = 1);
            }}>{onOffVal === 1 ? "Pause" : "Play"}
        </button>
        <div class="slide-container volume">
            <img
                class="volume-low"
                src={vol === 0
                    ? "../icons/volume-off-light.png"
                    : "../icons/volume-low-light.png"}
                alt="volume"
                on:click={() => (vol = 0)}
            />
            <input
                type="range"
                min="0"
                max="100"
                bind:value={vol}
                class="slider volume"
            />
            <img
                class="volume-full"
                src="../icons/volume-full-light.png"
                alt="volume"
                on:click={() => (vol = 100)}
            />
        </div>

        <div class=" wav-select-container">
            <button
                class="wav-select-button {wavType}"
                on:click={() =>
                    showWavSelector
                        ? (showWavSelector = false)
                        : (showWavSelector = true)}>
                {#if showWavSelector}
                    <WaveType bind:wavType bind:showWavSelector />
                {/if}
            </button>
        </div>

        <div class="slide-container pan">
            <button
                class="pan-button"
                on:click={() =>
                    showPanSelector
                        ? (showPanSelector = false)
                        : (showPanSelector = true)}> Pan </button>
            {#if showPanSelector}
                <Pan bind:pan bind:showPanSelector />
            {/if}
        </div>
    </div>

    <div class="frequency-container">
        <div class="slide-container Frequency">
            <input
                type="range"
                min={3}
                max={14.4}
                step={0.001}
                bind:value={freqSliderVal}
                on:input={changeFreqSlider}
                class="slider frequency"
            />
        </div>
        <div class="frequency-controls">
            <button
                class="frequency-arith-button"
                on:click={() => (freqSliderVal = Math.log2((freq *= 0.5)))}
                >&divide; 2
            </button>
            <button
                class="frequency-arith-button"
                on:click={() => (freqSliderVal = Math.log2((freq -= 1)))}
                >&minus 1
            </button>

            <div
                class="frequency-label"
                on:click={() =>
                    inputFrequency
                        ? (inputFrequency = false)
                        : (inputFrequency = true)}
            >
                {#if inputFrequency}
                    <input type="number" autofocus bind:value={freq} step={1} />
                {:else}{parseFloat(freq.toFixed(2))}{/if}
                Hz
                <div class="frequency-click" />
            </div>
            <button
                class="frequency-arith-button"
                on:mousedown={() => (freqSliderVal = Math.log2((freq += 1)))}
                >&plus 1
            </button>
            <button
                class="frequency-arith-button"
                on:click={() => (freqSliderVal = Math.log2((freq *= 2)))}
                >&times 2
            </button>
        </div>
        <div
            class="frequency-label pitch"
            on:click={() => (freq = closestPitch.frequency)}
        >
            {Math.round(freq) === Math.round(closestPitch.frequency)
                ? closestPitch.name
                : "~" + closestPitch.name}
        </div>
        <div class="pitch-selector-button-container">
            <button
                class="pitch-selector"
                on:click={() =>
                    $showPitchSelector
                        ? ($showPitchSelector = false)
                        : ($showPitchSelector = true)}>Select a Pitch
            </button>
        </div>
    </div>
</section>
{#if $showPitchSelector}
    <PitchSelector
        bind:$showPitchSelector
        on:message={handlePitchSelector}
        bind:pitchName
    />
{/if}

<style type="scss">
    .close-container {
        display: flex;
        justify-content: flex-end;
        .close {
            margin: 1rem 1rem 0 0;
        }
    }

    .vol-pan-wav-container {
        display: grid;
        grid-template-columns: 20% 50% 10% 10%;
        justify-content: center;
        margin: 1rem 0;

        .play-button {
            width: 5rem;
        }

        .volume {
            display: flex;
            justify-content: center;
            align-items: center;
            input {
                width: 60%;
                margin: 0rem 0.5rem;
            }
            img {
                width: 20px;
            }
        }

        .pan {
            position: relative;

            img {
                width: 40px;
            }

            .pan-controller {
                display: grid;
                position: absolute;
                top: 3rem;
                left: -20%;
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

                .pan-buttons {
                    display: grid;
                    grid-template-columns: 33% 33% 33%;
                    justify-content: center;

                    button {
                        margin: 1rem;
                        font-size: 10px;
                        width: 25px;
                        height: 25px;
                    }
                    .pan-left-button {
                        position: relative;
                        right: 25%;
                    }

                    .pan-right-button {
                        position: relative;
                        left: 25%;
                    }
                }
            }
        }

        .wav-select-container {
            position: relative;
            .wav-select {
                position: absolute;
                top: 3rem;
                left: -100%;
                background-color: rgb(221, 221, 221);
                display: flex;
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
                    //box-shadow: 0 1px 8px rgba(0, 0, 0, 0.5);
                }

                .wav-select-box {
                    margin: 0.5rem;
                }
            }

            .wav-select-button {
                background-size: contain;
                margin-right: 1rem;
                background-position: center;
                background-repeat: no-repeat;
                width: 40px;
                height: 100%;
                &.sine {
                    background-image: url("/icons/sine-light.png");
                }
                &.square {
                    background-image: url("/icons/square-light.png");
                }
                &.triangle {
                    background-image: url("/icons/triangle-light.png");
                }
                &.sawtooth {
                    background-image: url("/icons/sawtooth-light.png");
                }
            }
            .wav-select-box {
                img {
                    width: 20px;
                }
            }
        }
    }

    .frequency-container {
        margin: 0 2rem;
        .slider.frequency {
            width: 100%;
        }

        .frequency-controls {
            display: grid;
            grid-template-columns: 15% 15% 40% 15% 15%;
            justify-content: center;

            .frequency-arith-button {
                margin: 0px 5px;
            }
        }

        .frequency-label {
            text-align: center;
        }
    }

    .pitch-selector-button-container {
        display: grid;
        justify-content: center;
        margin-bottom: 1rem;
        grid-template-rows: 100% auto;

        .pitch-selector {
            margin: 1rem 0;
        }
    }
</style>
