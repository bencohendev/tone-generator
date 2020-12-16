<script>
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import { fade } from "svelte/transition";

    import { audioCtx, allPitches } from "../store";
    import PitchSelector from "./PitchSelector.svelte";

    $: console.group("Static Oscillator");

    export let oscillatorNode;
    export let playAllStatus;
    export let muteAllStatus;
    export let i;

    export let panVal;
    export let onOffVal;
    export let freqSliderVal;

    let play = onOffVal === 1 ? true : false;
    let vol = 50;
    export let freq = Math.round((440 + Number.EPSILON) * 1000) / 1000;
    let wavType = "sine";
    let showPitchSelector = false;
    let showWavSelector = false;
    let showPanSelector = false;
    let inputFrequency = false;
    let octave;
    let pitchName;
    let closestPitch;
    const dispatch = createEventDispatcher();

    //createoscillatorNodes. oscillatorGainNode used for volume control. onOffNode used for playing and pausing. PanoscillatorNode for panning
    const oscillatorGainNode = $audioCtx.createGain();
    const onOffNode = $audioCtx.createGain();
    const panNode = $audioCtx.createPanner();

    //initializeoscillatorNode values
    oscillatorGainNode.gain.setValueAtTime(0.5, $audioCtx.currentTime);
    onOffNode.gain.setValueAtTime(onOffVal, $audioCtx.currentTime);
    panNode.panningModel = "equalpower";
    panNode.setPosition(panVal, 0, 0);

    //connectoscillatorNode chain
    oscillatorNode.connect(oscillatorGainNode);
    oscillatorGainNode.connect(onOffNode);
    onOffNode.connect(panNode);
    panNode.connect($audioCtx.destination);

    oscillatorNode.frequency.setValueAtTime(freq, $audioCtx.currentTime);
    console.log(freq);
    onMount(() => {
        if (!oscillatorNode.started) {
            oscillatorNode.start();
            oscillatorNode.started = true;
        }
    });

    onDestroy(() => {
        onOffNode.gain.setValueAtTime(0, $audioCtx.currentTime);
        play = false;
    });

    function playHandler() {
        if (!play) {
            onOffNode.gain.setValueAtTime(1, $audioCtx.currentTime);
            play = true;
        } else if (play) {
            onOffNode.gain.setValueAtTime(0, $audioCtx.currentTime);
            play = false;
        }
    }

    function playAll() {
        dispatch("message", { text: "playAll" });
        if (!play && playAllStatus) {
            onOffNode.gain.setValueAtTime(1, $audioCtx.currentTime);
            oscillatorNode.onOffVal = 1;
            play = true;
        }
    }
    function muteAll() {
        dispatch("message", { text: "muteAll" });
        if (play && muteAllStatus) {
            onOffNode.gain.setValueAtTime(0, $audioCtx.currentTime);
            onOffVal = 0;
            play = false;
        }
    }

    function pitchSelector() {
        showPitchSelector = true;
    }

    function handlePitchSelector(event) {
        if (event.detail.text === "close") {
            showPitchSelector = false;
        }
        if (event.detail.text === "pitch") {
            showPitchSelector = false;
            pitchName = event.detail.pitchName;
            octave = event.detail.i;
            freqSliderVal = Math.log2(event.detail.frequency);
            changeFreqSlider();
        }
    }
    function changeFreqSlider() {
        freq = 2 ** freqSliderVal;
        oscillatorNode.freqSliderVal = freqSliderVal;
    }

    function handlePanSelector(oscillatorNode) {
        showPanSelector ? (showPanSelector = false) : (showPanSelector = true);
        console.log(oscillatorNode);
    }
    $: {
        freq = Math.round(freq);

        //oscillatorNode.frequency.setValueAtTime(freqSliderVal, $audioCtx.currentTime);
        oscillatorNode.frequency.setValueAtTime(freq, $audioCtx.currentTime);

        //volume control
        oscillatorGainNode.gain.setValueAtTime(
            vol / 100,
            $audioCtx.currentTime
        );
        //pan control
        oscillatorNode.panVal = panVal;
        panNode.setPosition(panVal / 100, 0, 0);

        //Wave Type Selector
        oscillatorNode.type = wavType;

        oscillatorNode.onOffVal = onOffVal;

        playAllStatus = playAllStatus ? playAll() : false;
        muteAllStatus = muteAllStatus ? muteAll() : false;

        closestPitch = $allPitches.reduce((a, b) => {
            return Math.abs(b.frequency - freq) < Math.abs(a.frequency - freq)
                ? b
                : a;
        });
    }

    console.groupEnd();
</script>

