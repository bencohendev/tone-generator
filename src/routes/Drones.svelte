<script>
    let keys = [
        "a",
        "bb",
        "b",
        "c",
        "db",
        "d",
        "eb",
        "e",
        "f",
        "gb",
        "g",
        "ab",
    ];

    let selectedKey = "ab";
</script>

<section>
    <div>
        {#each keys as key}
            <button
                class="key-btn"
                class:active={key === selectedKey}
                on:click={() => (selectedKey = key)}>{key}</button
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
</style>
