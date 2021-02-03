<script context="module">
    const oscillators = new Set();
    export function muteAll() {
        console.log("run exported fn");
        oscillators.forEach((oscillator) => {
            console.log(oscillator);
            oscillator.onOffNode.gain.value = 0;
        });
    }
</script>

<script>
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { createNewOscillator } from "../helpers/NewOscillator.svelte";
    import { audioCtx, allPitches } from "../store";
    import PitchSelector from "./PitchSelector.svelte";
    import Pan from "./Pan.svelte";
    import WaveType from "./WaveType.svelte";
    import { writable } from "svelte/store";

    $: console.group("Static Oscillator");
    let onOffVal = writable(false);

    export let id;
    export let i;
    export let pan = pan ? pan : 0;
    export let freq = freq ? freq : 440;
    let oscillator;
    let vol = 50;
    let waveType = "sine";
    let showWaveSelector = false;
    let showPanSelector = false;
    let inputFrequency = false;
    let showPitchSelector = false;
    let pitchName;
    let closestPitch;
    //uses logarithm to make slider with 440 as middle value
    let freqSliderVal = Math.log2(freq);

    //used for keypresses
    let key;
    let ctrl = false;
    let shift = false;

    const dispatch = createEventDispatcher();

    //turns off oscillator if destroyed
    onDestroy(() => {
        oscillator.onOffNode.gain.setValueAtTime(0, $audioCtx.currentTime);
    });

    onMount(() => {
        console.log(oscillators);
        oscillator = createNewOscillator($audioCtx, freq, pan, 1);
        oscillator.id = id;
        oscillator.playing = writable(false);
        oscillators.add(oscillator);
    });

    function playHandler() {
        if ($onOffVal === true) {
            oscillator.onOffNode.gain.setValueAtTime(1, $audioCtx.currentTime);
        } else if ($onOffVal === false) {
            oscillator.onOffNode.gain.setValueAtTime(0, $audioCtx.currentTime);
        }
    }

    function handlePitchSelector(event) {
        if (event.detail.text === "close") {
            showPitchSelector = false;
        }
        if (event.detail.text === "pitch") {
            showPitchSelector = false;
            pitchName = event.detail.note;
            freqSliderVal = Math.log2(event.detail.frequency);
            changeFreqSlider();
        }
    }

    //compensates for log difference between freq and freqSliderVal
    function changeFreqSlider() {
        //console.log("changeslider: ", freq);
        freq = 2 ** freqSliderVal;
    }

    function handleKeydown(e) {
        if (e.ctrlKey) {
            ctrl = true;
        }
        if (e.shiftKey) {
            shift = true;
        }
        key = e.keyCode;

        switch (key) {
            //space
            case 32:
                onOffVal === 1 ? (onOffVal = 0) : (onOffVal = 1);
                break;
            //right arrow
            case 39:
                if (!ctrl && !shift) freq += 1;
                if (ctrl && !shift) freq += 100;
                if (ctrl && shift) freq += 0.1;
                break;
            //left arrow
            case 37:
                if (!ctrl && !shift) freq -= 1;
                if (ctrl && !shift) freq -= 100;
                if (ctrl && shift) freq -= 0.1;
                break;
        }
        key = null;
    }

    function handleKeyup() {
        ctrl ? (ctrl = false) : ctrl;
        shift ? (shift = false) : shift;
    }

    $: {
        if (oscillator) {
            //frequency control
            oscillator.oscNode.frequency.setValueAtTime(
                freq,
                $audioCtx.currentTime
            );
            //finds closest pitch based on current freq
            closestPitch = $allPitches.reduce((a, b) => {
                return Math.abs(b.frequency - freq) <
                    Math.abs(a.frequency - freq)
                    ? b
                    : a;
            });
        }
    }

    //pan control
    $: if (oscillator) oscillator.panNode.setPosition(pan, 0, -1);
    //Wave Type Selector
    $: if (oscillator) oscillator.oscNode.type = waveType;
    $: if (oscillator) playHandler($onOffVal);
    //   $: changeFreqSlider(freqSliderVal);
    $: if (oscillator) console.log(oscillator.$playing);
    //volume control
    $: if (oscillator)
        oscillator.volGainNode.gain.setValueAtTime(
            vol / 100,
            $audioCtx.currentTime
        );
    $: console.log("inside: ", oscillators);
    console.groupEnd();
