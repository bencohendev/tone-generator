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
