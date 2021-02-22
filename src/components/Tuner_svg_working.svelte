<script>
    import { PitchDetector } from "pitchy";
    import { audioCtx, allPitches } from "../store";
    import { onMount } from "svelte";
    import Gauge from "../libs/svg-gauge-master/dist/gauge.min";

    let showTuner = false;
    let testVal = 0;
    let tunerElem;
    let aGauge;
    let gaugeDemo;
    let closestPitch;
    let cents;
    let tunerObj = {};
    let freq;
    onMount(() => {
        audioCtx.set(new (window.AudioContext || window.webkitAudioContext)());
        if (gaugeDemo) {
            aGauge = Gauge(gaugeDemo, {
                dialRadius: 40,
                dialStartAngle: -90,
                dialEndAngle: -90.001,
                value: testVal,
                max: 50,
                min: -50,
                valueDialClass: "value",
                valueClass: "value-text",
                dialClass: "dial",
                gaugeClass: "gauge",
                showValue: true,
                gaugeColor: null,
                label: function (testVal) {
                    return Math.round(testVal);
                }, // returns a string label that will be rendered in the center
            });
        }
    });
    //  Math.round(1200*Math.log2(e/t)
    /*
     */

    function updateGauge() {
        testVal += 10;
        console.log(aGauge);
        aGauge.setValueAnimated(testVal);
    }
    async function startTuner() {
        const analyserNode = await $audioCtx.createAnalyser();
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
                showTuner ? (showTuner = false) : (showTuner = true);

                let sourceNode = $audioCtx.createMediaStreamSource(stream);

                sourceNode.connect(analyserNode);
                const detector = PitchDetector.forFloat32Array(
                    analyserNode.fftSize
                );
                const input = new Float32Array(detector.inputLength);
                updatePitch(
                    analyserNode,
                    detector,
                    input,
                    $audioCtx.sampleRate
                );
            })
            .catch((e) => {
                console.log(e);
                alert("No Audio Source Found. Please Connect a Microphone");
            });
    }

    async function updatePitch(analyserNode, detector, input, sampleRate) {
        analyserNode.getFloatTimeDomainData(input);
        let [pitch, clarity] = detector.findPitch(input, sampleRate);
        pitch = Math.round(pitch * 10) / 10;
        closestPitch = await $allPitches.reduce((a, b) => {
            return Math.abs(b.frequency - pitch) < Math.abs(a.frequency - pitch)
                ? b
                : a;
        });

        cents = Math.round(1200 * Math.log2(closestPitch.frequency / pitch));
        if (showTuner)
            setTimeout(function () {
                updatePitch(analyserNode, detector, input, sampleRate);
            }, 100);
        return (tunerObj = { pitch });
    }
    $: {
    }
    console.log(gaugeDemo);
</script>

<style lang="scss">
    .tuner-container {
        position: fixed;
        bottom: 10rem;
        left: 50%;
        .tuner-button {
            box-shadow: 0px 0px 5px 9px rgba(0, 0, 0, 0.2),
                0px 2px 2px 0px rgba(0, 0, 0, 0.14),
                0px 1px 5px 0px rgba(0, 0, 0, 0.12);
        }
        .tuner-icon {
            width: 30px;
        }
        .pitch {
            color: red;
            font-size: 2rem;
            &.in-tune {
                color: green;
            }
        }
        .pitch-dial {
            background-image: url("../icons/needle.png");
            width: 500px;
            height: 500px;
        }
    }

    .gauge-container {
        width: 300px;
        .gauge {
            .dial {
                stroke: #eee;
                stroke-width: 2;
                fill: rgba(0, 0, 0, 0);
            }
        }
    }

    .gauge-container > .gauge > .value {
        stroke: rgb(47, 227, 255);
        stroke-width: 2;
    }

    .gauge-container > .gauge > .value-text {
        fill: rgb(47, 227, 255);
        font-family: sans, "sans-serif";
        font-weight: bold;
        font-size: 0.6em;
    }
    @media only screen and (max-width: 768px) {
        .tuner-container {
            bottom: 5rem;
        }
    }
</style>

<section class="tuner-container">
    <button class="tuner-button" on:click={() => startTuner()}>
        <img
            src="./icons/tuning-fork-light.png"
            alt="tuner"
            class="tuner-icon"
        />
    </button>
    <div id="gauge-demo" class="gauge-container" bind:this={gaugeDemo} />
    <button on:click={updateGauge}>+10</button>

    {#if showTuner}
        <div>this will be where the tuner is</div>
        <!-- Create a canvas where the tuner will be rendered -->
        <div class="pitch-dial" style="transform:rotate(90deg)" />
        <div class="pitch">
            {tunerObj.pitch}
        </div>
        <div>{cents}</div>
        {#if closestPitch}
            <div>{closestPitch.note}</div>
        {/if}
    {/if}
</section>
