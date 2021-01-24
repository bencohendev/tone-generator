<script>
	import Nav from "../components/Nav.svelte";

	import { onMount } from "svelte";
	import {
		pitches,
		pitchNames,
		allPitches,
		showPitchSelector,
	} from "../store.js";
	let allThePitches = [];

	export let segment;
	let multiplier = 1;

	let lowestPitches = [
		{
			name: "B0",
			frequency: 30.86770632850775,
			octave: 0,
			multiplier: 1,
		},
		{
			name: "Gb/A#0",
			frequency: 29.13523509488062,
			octave: 0,
			multiplier: 1,
		},
		{
			name: "A0",
			frequency: 27.5,
			octave: 0,
			multiplier: 1,
		},
	];

	//populateAllPitches runs on mount of site itself. It creates array of pitch objects including name and frequency
	onMount(() => {
		$allPitches = populateAllPitches();
	});

	let populateAllPitches = () => {
		for (let i = 1; i < 10; i++) {
			for (let j = 0; j < $pitches.length; j++) {
				allThePitches.push({
					name: $pitchNames[j] + i,
					frequency: $pitches[j] * multiplier,
					octave: i,
					multiplier,
				});
			}
			multiplier = multiplier * 2;
		}
		lowestPitches.map((pitch) => allThePitches.unshift(pitch));
		return allThePitches;
	};
</script>

<Nav {segment} />

<main class:add-bg-opacity={$showPitchSelector}>
	<slot />
</main>

<style lang="scss" global>
	@import "../styles/global.scss";
</style>
