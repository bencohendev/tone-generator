<script>
    import { PitchDetector } from "pitchy";
    import { audioCtx, allPitches } from "../store";
    import { onMount } from "svelte";

    let showTuner = false;
    let isInTune = false;
    let Gauge;
    let testVal = 0;
    let tunerElem;
    let gauge;
    let gaugeDemo;
    let closestPitch;
    let cents;
    let tunerObj = {};
    let freq;
    var opts = {
        angle: 0, // The span of the gauge arc
        lineWidth: 0.14, // The line thickness
        radiusScale: 1, // Relative radius
        pointer: {
            length: 0.6, // // Relative to gauge radius
            strokeWidth: 0.015, // The thickness
            color: "#000000", // Fill color
        },
        limitMax: false, // If false, max value increases automatically if value > maxValue
        limitMin: false, // If true, the min value of the gauge will be fixed
        colorStart: "#eb4034", // Colors
        colorStop: "#eb4034", // just experiment with them
        percentColors: [
            [0.0, "#ed1000"],
            [0.5, "#059400"],
            [1.0, "#ed1000"],
        ],
        staticLabels: {
            font: "10px sans-serif", // Specifies font
            labels: [-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50], // Print labels at these values
            color: "#000000", // Optional: Label text color
            fractionDigits: 0, // Optional: Numerical precision. 0=round off.
        },
        renderTicks: {
            divisions: 10,
            divWidth: 1.1,
            divLength: 0.7,
            divColor: "#333333",
            subDivisions: 10,
            subLength: 0.5,
            subWidth: 0.6,
            subColor: "#666666",
        },
        strokeColor: "#E0E0E0", // to see which ones work best for you
        generateGradient: true,
        highDpiSupport: true, // High resolution support
    };

    onMount(async () => {
        const module = await import("gaugeJS");
        Gauge = module.default.Gauge;
    });

    async function startTuner() {
        if (!showTuner) {
            const analyserNode = await $audioCtx.createAnalyser();
            navigator.mediaDevices
                .getUserMedia({ audio: true })
                .then((stream) => {
                    showTuner = true;
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
                .then(() => {
                    if (Gauge) {
                        gauge = new Gauge(gaugeDemo).setOptions(opts); // create sexy gauge!
                        gauge.maxValue = 50; // set max gauge value
                        gauge.setMinValue(-50); // set min value
                        gauge.set(0); // set actual value
                    }
                })
                .catch((e) => {
                    console.log(e);
                    alert("No Audio Source Found. Please Connect a Microphone");
                });
        } else if (showTuner) {
            showTuner = false;
        }
    }

    async function updatePitch(analyserNode, detector, input, sampleRate) {
        analyserNode.getFloatTimeDomainData(input);
        let [pitch] = detector.findPitch(input, sampleRate);
        pitch = Math.round(pitch * 10) / 10;
        //don't continue if calculated pitch is outside of appropriate frequency range
        if (pitch > 50 && pitch < 22000) {
            closestPitch = await $allPitches.reduce((a, b) => {
                return Math.abs(b.frequency - pitch) <
                    Math.abs(a.frequency - pitch)
                    ? b
                    : a;
            });

            cents = Math.round(
                1200 * Math.log2(closestPitch.frequency / pitch)
            );
            cents < 7 && cents > -7 ? (isInTune = true) : (isInTune = false);
            if (gauge) {
                gauge.set(cents);
            }
        }

        if (showTuner)
            setTimeout(function () {
                updatePitch(analyserNode, detector, input, sampleRate);
            }, 100);
        return (tunerObj = { pitch });
    }
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
        .tuner-info-container {
            color: red;
            font-size: 2rem;
            &.in-tune {
                color: green;
            }
        }
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
    <!-- Create a canvas where the tuner will be rendered -->
    {#if showTuner}
        <canvas id="tuner-gauge" bind:this={gaugeDemo} />
        <div class="tuner-info-container {isInTune ? 'in-tune' : ''}">
            <div class="pitch">
                {tunerObj.pitch}
            </div>
            <div>{cents}</div>
            {#if closestPitch}
                <div class="note">{closestPitch.note}</div>
            {/if}
        </div>
    {/if}
</section>
