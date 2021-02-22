<script>
	import Nav from "../components/Nav.svelte";
	import Metronome from "../components/Metronome.svelte";
	import Tuner from "../components/Tuner.svelte";
	import { onMount } from "svelte";
	import { pitchObj, allPitches, opacityToggle } from "../store.js";
	let pitchArrayConstructor = [];

	export let segment;

	//multiplier is used to programatically create allPitches
	let themultiplier = 1;

	//These three pitches cannot be added programatically as they fall outside of the full octave
	let lowestPitches = [
		{
			note: "B0",
			frequency: 30.86770632850775,
			octave: 0,
			multiplier: 1,
		},
		{
			note: "Gb/A#0",
			frequency: 29.13523509488062,
			octave: 0,
			multiplier: 1,
		},
		{
			note: "A0",
			frequency: 27.5,
			octave: 0,
			multiplier: 1,
		},
	];

	//populateAllPitches runs on mount of site itself. It creates a complete array of pitch objects
	onMount(() => {
		$allPitches = populateAllPitches();
	});

	let populateAllPitches = () => {
		for (let i = 1; i < 9; i++) {
			for (let j = 0; j < $pitchObj.length; j++) {
				pitchArrayConstructor.push({
					note: $pitchObj[j].note + i,
					frequency: $pitchObj[j].frequency * themultiplier,
					octave: i,
					multiplier: themultiplier,
				});
			}
			themultiplier = themultiplier * 2;
		}
		lowestPitches.map((pitch) => pitchArrayConstructor.unshift(pitch));

		return pitchArrayConstructor;
	};

	//window listener helps set max width of card
	let window;
	let maxWidth;
	$: maxWidth = window > 1400 ? 1280 : window - 40;
</script>

<style lang="scss" global>
	@import "../styles/global.scss";
	.metronome-tuner-container {
		display: flex;
	}
</style>

<Nav {segment} />
<svelte:window bind:innerWidth={window} />
<main class:add-bg-opacity={$opacityToggle} style="max-width: {maxWidth}px">
	<slot />
	<div class="metronome-tuner-container">
		<Metronome />
		<Tuner />
	</div>
</main>
