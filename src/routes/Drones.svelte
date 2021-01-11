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

<style lang="scss">
</style>

<section>
    <div>
        {#each keys as key}
            <button on:click={() => (selectedKey = key)}>{key}</button>
        {/each}
    </div>

    <!-- svelte-ignore a11y-media-has-caption -->

    <audio controls src="/audio/{selectedKey}.mp3">
        Your browser does not support the
        <code>audio</code>
        element.
    </audio>
</section>
