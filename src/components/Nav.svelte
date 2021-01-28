<script>
	export let segment;
	let active = false
</script>

  <nav class="primary">
	<ul>
		<li>
			<a
				aria-current={segment === undefined ? "page" : undefined}
				href="/">Tone Generator</a
			>
		</li>
		<li>
			<a
				aria-current={segment === "series" ? "page" : undefined}
				href="series">Random Pitch Sequences</a
			>
		</li>
		<li>
			<a
				aria-current={segment === "drones" ? "page" : undefined}
				href="drones">Drones</a
			>
		</li>
		<li>
			<a
				aria-current={segment === "about" ? "page" : undefined}
				href="about">About</a
			>
		</li>
	</ul>
</nav>
<nav class="mobile" >
	<button class="hamburger hamburger--slider {active ? 'is-active' : ''}"  type="button" on:click={()=>active ? active = false : active = true}>
		<span class="hamburger-box">
		  <span class="hamburger-inner"></span>
		</span>
	  </button>
	<ul class="mobile {active ? 'is-active' : ''}">
		<li>
			<a
				aria-current={segment === undefined ? "page" : undefined}
				href="/">Tone Generator</a
			>
		</li>
		<li>
			<a
				aria-current={segment === "series" ? "page" : undefined}
				href="series">Random Pitch Sequences</a
			>
		</li>
		<li>
			<a
				aria-current={segment === "drones" ? "page" : undefined}
				href="drones">Drones</a
			>
		</li>
		<li>
			<a
				aria-current={segment === "about" ? "page" : undefined}
				href="about">About</a
			>
		</li>
	</ul>
</nav>

<style lang="scss">
		@import "../styles/hamburgers/hamburgers.scss";

	nav {
		border-bottom: 1px solid rgba(255, 62, 0, 0.1);
		font-weight: 300;
		padding: 0 1em;
	}

	ul {
		margin: 0;
		padding: 0;
	}

	/* clearfix */
	ul::after {
		content: "";
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
	}

	[aria-current] {
		position: relative;
		display: inline-block;
	}

	[aria-current]::after {
		position: absolute;
		content: "";
		width: calc(100% - 1em);
		height: 2px;
		background-color: rgb(255, 62, 0);
		display: block;
		bottom: -1px;
	}

	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}

	.mobile {
		display: none;
	}

	@media only screen and (max-width: 768px) {
		.primary {
			display: none;

		}

		.hamburger {
			padding: .25rem;
			margin: 1rem 0;
		}
		.mobile {
			display: block;
		}
		ul.mobile {
			display: grid;
			height: 0px;
			width: 0px;
			overflow:hidden;
			transition: height .2s;


			&.is-active {
				transition: height .2s;
				height: 175px;
				width: auto;
			}
		}
		ul {
			font-size: 13px;
		}


	}
</style>
