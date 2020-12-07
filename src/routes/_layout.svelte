<script>
	import Nav from "../components/Nav.svelte";

	export let segment;
</script>

<style lang="scss" global>
	@import "../styles/global.scss";

	main {
		position: relative;
		max-width: 56em;
		background-color: white;
		padding: 2em;
		margin: 0 auto;
		box-sizing: border-box;
		//	display: flex;

		button {
			padding: 5px;
		}
	}
</style>

<Nav {segment} />

<main>
	<slot />
</main>
