<script>
    import { onDestroy, onMount } from "svelte";
    import { audioCtx } from "../store";

    let tuner = false;

    var isPlaying = false;
    var sourceNode = null;
    var analyser = null;
    var theBuffer = null;
    var DEBUGCANVAS = null;
    var mediaStreamSource = null;
    var detectorElem,
        canvasElem,
        waveCanvas,
        pitchElem,
        noteElem,
        detuneElem,
        detuneAmount;

    onMount(() => {
        audioCtx.set(new (window.AudioContext || window.webkitAudioContext)());
        //  MAX_SIZE = Math.max(4, Math.floor($audioCtx.sampleRate / 5000));

        canvasElem = document.getElementById("output");
    });

    function error() {
        alert("Stream generation failed.");
    }

    function getUserMedia(dictionary, callback) {
        try {
            navigator.getUserMedia =
                navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia;
            navigator.getUserMedia(dictionary, callback, error);
        } catch (e) {
            alert("getUserMedia threw exception :" + e);
        }
    }

    function gotStream(stream) {
        // Create an AudioNode from the stream.
        mediaStreamSource = $audioCtx.createMediaStreamSource(stream);

        // Connect it to the destination.
        analyser = $audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        mediaStreamSource.connect(analyser);
        updatePitch();
    }

    function toggleLiveInput() {
        getUserMedia(
            {
                audio: {
                    mandatory: {
                        googEchoCancellation: "false",
                        googAutoGainControl: "false",
                        googNoiseSuppression: "false",
                        googHighpassFilter: "false",
                    },
                    optional: [],
                },
            },
            gotStream
        );
    }

    var rafID = null;
    var tracks = null;
    var buflen = 2048;
    var buf = new Float32Array(buflen);

    var noteStrings = [
        "C",
        "C#",
        "D",
        "D#",
        "E",
        "F",
        "F#",
        "G",
        "G#",
        "A",
        "A#",
        "B",
    ];

    function noteFromPitch(frequency) {
        var noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
        return Math.round(noteNum) + 69;
    }

    function frequencyFromNoteNumber(note) {
        return 440 * Math.pow(2, (note - 69) / 12);
    }

    function centsOffFromPitch(frequency, note) {
        return Math.floor(
            (1200 * Math.log(frequency / frequencyFromNoteNumber(note))) /
                Math.log(2)
        );
    }
    function autoCorrelate(buf, sampleRate) {
        // Implements the ACF2+ algorithm
        var SIZE = buf.length;
        var rms = 0;

        for (var i = 0; i < SIZE; i++) {
            var val = buf[i];
            rms += val * val;
        }
        rms = Math.sqrt(rms / SIZE);
        if (rms < 0.01)
            // not enough signal
            return -1;

        var r1 = 0,
            r2 = SIZE - 1,
            thres = 0.2;
        for (var i = 0; i < SIZE / 2; i++)
            if (Math.abs(buf[i]) < thres) {
                r1 = i;
                break;
            }
        for (var i = 1; i < SIZE / 2; i++)
            if (Math.abs(buf[SIZE - i]) < thres) {
                r2 = SIZE - i;
                break;
            }

        buf = buf.slice(r1, r2);
        SIZE = buf.length;

        var c = new Array(SIZE).fill(0);
        for (var i = 0; i < SIZE; i++)
            for (var j = 0; j < SIZE - i; j++)
                c[i] = c[i] + buf[j] * buf[j + i];

        var d = 0;
        while (c[d] > c[d + 1]) d++;
        var maxval = -1,
            maxpos = -1;
        for (var i = d; i < SIZE; i++) {
            if (c[i] > maxval) {
                maxval = c[i];
                maxpos = i;
            }
        }
        var T0 = maxpos;

        var x1 = c[T0 - 1],
            x2 = c[T0],
            x3 = c[T0 + 1];
        a = (x1 + x3 - 2 * x2) / 2;
        b = (x3 - x1) / 2;
        if (a) T0 = T0 - b / (2 * a);

        return sampleRate / T0;
    }

    function updatePitch(time) {
        var cycles = new Array();
        analyser.getFloatTimeDomainData(buf);
        var ac = autoCorrelate(buf, $audioCtx.sampleRate);
        // TODO: Paint confidence meter on canvasElem here.
        console.log(ac);
        if (DEBUGCANVAS) {
            // This draws the current waveform, useful for debugging
            waveCanvas.clearRect(0, 0, 512, 256);
            waveCanvas.strokeStyle = "red";
            waveCanvas.beginPath();
            waveCanvas.moveTo(0, 0);
            waveCanvas.lineTo(0, 256);
            waveCanvas.moveTo(128, 0);
            waveCanvas.lineTo(128, 256);
            waveCanvas.moveTo(256, 0);
            waveCanvas.lineTo(256, 256);
            waveCanvas.moveTo(384, 0);
            waveCanvas.lineTo(384, 256);
            waveCanvas.moveTo(512, 0);
            waveCanvas.lineTo(512, 256);
            waveCanvas.stroke();
            waveCanvas.strokeStyle = "black";
            waveCanvas.beginPath();
            waveCanvas.moveTo(0, buf[0]);
            for (var i = 1; i < 512; i++) {
                waveCanvas.lineTo(i, 128 + buf[i] * 128);
            }
            waveCanvas.stroke();
        }

        if (ac == -1) {
            detectorElem.className = "vague";
            pitchElem.innerText = "--";
            noteElem.innerText = "-";
            detuneElem.className = "";
            detuneAmount.innerText = "--";
        } else {
            console.log("x");
            detectorElem.className = "confident";
            pitch = ac;
            pitchElem.innerText = Math.round(pitch);
            var note = noteFromPitch(pitch);
            noteElem.innerHTML = noteStrings[note % 12];
            var detune = centsOffFromPitch(pitch, note);
            if (detune == 0) {
                detuneElem.className = "";
                detuneAmount.innerHTML = "--";
            } else {
                if (detune < 0) detuneElem.className = "flat";
                else detuneElem.className = "sharp";
                detuneAmount.innerHTML = Math.abs(detune);
            }
        }
    }
</script>

<style lang="scss">
    .tuner {
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
    }
    @media only screen and (max-width: 768px) {
        .tuner {
            bottom: 5rem;
        }
    }
</style>

<section class="tuner">
    <button
        class="tuner-button"
        on:click={() => (tuner ? (tuner = false) : (tuner = true))}
    >
        <img
            src="./icons/tuning-fork-light.png"
            alt="tuner"
            class="tuner-icon"
        />
    </button>
    {#if tuner}
        <button on:click={() => toggleLiveInput()}>use live input</button>
        <div>this will be where the tuner is</div>
        <div id="detector" class="vague" bind:this={detectorElem}>
            <div class="pitch">
                <span id="pitch" bind:this={pitchElem}>--</span>Hz
            </div>
            <div class="note" bind:this={noteElem}>
                <span id="note">--</span>
            </div>
            <canvas
                id="output"
                width="300"
                height="42"
                bind:this={canvasElem}
            />
            <div id="detune" bind:this={detuneElem}>
                <span id="detune_amt" bind:this={detuneAmount}>--</span><span
                    id="flat">cents &#9837;</span
                ><span id="sharp">cents &#9839;</span>
            </div>
        </div>
    {/if}
</section>
