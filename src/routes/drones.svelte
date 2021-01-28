<script>
    import { pitchNames } from "../store.js";

    let selectedKey = "ab";
    let keys = $pitchNames.map((pitch) =>
        pitch.length === 1 ? pitch.toLowerCase() : pitch.toLowerCase().substr(3)
    );
</script>

<svelte:head>
    <title>Drones</title>
</svelte:head>
<section>
    <div class="key-btn-container">
        {#each keys as key, i}
            <button
                class="key-btn"
                class:active={key === selectedKey}
                on:click={() => (selectedKey = key)}>{$pitchNames[i]}</button
            >
        {/each}
    </div>

    <!-- svelte-ignore a11y-media-has-caption -->
    <div class="drone-container">
        <audio class="drone-player" controls src="/audio/{selectedKey}.mp3">
            Your browser does not support the
            <code>audio</code>
            element.
        </audio>
    </div>
</section>

<style lang="scss">
    .key-btn-container {
        display: grid;
        grid-template-columns: 16.6% 16.6% 16.6% 16.6% 16.6% 16.6%;
    }
    .key-btn {
        margin: 0.4rem;

        &.active {
            &.active {
                box-shadow: 0px 0px 4px 5px rgba(20, 108, 22, 1);
            }
        }
    }
    .drone-container {
        display: grid;
        justify-content: center;
        margin-top: 2rem;
        .drone-player {
            width: 50rem;
        }
    }

    @media only screen and (max-width: 768px) {

        .key-btn {
            font-size: .65rem;
        }
        .drone-container {
            .drone-player {
                width: 20rem;
            }
        }
    }
</style>
