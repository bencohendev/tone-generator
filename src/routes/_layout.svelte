<script>
	import Nav from "../components/Nav.svelte";

	import { onMount } from "svelte";
	import {
		audioCtx,
		pitches,
		pitchNames,
		allPitches,
		showPitchSelector,
	} from "../store.js";
	let allThePitches = [];

	export let segment;

	//populateAllPitches runs on mount of site itself. It creates array of pitch objects including name and frequency
	onMount(() => {
		populateAllPitches();
	});

	let populateAllPitches = () => {
		let pitchMultiplier = 1;
		for (let i = 0; i < 9; i++) {
			for (let j = 0; j <= $pitches.length; j++) {
				allThePitches.push({
					pitch: $pitchNames[j] + (i + 1),
					frequency: $pitches[j] * pitchMultiplier,
				});
			}
			pitchMultiplier = pitchMultiplier * 2;
		}
		return allThePitches;
	};

	$allPitches = populateAllPitches();
</script>

<Nav {segment} />

<main class:add-bg-opacity={$showPitchSelector}>
	<slot />
</main>

<style lang="scss" global>
	@import "../styles/global.scss";
</style>
