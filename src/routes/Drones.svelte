<script>
    import { pitchNames } from "../store.js";

    let selectedKey = "ab";
    let keys = $pitchNames.map((pitch) => pitch.toLowerCase().substr(0, 2));
</script>

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
        display: flex;
        flex-wrap: wrap;
    }
    .key-btn {
        padding: 1rem;
        margin: 1rem;

        &.active {
            border: solid 1px red;
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
        .drone-container {
            .drone-player {
                width: 30rem;
            }
        }
    }
</style>
