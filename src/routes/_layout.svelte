<script>
	import Nav from "../components/Nav.svelte";

	import { onMount } from "svelte";
	import { pitches, pitchNames, allPitches } from "../store.js";
	let allThePitches = [];

	export let segment;

	//populateAllPitches runs on mount of site itself. It creates array of pitch objects including name and frequency
	onMount(() => populateAllPitches());

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

<style lang="scss" global>
	@import "../styles/global.scss";

	main {
		position: relative;
		max-width: 56em;
		background-color: white;
		margin: 2rem auto 0 auto;
		box-sizing: border-box;

		button {
			padding: 0.5rem;
		}
	}
</style>

<Nav {segment} />

<main>
	<slot />
</main>