<style lang="scss">
    .card {
        margin: 0 1rem 1rem 1rem;
        align-items: center;
        justify-content: center;
        box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2),
            0px 3px 4px 0px rgba(0, 0, 0, 0.14),
            0px 1px 8px 0px rgba(0, 0, 0, 0.12);
        background-color: grey;
    }

    .close-container {
        display: flex;
        justify-content: flex-end;
        .close {
            margin: 1rem 1rem 0 0;
        }
    }

    .vol-pan-wav-container {
        display: grid;
        grid-template-columns: 15% 55% 10% 10%;
        justify-content: center;
        margin: 1rem 0;

        .volume {
            display: flex;
            justify-content: center;
            align-items: center;
            input {
                width: 60%;
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

                .pan-slider {
                    img {
                        width: 20px;

                        &.pan-left-icon {
                            -webkit-transform: scaleX(-1) scaleY(1);
                            transform: scaleX(-1) scaleY(1);
                        }
                    }
                    &::after {
                        content: "";
                        border: solid 1px black;
                        position: relative;
                        left: -25%;
                        top: -1px;
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
                img {
                    width: 20px;
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
            grid-template-columns: 10% 10% 45% 10% 10%;
        }

        .frequency-label {
            text-align: center;
            /* Chrome, Safari, Edge, Opera */
            input::-webkit-outer-spin-button,
            input::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }

            /* Firefox */
            input[type="number"] {
                -moz-appearance: textfield;
            }
            &:hover::after {
                position: absolute;
                display: inline-block;
                bottom: -2px;
                left: 0;
                right: 0;
                margin-left: auto;
                margin-right: auto;
                content: "CLICK TO EDIT";
                font-size: 10px;
                line-height: 13px;
                color: #8e420b;
                border-radius: 3px;
                letter-spacing: 0.7px;
                word-spacing: 1px;
                text-align: center;
                padding: 1px 2px;
            }
        }
        .frequency-click {
            display: none;
        }
        .frequency-click.show {
            display: block;
        }
    }
</style>

<section class="card oscillator-container" transition:fade>
    <div class="close-container">
        <button
            on:click={() => dispatch('closeStaticOscillator', i)}
            class="close">X</button>
    </div>

    <div class="vol-pan-wav-container">
        <button
            class="play-button {play ? 'playing' : 'paused'}"
            on:click={playHandler}>{play ? 'Pause' : 'Play'}
        </button>
        <div class="slide-container volume">
            <img
                class="volume-low"
                src={vol === 0 ? '../icons/volume-off.png' : '../icons/volume-low.png'}
                alt="volume"
                on:click={() => (vol = 0)} />
            <input
                type="range"
                min="0"
                max="100"
                bind:value={vol}
                class="slider volume" />
            <img
                class="volume-full"
                src="../icons/volume-full.png"
                alt="volume"
                on:click={() => (vol = 100)} />
        </div>
        <div class="wav-select-container">
            <button
                class="wav-select-button"
                on:click={() => (showWavSelector ? (showWavSelector = false) : (showWavSelector = true))}>
                <img src="./icons/{wavType}.png" alt="wave type" />
            </button>
            {#if showWavSelector}
                <div class="wav-select" transition:fade>
                    <button
                        class="wav-select-box"
                        on:click={() => {
                            showWavSelector = false;
                            wavType = 'sine';
                        }}>
                        <img src="./icons/sine.png" alt="sin wave" />
                    </button>
                    <button
                        class="wav-select-box"
                        on:click={() => {
                            showWavSelector = false;
                            wavType = 'square';
                        }}>
                        <img src="./icons/square.png" alt="square wave" />
                    </button>

                    <button
                        class="wav-select-box"
                        on:click={() => {
                            showWavSelector = false;
                            wavType = 'triangle';
                        }}>
                        <img src="./icons/triangle.png" alt="triangle wave" />
                    </button>
                    <button
                        class="wav-select-box"
                        on:click={() => {
                            showWavSelector = false;
                            wavType = 'sawtooth';
                        }}>
                        <img src="./icons/sawtooth.png" alt="sawtooth wave" />
                    </button>
                </div>
            {/if}
        </div>

        <div class="slide-container pan">
            <button class="pan-button" on:click={handlePanSelector}><img
                    src="../icons/pan-button.png"
                    alt="pan" />
            </button>
            {#if showPanSelector}
                <div class="pan-controller" transition:fade>
                    <div class="pan-buttons">
                        <button
                            class="pan-left-button"
                            on:click={() => (panVal = -1)}>L</button>
                        <button
                            class="pan-center-button"
                            on:click={() => (panVal = 0)}>C</button>
                        <button
                            class="pan-right-button"
                            on:click={() => (panVal = 1)}>R</button>
                    </div>
                    <div class="pan-slider">
                        <img
                            class="pan-left-icon"
                            src="../icons/pan.png"
                            alt="pan left"
                            on:click={() => (panVal = -1)} />
                        <input
                            type="range"
                            min="-1"
                            max="1"
                            step={0.01}
                            bind:value={panVal}
                            class="slider pan" />
                        <img
                            class="pan-right-icon"
                            src="../icons/pan.png"
                            alt="pan right"
                            on:click={() => (panVal = 1)} />
                    </div>
                </div>
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
                on:change={changeFreqSlider}
                class="slider frequency" />
        </div>
        <div class="frequency-controls">
            <button on:click={() => (freq /= 2)}>/2 </button>
            <button on:click={() => (freq -= 1)}>-1 </button>

            <div
                class="frequency-label"
                on:click={() => (inputFrequency ? (inputFrequency = false) : (inputFrequency = true))}>
                {#if inputFrequency}
                    <input type="number" autofocus bind:value={freq} step={1} />
                {:else}{freq}{/if}
                Hz
                <div class="frequency-click" />
            </div>
            <button on:click={() => (freq += 1)}>+1 </button>
            <button on:click={() => (freq *= 2)}>*2 </button>
        </div>
        <div
            class="frequency-label pitch"
            on:click={() => (freq = closestPitch.frequency)}>
            {Math.round(freq) === Math.round(closestPitch.frequency) ? closestPitch.pitch : '~' + closestPitch.pitch}
        </div>
        <button class="pitch-selector" on:click={pitchSelector}>Select a Pitch</button>
        <PitchSelector
            {showPitchSelector}
            on:message={handlePitchSelector}
            bind:pitchName />
    </div>
</section>
