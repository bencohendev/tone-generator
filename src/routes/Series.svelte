<script>
    import { audioCtx, pitches, octaves, pitchNames } from "../store.js";
    import { onMount } from "svelte";
    import PitchSelector from "../components/PitchSelector.svelte";

    console.group("series");
    let oscillatorNode;
    let onOffVal = 0;
    let node = {};
    let vol = 50;
    let play = onOffVal === 1 ? true : false;
    let wavType = "sine";
    let showPitchSelector = false;
    let lowerClicked = false;
    let upperClicked = false;
    let lowerVal;
    let upperVal;
    let bpm = 60;
    let numOfPitches = 1;
    let playOnce = false;
    let freqRange = [];
    let allPitches = [];
    let intervalID = null;

    onMount(() => {
        populateAllPitches();
        audioCtx.set(new (window.AudioContext || window.webkitAudioContext)());
        const oscillatorGainNode = $audioCtx.createGain();
        const seriesGainNode = $audioCtx.createGain();
        const onOffNode = $audioCtx.createGain();
        const panNode = $audioCtx.createPanner();

        oscillatorNode = $audioCtx.createOscillator();
        oscillatorNode.freqVal = 440;
        oscillatorNode.panVal = 0;
        oscillatorNode.onOffVal = 0;
        oscillatorNode.started = false;

        //initialize node values
        oscillatorGainNode.gain.setValueAtTime(0.5, $audioCtx.currentTime);
        seriesGainNode.gain.setValueAtTime(0, $audioCtx.currentTime);
        onOffNode.gain.setValueAtTime(0, $audioCtx.currentTime);
        panNode.panningModel = "equalpower";
        panNode.setPosition(0, 0, 0);

        //connect node chain
        oscillatorNode.connect(oscillatorGainNode);
        oscillatorGainNode.connect(seriesGainNode);
        seriesGainNode.connect(onOffNode);
        onOffNode.connect(panNode);
        panNode.connect($audioCtx.destination);

        oscillatorNode.start();
        return (node = {
            oscillatorNode,
            oscillatorGainNode,
            seriesGainNode,
            onOffNode,
            panNode,
        });
    });
    let pitchMultiplier = 1;

    let populateAllPitches = () => {
        for (let i = 0; i < 9; i++) {
            for (let j = 1; j <= $pitches.length; j++) {
                allPitches.push({
                    pitch: $pitchNames[j] + i,
                    frequency: $pitches[j] * pitchMultiplier,
                });
            }
            pitchMultiplier = pitchMultiplier * 2;
        }
    };
    function playHandler() {
        if  (lowerVal && upperVal)
        if (!play) {
            node.onOffNode.gain.setValueAtTime(1, $audioCtx.currentTime);
            play = true;
        } else if (play) {
            node.onOffNode.gain.setValueAtTime(0, $audioCtx.currentTime);
            play = false;
        }
    }

    //pitch selector function
    function handleMessage(event) {
        if (event.detail.text === "close") {
            showPitchSelector = false;
        }
        if (event.detail.text === "pitch") {
            showPitchSelector = false;
            if (lowerClicked) {
                lowerClicked = false;
                return (lowerVal = event.detail);
            }
            if (upperClicked) {
                upperClicked = false;
                return (upperVal = event.detail);
            }
        }
    }
    function pitchSelector(event) {
        if (event.srcElement.id === "lower-val") {
            showPitchSelector = true;
            lowerClicked = true;
        }
        if (event.srcElement.id === "upper-val") {
            showPitchSelector = true;
            upperClicked = true;
        }
    }

    $: {
        //if statement checks to ensure all node values are returned
        if (node.panNode) {
            //volume control
            node.oscillatorGainNode.gain.setValueAtTime(
                vol / 100,
                $audioCtx.currentTime
            );

            //Wave Type Selector
            node.oscillatorNode.type = wavType.toLowerCase();
        

        numOfPitches = numOfPitches;
        bpm = bpm;
        playOnce = playOnce;
        if (lowerVal && upperVal) {
            freqRange = allPitches.filter(
                (pitch) =>
                    pitch.frequency >= lowerVal.pitchVal &&
                    pitch.frequency <= upperVal.pitchVal
            );
            console.log(freqRange)
        }
        console.log(play)
        if (play ) {    
            node.onOffNode.gain.setTargetAtTime(1, $audioCtx.currentTime, .001)        
            if (!playOnce) {
                let i = 0;
                intervalID = setInterval(() => {
                    i++;
                    if (i === parseInt(numOfPitches) + 1) {
                        node.seriesGainNode.gain.setTargetAtTime(
                            0,
                            $audioCtx.currentTime,
                            0.001
                        );
                        i = 0;
                    } else {
                        const pitchToPlay =
                            freqRange[
                                Math.floor(Math.random() * freqRange.length)
                            ];
                        console.log(pitchToPlay.frequency);
                        console.log(node)
                        node.oscillatorNode.frequency.setValueAtTime(pitchToPlay.frequency, $audioCtx.currentTime)
                        node.seriesGainNode.gain.setTargetAtTime(
                            1,
                            $audioCtx.currentTime,
                            0.001
                        );
                    }
                    setTimeout(() => {
                        node.seriesGainNode.gain.setTargetAtTime(
                            0,
                            $audioCtx.currentTime,
                            0.001
                        );
                    }, bpm - bpm / 4);
                }, bpm);
                () => clearInterval(intervalID);
            }
        } else if (!play) {
            clearInterval(intervalID);
        }
    }
    }

    console.groupEnd();
</script>

<style lang="scss">
    .series {
        align-items: center;
        justify-content: center;
    }
</style>

<section class="series">
    <select>Select An Instrument
        <option>Electric Guitar</option>
        <option>Tenor Sax</option>
    </select>
    <div>Or Manually Choose a Pitch Range</div>
    <button
        id="lower-val"
        class="pitch-selector"
        on:click={pitchSelector}>{lowerVal ? lowerVal.pitchName + lowerVal.i : 'Select a Pitch'}</button>
    <button
        id="upper-val"
        class="pitch-selector"
        on:click={pitchSelector}>{upperVal ? upperVal.pitchName + lowerVal.i : 'Select a Pitch'}</button>

    <div>Set Number of Pitches in Series and Speed</div>
    <input type="number" label="number of pitches" bind:value={numOfPitches} />
    <input type="number" label="play speed" bind:value={bpm} />
    <div>Check to only play pitch set once</div>
    <input type="checkbox" bind:checked={playOnce} />
    <select name="wav-type" class="wav-select" bind:value={wavType}>
        <option>Sine</option>
        <option>Triangle</option>
        <option>Sawtooth</option>
        <option>Square</option>
    </select>
    <div class="slide-container volume">
        <input
            type="range"
            min="0"
            max="100"
            bind:value={vol}
            class="slider volume" />
        <div>Volume</div>
    </div>
    <button
        class="play"
        on:click={playHandler}>{play ? 'Pause' : 'Play'}</button>
</section>
<PitchSelector
    {showPitchSelector}
    {lowerVal}
    {upperVal}
    {lowerClicked}
    {upperClicked}
    on:message={handleMessage} />
