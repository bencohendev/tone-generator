<script>
    import { audioCtx, allPitches, pitchNames } from "../store.js";
    import uuid from "shortid";
    import { fade } from "svelte/transition";

    import { createNewOscillator } from "../services/NewOscillator.svelte";

    console.group("advanced-control");

    export let oscillatorArray = [];
    let newNode;
    let freq = 440;
    let pan = 0;
    let series = 0;

    export let showAllPitches;
    export let pitchesPlayed;
    export let showPitches;

    let interval = 1;
    let modeRadio = "major";
    let modeSelect;
    export let keySelect;
    //array representing pitches in a scale
    export let modeSetter = [0, 2, 4, 5, 7, 9, 11];
    //key array places pitches in order of key chosen by user
    export let keyArray = ["C", "D", "E", "F", "G", "A", "B"];
    export let allowedPitches = [];

    function intervalHandler() {
        //adds oscillators to oscillatorArray if interval increases
        if (interval > oscillatorArray.length) {
            for (interval; interval > oscillatorArray.length; interval) {
                if (pan === 0) {
                    pan = -1;
                }
                pan === -1 ? (pan = 1) : (pan = -1);
                let id = uuid.generate();
                newNode = createNewOscillator($audioCtx, freq, pan, series);
                newNode.id = id;
                newNode.i = oscillatorArray[0].i;
                oscillatorArray = [...oscillatorArray, newNode];
            }
        }
        //subtracts oscillators from oscillatorArray if interval decreases
        if (interval < oscillatorArray.length) {
            for (let i = oscillatorArray.length - 1; i >= interval; i--) {
                oscillatorArray.splice(-1, i);
            }
        }
    }

    async function populateAllowedPitches() {
        allowedPitches = [];
        $allPitches.map((pitch) =>
            keyArray.forEach((key) => {
                if (pitch.name.slice(0, pitch.name.length - 1) === key)
                    allowedPitches.push(pitch);
            })
        );
    }

    async function populateKeyedPitches() {
        allowedPitches = [];
        modeSetter = await modeSelectHandler();
        keyArray = await keyHandler();
        populateAllowedPitches();
    }

    //mode setter is used to create array of pitches for specific modes
    async function modeSelectHandler() {
        modeSetter = [];
        switch (modeSelect) {
            case "ion":
                modeSetter = [0, 2, 4, 5, 7, 9, 11];
                break;
            case "dor":
                modeSetter = [0, 2, 3, 5, 7, 9, 10];
                break;
            case "phr":
                modeSetter = [0, 1, 3, 5, 7, 8, 10];
                break;
            case "lyd":
                modeSetter = [0, 2, 4, 6, 7, 9, 11];
                break;
            case "mix":
                modeSetter = [0, 2, 4, 5, 7, 9, 10];
                break;
            case "aeo":
                modeSetter = [0, 2, 3, 5, 7, 8, 10];
                break;
            case "loc":
                modeSetter = [0, 1, 3, 5, 6, 8, 10];
                break;
            case "melmin":
                modeSetter = [0, 2, 3, 5, 7, 9, 11];
                break;
            case "dorb2":
                modeSetter = [0, 1, 3, 5, 7, 9, 10];
                break;
            case "lydaug":
                modeSetter = [0, 2, 4, 6, 8, 9, 11];
                break;
            case "lyddom":
                modeSetter = [0, 2, 4, 6, 7, 9, 10];
                break;
            case "mixb6":
                modeSetter = [0, 2, 4, 5, 7, 8, 10];
                break;
            case "aeob5":
                modeSetter = [0, 2, 3, 5, 6, 8, 10];
                break;
            case "suploc":
                modeSetter = [0, 1, 3, 5, 6, 8, 10];
                break;
            case "dim-wh":
                modeSetter = [0, 2, 3, 5, 6, 8, 9, 11];
                break;
            case "dim-hw":
                modeSetter = [0, 1, 3, 4, 6, 7, 9, 10];
                break;
            case "aug":
                modeSetter = [0, 2, 4, 6, 8, 10, 12];
                break;
        }
        return modeSetter;
    }
    //key handler returns keyArray with pitches in the correct order based on key chosen by user. mode default to major
    async function keyHandler() {
        keyArray = [];

        //reorders array of pitches based on key
        let pitchFront = $pitchNames.slice(keySelect, 12);
        let pitchBack = $pitchNames.slice(0, keySelect);
        let keyOrdered = pitchFront.concat(pitchBack);

        //populates key array with pitches based on mode setter
        modeSetter.map((key) => {
            let pitchToReturn = keyOrdered[key];
            keyArray.push(pitchToReturn);
        });

        //sets allPitches
        populateAllowedPitches();

        return keyArray;
    }

    $: intervalHandler(interval);

    console.groupEnd();
