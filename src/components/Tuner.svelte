<script>
    import { PitchDetector } from "pitchy";
    import { audioCtx, allPitches } from "../store";
    import { onMount } from "svelte";

    let showTuner = false; //show tuner
    let isInTune = false; //checks if frequency is within 7 cents of nearest pitch
    let Gauge; //Gauge Class
    let gaugeObj; //Gauge object we will create
    let gaugeContainer; //Container where gauge will be displayed
    let closestPitch; //closest pitch to frequency being detected
    let cents; //cents sharp or flat calculated from closest pitch and current frequency

    //Options for Gauge
    let opts = {
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
        colorStart: "#eb4034",
        colorStop: "#eb4034",
        percentColors: [
            [0.0, "#ed1000"],
            [0.5, "#059400"],
            [1.0, "#ed1000"],
        ],
        //staticLabels are currently messing up when user interacts with anything else
        // staticLabels: {
        //     font: "8px ", // Specifies font
        //     labels: [-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50], // Print labels at these values
        //     color: "#000000", // Optional: Label text color
        //     fractionDigits: 0, // Optional: Numerical precision. 0=round off.
        // },
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
        strokeColor: "#E0E0E0",
        generateGradient: true,
        highDpiSupport: true, // High resolution support
    };
    //Mount Gauge library async in order to avoid window reference error
    onMount(async () => {
        const module = await import("gaugeJS");
        Gauge = module.default.Gauge;
    });
    //check if audio stream is active, get pitch, then run updatePitch and create Gauge
    async function startTuner() {
        if (!showTuner) {
            const analyserNode = await $audioCtx.createAnalyser();
            navigator.mediaDevices
                .getUserMedia({ audio: true })
                .then((stream) => {
                    showTuner = true;

                    let sourceNode = $audioCtx.createMediaStreamSource(stream);
                    sourceNode.connect(analyserNode);
                    //PitchDetector library performs fourier transforms to get pitch
                    const detector = PitchDetector.forFloat32Array(
                        analyserNode.fftSize
                    );
                    const input = new Float32Array(detector.inputLength);
                    //run updatePitch
                    updatePitch(
                        analyserNode,
                        detector,
                        input,
                        $audioCtx.sampleRate
                    );
                })
                .then(() => {
                    if (Gauge) {
                        gaugeObj = new Gauge(gaugeContainer).setOptions(opts); // create gauge
                        gaugeObj.maxValue = 50;
                        gaugeObj.setMinValue(-50);
                        gaugeObj.set(0);
                    }
                })
                .catch((e) => {
                    //if no input detected
                    console.log(e);
                    alert("No Audio Source Found. Please Connect a Microphone");
                });
        } else if (showTuner) {
            showTuner = false;
        }
    }

    async function updatePitch(analyserNode, detector, input, sampleRate) {
        //get current frequency being detected from input
        analyserNode.getFloatTimeDomainData(input);
        let [frequency] = detector.findPitch(input, sampleRate);
        frequency = Math.round(frequency * 10) / 10;
        //don't continue if calculated pitch is outside of appropriate frequency range
        if (frequency > 50 && frequency < 22000) {
            //get closeset pitch to current frequency
            closestPitch = await $allPitches.reduce((a, b) => {
                return Math.abs(b.frequency - frequency) <
                    Math.abs(a.frequency - frequency)
                    ? b
                    : a;
            });
            //get cents
            cents = Math.round(
                1200 * Math.log2(closestPitch.frequency / frequency)
            );
            //check if pitch is "in tune"
            cents < 7 && cents > -7 ? (isInTune = true) : (isInTune = false);
            if (gaugeObj) {
                gaugeObj.set(cents); //change gauge value
            }
        }

        if (showTuner)
            //loop update pitch
            setTimeout(function () {
                updatePitch(analyserNode, detector, input, sampleRate);
            }, 100);
        return frequency; //if we want to use frequency...
    }
</script>

<style lang="scss">
    .tuner-container {
        position: relative;
        left: 60%;
        .tuner-container-inner {
            position: absolute;
            right: -5.2rem;
            bottom: 4rem;
            padding: 1rem;
            box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2),
                0px 3px 4px 0px rgba(0, 0, 0, 0.14),
                0px 1px 8px 0px rgba(0, 0, 0, 0.12);
            background-color: #2f3437;
            border-radius: 0.5rem;
        }
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
            font-size: 1rem;
            text-align: center;
            &.in-tune {
                color: green;
            }
        }
    }

    @media only screen and (max-width: 768px) {
        .tuner-container {
            left: 50%;
        }
    }
</style>

<section class="tuner-container">
    {#if showTuner}
        <div class="tuner-container-inner">
            <canvas
                id="tuner-gauge"
                style="width: 170px; height: 90px;"
                bind:this={gaugeContainer}
            />
            <div class="tuner-info-container {isInTune ? 'in-tune' : ''}">
                {#if closestPitch}
                    <div class="note">{closestPitch.note}</div>
                {/if}
                <!-- <div class="pitch">
                {pitch}
            </div>
            <div>{cents}</div> -->
            </div>
        </div>
    {/if}
    <button class="tuner-button" on:click={() => startTuner()}>
        <img
            src="./icons/tuning-fork-light.png"
            alt="tuner"
            class="tuner-icon"
        />
    </button>
</section>