</script>

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeyup} />
{#if oscillator}
    <section class="card oscillator-container" in:fade>
        <div class="close-container">
            <button
                on:click={() => dispatch("closeStaticOscillator", i)}
                class="close">X</button
            >
        </div>
        <div class="play-vol-container">
            {#key oscillators}
                <button
                    class="play-button {$onOffVal === true
                        ? 'playing'
                        : 'paused'}"
                    on:click={() => {
                        $onOffVal === true
                            ? ($onOffVal = false)
                            : ($onOffVal = true);
                    }}
                    >{$onOffVal === true ? "Pause" : "Play"}
                </button>
                {$onOffVal}
            {/key}

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
        </div>

        <div class="pitch-selector-container">
            <button
                class="pitch-selector"
                on:click={() =>
                    showPitchSelector
                        ? (showPitchSelector = false)
                        : (showPitchSelector = true)}
                >Select a Pitch
            </button>
        </div>

        <!--min and max value of frequency slider are arbitrary. The slider functions logarithmically with 440 as the center-->
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
                        <input
                            type="number"
                            autofocus
                            bind:value={freq}
                            step={1}
                        />
                    {:else}
                        {freq.toFixed(13) != Math.round(freq)
                            ? "~"
                            : ""}{parseFloat(freq.toFixed(2))}
                    {/if}
                    Hz
                    {#if oscillator}
                        <div
                            class="frequency-label pitch"
                            on:click={() => (freq = closestPitch.frequency)}
                        >
                            {#if Math.round(freq) != Math.round(closestPitch.frequency)}
                                {Math.round(freq) >
                                Math.round(closestPitch.frequency)
                                    ? ">"
                                    : "<"}
                            {/if}
                            {closestPitch.note}
                        </div>
                    {/if}
                </div>
                <button
                    class="frequency-arith-button"
                    on:mousedown={() =>
                        (freqSliderVal = Math.log2((freq += 1)))}
                    >&plus 1
                </button>
                <button
                    class="frequency-arith-button"
                    on:click={() => (freqSliderVal = Math.log2((freq *= 2)))}
                    >&times 2
                </button>
            </div>
        </div>
        <div class="pan-wave-container">
            <div class=" wave-select-container">
                <button
                    class="wave-select-button {waveType}"
                    on:click={() =>
                        showWaveSelector
                            ? (showWaveSelector = false)
                            : (showWaveSelector = true)}
                />
                {#if showWaveSelector}
                    <WaveType bind:waveType bind:showWaveSelector />
                {/if}
            </div>

            <div class="slide-container pan">
                <button
                    class="pan-button"
                    on:click={() =>
                        showPanSelector
                            ? (showPanSelector = false)
                            : (showPanSelector = true)}
                >
                    Pan
                </button>
                {#if showPanSelector}
                    <Pan bind:pan bind:showPanSelector />
                {/if}
            </div>
        </div>
    </section>
{/if}
{#if showPitchSelector}
    <PitchSelector
        bind:showPitchSelector
        on:message={handlePitchSelector}
        bind:pitchName
    />
{/if}

<style type="scss">
    .close-container {
        display: flex;
        justify-content: flex-end;
    }
    .play-vol-container {
        display: grid;
        grid-template-columns: 20% 80%;
        margin: 1rem;
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
    }

    .wave-select-container {
        position: relative;
        .wave-select {
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

            .wave-select-box {
                margin: 0.5rem;
            }
        }

        .wave-select-button {
            background-size: contain;
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
    }

    .frequency-container {
        margin: 0 2rem;
        .slider.frequency {
            width: 100%;
        }

        .frequency-controls {
            display: grid;
            grid-template-columns: 18% 18% 28% 18% 18%;
            justify-content: center;

            .frequency-arith-button {
                margin: 0px 5px;
                max-width: 5rem;
            }
        }

        .frequency-label {
            text-align: center;
            input {
                width: 5rem;
            }
        }
    }

    .pan-wave-container {
        display: grid;
        grid-template-columns: auto auto;
        margin: 1rem;
        justify-content: center;
        div {
            margin: 1rem;
        }
    }

    .pitch-selector-container {
        text-align: center;
        margin: 2rem 0;
    }

    @media only screen and (max-width: 768px) {
        .frequency-controls {
            .frequency-arith-button {
                font-size: 0.65rem;
            }
        }
    }
</style>
