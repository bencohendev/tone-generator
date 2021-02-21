<script>
    import { onMount } from "svelte";

    let showTuner = false;
    let tunerElem;
    let tunerObj = {};

    let Mycomponent;

    onMount(async () => {
        const module = await import("web-audio-daw");
        Mycomponent = module.default;
        console.log(Mycomponent);
    });

    // var voice = new Wad({ source: "mic" }); // At this point, your browser will ask for permission to access your microphone.
    // var tuner = new Wad.Poly();
    // tuner.setVolume(0); // If you're not using headphones, you can eliminate microphone feedback by muting the output from the tuner.
    // tuner.add(voice);

    // voice.play(); // You must give your browser permission to access your microphone before calling play().

    // tuner.updatePitch(); // The tuner is now calculating the pitch and note name of its input 60 times per second. These values are stored in <code>tuner.pitch</code> and <code>tuner.noteName</code>.

    // var logPitch = function () {
    //     console.log(tuner.pitch, tuner.noteName);
    //     requestAnimationFrame(logPitch);
    // };
    // logPitch();
    // // If you sing into your microphone, your pitch will be logged to the console in real time.

    // tuner.stopUpdatingPitch(); // Stop calculating the pitch if you don't need to know it anymore.
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

<svelte:component this={Mycomponent} />

<section class="tuner-container">
    <button
        class="tuner-button"
        on:click={showTuner ? (showTuner = false) : (showTuner = true)}
    >
        <img
            src="./icons/tuning-fork-light.png"
            alt="tuner"
            class="tuner-icon"
        />
    </button>
    {#if showTuner}
        <div>this will be where the tuner is</div>
        <!-- Create a canvas where the tuner will be rendered -->
        <!-- <div
            class="pitch-dial"
            style="transform:rotate({tunerObj.cents * 1.8}deg)"
        />
        <div class="pitch" class:in-tune={tunerObj.isInTune}>
            {tunerObj.pitch}
        </div>
        <div>{tunerObj.cents}</div> -->
    {/if}
</section>
