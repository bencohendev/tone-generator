<!-- <script>
    import { onMount } from "svelte";

    let mounted = false;
    let tunerReady = false;
    let tuner = false;
    let containerElem;
    var Settings = {
        container: containerElem,
        backgroundColor: "white", // or hex colors "#ffffff"
        notOkayColor: "orange",
        okayColor: "green",
        fontColor: "black",
    };

    onMount(() => {
        mounted = true;
        if (tunerReady) {
            initializeTuner();
        }
    });
    function tunerLoaded() {
        tunerReady = true;
        if (mounted) {
            loadTuner();
        }
    }
    function initializeTuner() {
        // Create a single or multiple instance of tuners at time
        var tuners = [
            new OnlineTuner.Controller.GuitareTuner(
                new OnlineTuner.Widget.CircleWidget(
                    Settings.container,
                    Settings.backgroundColor,
                    Settings.notOkayColor,
                    Settings.okayColor,
                    Settings.fontColor
                )
            ),
        ];

        // Initialize the tuner with the callbacks
        new OnlineTuner.Analyser(tuners).install(
            function () {
                console.log("Succesfully initialized");
            },
            function (errorMessage) {
                console.error("Oops, this shouldn't happen", errorMessage);
            }
        );
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
</style> -->

<!-- <svelte:head>
    <script
        src="https://cdn.rawgit.com/citronneur/onlinetuner.co/master/js/onlinetuner.min.js"
        on:load={tunerLoaded} ✂prettier:content✂="">{}</script>
</svelte:head>
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
        <div>this will be where the tuner is</div> -->
<!-- Create a canvas where the tuner will be rendered -->
<!-- <canvas id="guitar-tuner" height="300" bind:this={containerElem} />
    {/if}
</section> -->
