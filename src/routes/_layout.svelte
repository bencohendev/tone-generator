<script>
	import Nav from "../components/Nav.svelte";

	export let segment;
</script>

<style lang="scss" global>
	main {
		position: relative;
		max-width: 56em;
		background-color: white;
		padding: 2em;
		margin: 0 auto;
		box-sizing: border-box;
		display: flex;

		section{
			display: flex;
			flex-wrap: wrap;
		}
		div {
			display: flex;
		}
		button {
			padding: 5px;
			border-radius: 2px;
			box-shadow: 0.1px 0.1px 0.1px 0.1px;
		}
	}
</style>

<Nav {segment} />

<main>
	<slot />
</main>
