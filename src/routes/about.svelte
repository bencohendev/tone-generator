<svelte:head>
	<title>About</title>
</svelte:head>
<h1>About this site</h1>
<section class="about-container card">
	<div>
		Hello and welcome to my pitch generator! This site is at its core, a
		very personal practice aid. As a practicing saxophonist, I spend a LOT
		of time playing long tones. I'm sure if you are a fellow wind
		instrumentalist you do to.
	</div>
	<div>Here is a quick breakdown of what you can do on each page.</div>
	<h3>Tone Generator</h3>
	<div>
		This page generates pure tones of any frequency between 8hz and
		~21,618hz. Please note that the average human can't hear tones below
		20Hz and above 10,000Hz and if you turn up the volume to compensate YOU
		COULD DAMAGE YOUR HEARING. You an add additional tone generators with
		the Add Tone Generator button. You can also automatically create
		generators that correspond to either the first three or first four
		overtones in the overtone series with the Generate Overtone Presets
		button. You can change the wave type from sine to square, triangle or
		sawtooth by pressing the <img
			class="sine-img"
			alt="sine"
			src="../icons/sine-light.png"
		/> button. The plus and minus buttons add +/-1 to the Hz value and the divison
		and multiplication buttons halve or double the Hz value respectively. Hz
		values are showed as approximate, but if you click on the Hz value itself,
		you can see the full value as well as setting it manually to whatever you'd
		like. The displayed pitch name shows the nearest pitch to your current frequency.
		Click on it to automatically change the frequency to that pitch.
	</div>
	<h3>Random Sequence Generator</h3>
	<div>
		This page began as a favor for a friend. Guitarist Dustin Carlson and I
		were on tour a few years ago, and he showed me a site he used to
		practice. It was a rather simple affair. It played random pitches from
		within a two octave range. Dustin bemoaned the fact that it would not
		play tones outside of this limited range. Thus the Random Sequence
		Generator was born. You are able to set the lower and upper pitch limits
		of the range manually or by using the instrument selector (if you are
		lucky enough to play one of the few instruments I've added). Then you
		can choose the number of pitches to play in a sequence, the speed in BPM
		and whether to play an infinite series of pitches, or a single sequence.
		If you choose the infinite option, the Random Sequence Generator will
		separate the sequences with a moment of silence equal to a beat at your
		set BPM. Using the Advanced Controls, you can do the following:
		<ul>
			<li>
				See each pitch as it plays or see a running list of all the
				pitches played
			</li>
			<li>Play anywhere from 1-4 intervals at once</li>
			<li>
				Choose to limit the set of pitches from which the player
				randomly chooses to any major or minor mode as well as a few
				symmetrical scales
			</li>
		</ul>
		<h3>Drones</h3>
		<div>
			This page is yet another long tone practice aid. Sometimes, instead
			of playing with the cold, harsh pure tones generated on Static, I
			prefer the warmth of a Shruti box. Choose a key and play ~20 minutes
			of shruti drones in that key
		</div>
	</div>
	<h3>Contact</h3>
	<div>
		If you have any questions/comments/concerns or feature requests, it
		never hurts to ask: ben[at]bencohen.dev
	</div>
</section>

<style lang="scss">
	@import "../styles/theme.scss";

	.about-container {
		div {
			margin: 1rem 0rem;
		}
		h3 {
			margin-top: 2rem;
			border-bottom: solid 1px white;
		}
	}
	.sine-img {
		width: 1rem;
		background-color: $main-btn;
	}
</style>
