<script>
    import { fade } from "svelte/transition";

    export let wavType;
    export let showWaveSelector;
</script>

<svelte:window
    on:click={(e) => {
        if (!e.target.classList.value.includes("wave"))
            showWaveSelector = false;
    }}
/>

<div class="wave-select" transition:fade>
    <button
        class="wave-select-box"
        on:click={() => {
            showWaveSelector = false;
            wavType = "sine";
        }}>
        <img src="./icons/sine-light.png" alt="sin wave" class="wave-image" />
    </button>
    <button
        class="wave-select-box"
        on:click={() => {
            showWaveSelector = false;
            wavType = "square";
        }}>
        <img
            src="./icons/square-light.png"
            alt="square wave"
            class="wave-image"
        />
    </button>

    <button
        class="wave-select-box"
        on:click={() => {
            showWaveSelector = false;
            wavType = "triangle";
        }}>
        <img
            src="./icons/triangle-light.png"
            alt="triangle wave"
            class="wave-image"
        />
    </button>
    <button
        class="wave-select-box"
        on:click={() => {
            showWaveSelector = false;
            wavType = "sawtooth";
        }}>
        <img
            src="./icons/sawtooth-light.png"
            alt="sawtooth wave"
            class="wave-image"
        />
    </button>
</div>

<style lang="scss">
    .wave-select {
        position: absolute;
        top: 3rem;
        left: -5.3rem;
        background-color: rgb(221, 221, 221);
        display: flex;
        box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2),
            0px 3px 4px 0px rgba(0, 0, 0, 0.14),
            0px 1px 8px 0px rgba(0, 0, 0, 0.12);
        &::after {
            content: "";
            position: absolute;
            width: 12px;
            height: 12px;
            left: 50%;
            top: -10px;
            transform: translate(-50%, 50%) rotate(45deg);
            background-color: rgb(221, 221, 221);
            //box-shadow: 0 1px 8px rgba(0, 0, 0, 0.5);
        }

        .wave-select-box {
            margin: 0.5rem;
        }
    }

    .wave-select-box {
        img {
            width: 20px;
        }
    }
</style>