</script>

<section class="advanced-container" transition:fade>
    <div class="pitch-display-container">
        <button
            on:click={() =>
                showPitches ? (showPitches = false) : (showPitches = true)}
            >{showPitches ? "Hide Pitches" : "Show Pitches"}</button
        >
        <button
            on:click={() =>
                showAllPitches
                    ? (showAllPitches = false)
                    : (showAllPitches = true)}
            >{showAllPitches ? "Hide All Pitches" : "Show All Pitches"}</button
        >
        {#if pitchesPlayed[0]}
            <button on:click={() => (pitchesPlayed = [])}
                >Clear Pitches PLayed</button
            >
        {/if}

        {#if pitchesPlayed[0] && showPitches}
            <!-- {#key pitchesPlayed} -->
            <div>{pitchesPlayed[pitchesPlayed.length - 1]}</div>
            <!-- {/key} -->
        {/if}
        {#if pitchesPlayed[0] && showAllPitches}
            {#key pitchesPlayed}
                <div>{pitchesPlayed.join(" ")}</div>
            {/key}
        {/if}
    </div>
    <div class="interval-mode-container">
        <div class="interval-select-container">
            <h4>Choose How Many Pitches Are Played At Once</h4>

            <div class="interal-input-container">
                <label>
                    <input type="radio" value={1} bind:group={interval} />
                    1
                </label>
                <label>
                    <input type="radio" value={2} bind:group={interval} />
                    2
                </label>
                <label>
                    <input type="radio" value={3} bind:group={interval} />
                    3
                </label>
                <label>
                    <input type="radio" value={4} bind:group={interval} />
                    4
                </label>
            </div>
        </div>
        <div class="key-mode-container">
            <h4>Choose a Mode/Scale</h4>
            <div class="key-mode-input-container">
                <label>
                    <input type="radio" value="major" bind:group={modeRadio} />
                    Major Modes
                </label>
                <label>
                    <input type="radio" value="minor" bind:group={modeRadio} />
                    Minor Modes
                </label>
                <label>
                    <input
                        type="radio"
                        value="symmetrical"
                        bind:group={modeRadio}
                    />
                    Symmetrical Scales
                </label>
            </div>
            <div>
                <!-- svelte-ignore a11y-no-onchange -->
                <select
                    name="select-key"
                    id="select-key"
                    bind:value={keySelect}
                    on:change={keyHandler}>
                    <option>Select a Key</option>
                    {#each $pitchNames as pitchName, i}
                        <option value={i}>{pitchName}</option>
                    {/each}
                </select>
                <!-- svelte-ignore a11y-no-onchange -->
                {#if modeRadio === "major"}
                    <select
                        name="major-mode-key"
                        id="major-mode-key"
                        bind:value={modeSelect}
                        on:change={populateKeyedPitches}>
                        <option>Select a Major Mode</option>
                        <option value="ion">Ionian</option>
                        <option value="dor">Dorian</option>
                        <option value="phr">Phrygian</option>
                        <option value="lyd">Lydian</option>
                        <option value="mix">Mixolidian</option>
                        <option value="aeo">Aeolian</option>
                        <option value="loc">Locrian</option>
                    </select>
                {:else if modeRadio === "minor"}
                    <select
                        name="minor-mode-key"
                        id="minor-mode-key"
                        bind:value={modeSelect}
                        on:change={populateKeyedPitches}>
                        <option>Select a Minor Mode</option>
                        <option value="melmin">Melodic Minor</option>
                        <option value="dorb2">Dorian b2</option>
                        <option value="lydaug">Lydian Augmented</option>
                        <option value="lyddom">Lydian Dominant</option>
                        <option value="mixb6">Mixolidian b6</option>
                        <option value="aeob5">Aeolian b5</option>
                        <option value="suploc">Super Locrian</option>
                    </select>
                {:else if modeRadio === "symmetrical"}
                    <select
                        name="minor-mode-key"
                        id="minor-mode-key"
                        bind:value={modeSelect}
                        on:change={populateKeyedPitches}>
                        <option>Select a Scale</option>
                        <option value="dim-wh">Diminished Whole Half</option>
                        <option value="dim-hw">Diminished Half Whole</option>
                        <option value="aug">Augmented</option>
                    </select>
                {/if}
            </div>
        </div>
    </div>
</section>

<style lang="scss">
    .interval-mode-container {
        display: grid;
        grid-template-columns: 50% 50%;
    }

    .pitch-display-container {
        margin-bottom: 2rem;
    }

    .key-mode-input-container {
        margin-bottom: 0.5rem;
    }
</style>
