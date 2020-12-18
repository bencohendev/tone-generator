<script>
	import { onMount } from "svelte";
	import Static from "./Static.svelte";
	import { pitches, pitchNames, allPitches } from "../store.js";
	let allThePitches = [];

	let populateAllPitches = () => {
		let pitchMultiplier = 1;
		for (let i = 0; i < 9; i++) {
			for (let j = 1; j <= $pitches.length; j++) {
				allThePitches.push({
					pitch: $pitchNames[j] + i,
					frequency: $pitches[j] * pitchMultiplier,
				});
			}
			pitchMultiplier = pitchMultiplier * 2;
		}
		return allThePitches;
	};

	$allPitches = populateAllPitches();
</script>

<style lang="scss">
</style>

<svelte:head>
	<title>Frequency Generator</title>
</svelte:head>

<Static />
