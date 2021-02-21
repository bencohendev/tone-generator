<script>
    import {
        getTuningInfo,
        initAudio,
        getHarmonics,
        getNotesNumbersFromFrequencies,
    } from "@ddlab/tuner";

    let tuner = false;
    let tunerElem;
    let tunerObj = {};

    function startTuner() {
        tuner ? (tuner = false) : (tuner = true);
        analyseFrequency();
    }

    async function analyseFrequency() {
        console.log("x");
        const { getFreqData, deltaFreq } = await initAudio(); // this must go after some user event
        // testThing(getFreqData, deltaFreq);
        // ...
        const loop = () => {
            const { noteNb, noteStr, cents, isInTune } = getTuningInfo(
                getFreqData(),
                deltaFreq
            );

            // ...
            if (tuner)
                setTimeout(function () {
                    requestAnimationFrame(loop);
                }, 50);
            return (tunerObj = { pitch: noteStr, cents, isInTune });
        };

        requestAnimationFrame(loop);
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
    {#if tuner}
        <div>this will be where the tuner is</div>
        <!-- Create a canvas where the tuner will be rendered -->
        <div
            class="pitch-dial"
            style="transform:rotate({tunerObj.cents * 1.8}deg)"
        />
        <div class="pitch" class:in-tune={tunerObj.isInTune}>
            {tunerObj.pitch}
        </div>
        <div>{tunerObj.cents}</div>
    {/if}
</section>
