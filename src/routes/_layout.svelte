<script>
	import Nav from "../components/Nav.svelte";

	import { onMount } from "svelte";
	import {
		pitches,
		pitchNames,
		allPitches,
		showPitchSelector,
	} from "../store.js";
	let pitchArrayConstructor = [];

	export let segment;



	//multiplier is used to programatically create allPitches
	let multiplier = 1;

	//These three pitches cannot be added programatically as they fall outside of the full octave
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

	//populateAllPitches runs on mount of site itself. It creates a complete array of pitch objects
	onMount(() => {
		$allPitches = populateAllPitches();
	});

	let populateAllPitches = () => {
		for (let i = 1; i < 10; i++) {
			for (let j = 0; j < $pitches.length; j++) {
				pitchArrayConstructor.push({
					name: $pitchNames[j] + i,
					frequency: $pitches[j] * multiplier,
					octave: i,
					multiplier,
				});
			}
			multiplier = multiplier * 2;
		}
		lowestPitches.map((pitch) => pitchArrayConstructor.unshift(pitch));
		return pitchArrayConstructor;
	};



	//window listener helps set max width of card
	let window
	let maxWidth 
	$: maxWidth = (window > 1400) ? 1280 : window-40;


</script>

<Nav {segment} />
<svelte:window bind:innerWidth={window} />
<main class:add-bg-opacity={$showPitchSelector} style="max-width: {maxWidth}px" >
	<slot />
</main>

<style lang="scss" global>
	@import "../styles/global.scss";
</style>
