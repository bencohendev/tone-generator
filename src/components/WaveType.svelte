<script>
    import { fade } from "svelte/transition";

    export let wavType;
    export let showWavSelector;
</script>

<svelte:window
    on:click={(e) => {
        if (!e.target.classList.value.includes("wav")) showWavSelector = false;
    }}
/>

<div class="wav-select" transition:fade>
    <button
        class="wav-select-box"
        on:click={() => {
            showWavSelector = false;
            wavType = "sine";
        }}>
        <img src="./icons/sine-light.png" alt="sin wave" />
    </button>
    <button
        class="wav-select-box"
        on:click={() => {
            showWavSelector = false;
            wavType = "square";
        }}>
        <img src="./icons/square-light.png" alt="square wave" />
    </button>

    <button
        class="wav-select-box"
        on:click={() => {
            showWavSelector = false;
            wavType = "triangle";
        }}>
        <img src="./icons/triangle-light.png" alt="triangle wave" />
    </button>
    <button
        class="wav-select-box"
        on:click={() => {
            showWavSelector = false;
            wavType = "sawtooth";
        }}>
        <img src="./icons/sawtooth-light.png" alt="sawtooth wave" />
    </button>
</div>

<style lang="scss">
    .wav-select {
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

        .wav-select-box {
            margin: 0.5rem;
        }
    }

    .wav-select-box {
        img {
            width: 20px;
        }
    }
</style>
