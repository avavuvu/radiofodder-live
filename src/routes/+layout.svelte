<script lang="ts">
	import './layout.css';
	import faviconIco from '$lib/assets/favicon.ico';
	import Chat from '$lib/components/Chat.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import AudioPlayer from '$lib/components/AudioPlayer.svelte';
		import Marquee from '$lib/components/Marquee.svelte';

	let { children } = $props();

	const DEFAULT_PRIMARY_COLOR = '#418BFC';
	const DEFAULT_SURFACE_COLOR = '#fcfcfc';

	let primaryColor = $state(DEFAULT_PRIMARY_COLOR);
	let surfaceColor = $state(DEFAULT_SURFACE_COLOR);

	let hasCustomColors = $derived(
		primaryColor !== DEFAULT_PRIMARY_COLOR || surfaceColor !== DEFAULT_SURFACE_COLOR
	);

	let faviconHref = $derived(
		`data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 1 1"><circle r=".4" transform-origin="center" transform="translate(.5,.5)" stroke="white" fill="${primaryColor}" stroke-width=".02"/></svg>`)}`
	);

	const resetColors = () => {
		primaryColor = DEFAULT_PRIMARY_COLOR;
		surfaceColor = DEFAULT_SURFACE_COLOR;
	};

	$effect(() => {
		const storedPrimary = localStorage.getItem('color-primary');
		const storedSurface = localStorage.getItem('color-surface');

		if (storedPrimary) primaryColor = storedPrimary;
		if (storedSurface) surfaceColor = storedSurface;
	});

	$effect(() => {
		document.documentElement.style.setProperty('--color-primary', primaryColor);
		localStorage.setItem('color-primary', primaryColor);
	});

	$effect(() => {
		document.documentElement.style.setProperty('--color-surface', surfaceColor);
		localStorage.setItem('color-surface', surfaceColor);
	});

	let isChatVisible = $state(false);
	let isChatLoaded = $state(false);

	const toggleChat = () => {
		if (!isChatLoaded) {
			isChatLoaded = true;
		}

		isChatVisible = !isChatVisible;
	};

	$effect(() => {
		document.body.className = isChatVisible ? 'chat-visible' : '';

		return () => {
			document.body.classList.remove('chat-visible');
		};
	});
</script>

<svelte:head>
    <!-- <link rel="icon" href={faviconIco} /> -->
    <link rel="icon" href={faviconHref} />
</svelte:head>

{#snippet chatButton()}
	<button class="chat-button" onclick={toggleChat}> Chat </button>
{/snippet}

{#snippet colorPickers()}
	{#if hasCustomColors}
		<button class="reset-colors" onclick={resetColors}> Reset </button>
	{/if}

	<input type="color" bind:value={primaryColor} aria-label="Primary colour" />
	<input type="color" bind:value={surfaceColor} aria-label="Surface colour" />
{/snippet}

<div class="layout">
	<div class="page">
		<div class="mobile-background-hack"></div>

		<div class="marquee-row">
			<Marquee>
				<p>Radio Fodder</p>
				<p>The University of Melbourne’s Official Student Radio Station</p>
				<p>Radio Fodder</p>
				<p>The University of Melbourne’s Official Student Radio Station</p>
			</Marquee>

			<span class="marquee-controls">
				<span class="color-pickers color-pickers-mobile">
					{@render colorPickers()}
				</span>

				<span class="chat-button-mobile">
					{@render chatButton()}
				</span>
			</span>
		</div>

		<div class="logo">
			<Logo />
		</div>

		<span class="header-bar">
			<nav>
				<a href="/"> Listen </a>

				<a href="/schedule"> Schedule </a>

				<a
					href="https://instagram.com/radiofodder"
					target="_blank"
					rel="noopener noreferrer"
					class=""
				>
					Instagram
				</a>
			</nav>

			<span class="right-controls">
				<span class="color-pickers color-pickers-desktop">
					{@render colorPickers()}
				</span>

    			<span class="chat-button-desktop">
    				{@render chatButton()}
    			</span>
			</span>

		</span>

		<aside>
			<address>Level 4, Building 168, Parkville Campus, University of Melbourne</address>
			<p>The University of Melbourne Student Radio Station</p>
			<h1>Radio Fodder</h1>
		</aside>

		<main>
			{@render children()}
		</main>

		<footer>
			<Footer />
		</footer>
	</div>

	<button
		class="chat-backdrop"
		class:chat-backdrop-active={isChatVisible}
		onclick={toggleChat}
		aria-label="Close chat"
	></button>

	<section class="chat" class:chat-active={isChatVisible}>
		{#if isChatLoaded}
			<Chat />
		{/if}
	</section>
</div>

<AudioPlayer />

<style>
	.layout {
		display: flex;
		align-items: stretch;
	}

	.page {
		flex: 1 1 auto;
		display: grid;
		min-height: 200vh;

		grid-template-areas:
			'logo   marquee'
			'logo   nav'
			'aside  main'
			'footer footer';

		padding: var(--spacing);
		gap: var(--spacing);

		grid-template-rows: auto auto 1fr auto;
		grid-template-columns: var(--logo-size) 1fr;

		color: var(--color-primary);

		& .mobile-background-hack {
		    display: none;
			z-index: 799;
		}

		& .logo {
			grid-area: logo;
			z-index: 800;
		}

		& .marquee-row {
			grid-area: marquee;
			display: flex;
			align-items: center;
			justify-content: space-between;
			min-width: 0;
			overflow: hidden;
			border-top: 1px solid var(--color-border);
			border-bottom: 1px solid var(--color-border);
			z-index: 800;

			& :global(.marquee) {
				flex: 1;
				min-width: 0;
			}
		}

		& .chat-button-mobile {
			display: none;
		}

		& .marquee-controls {
			display: flex;
			align-items: center;
			gap: 0.5em;
		}

		& .color-pickers {
			display: flex;
			align-items: center;
			gap: 0.5em;

			& input[type='color'] {
				-webkit-appearance: none;
				appearance: none;
				width: 1.5em;
				height: 1.5em;
				padding: 0;
				border: 1px solid var(--color-surface);
				outline: 1px solid var(--color-primary);
				border-radius: 0;
				background: none;
				cursor: pointer;

				&::-webkit-color-swatch-wrapper {
					padding: 0;
				}

				&::-webkit-color-swatch {
					border: none;
					border-radius: 0;
				}

				&::-moz-color-swatch {
					border: none;
					border-radius: 0;
				}
			}

			& .reset-colors {
				color: var(--color-primary);
				background: none;
				border: none;
				text-decoration: underline;
				cursor: pointer;
				padding: 0;
			}
		}

		& .color-pickers-mobile {
			display: none;
		}

		& .header-bar {
			grid-area: nav;
			display: flex;
			z-index: 800;


			justify-content: space-between;
			align-items: end;
			width: 100%;
			background-color: var(--color-surface);

			position: sticky;
			top: 0;

			& a {
			    /*text-decoration: underline;*/
				width: var(--block-size);
				border-bottom: 1px solid var(--color-primary);
				text-align: center;
			}

			& nav {
			    display: flex;
				align-items: end;
				gap: .75em;
				background-color: var(--color-surface);
			}

			& .right-controls {
				display: flex;
				align-items: center;
				gap: 0.5em;
			}

		}

		& main {
			grid-area: main;
		}

		& aside {
			grid-area: aside;

			display: flex;
			justify-content: end;
			flex-direction: column;

			writing-mode: vertical-lr;
			font-size: xl;

			& h1 {
			    border-right: 1px solid var(--color-primary);
				height: fit-content;
				height: calc(var(--block-size) * 2);

			}
		}

		& footer {
			grid-area: footer;
		}

		@media (max-width: 48em) {
			--spacing: 1em;
			--logo-size: calc(83.4333px - 1.5em);

			padding: 0.5em 0;
			gap: 0;
			column-gap: var(--spacing);

			grid-template-rows: var(--logo-size) auto 1fr auto;

			grid-template-areas:
				'logo    nav'
				'marquee marquee'
				'main    main'
				'footer  footer';

			& aside {
				display: none;
			}

			& main {
			    padding-top: var(--spacing);
			}

			& .marquee-row {
			    border-bottom: 1px solid var(--color-primary);
				border-top: none;
				top: var(--logo-size);
				position: sticky;
				background-color: var(--color-surface);
			}

			& .logo {
			    position: sticky;
				top: 0;
				background-color: var(--color-surface);
				padding-left: 0.5em;
				padding-bottom: 0.5em;
				padding-top: 0.5em;

				border-bottom: 1px solid var(--color-primary);
			}

			& .mobile-background-hack {
    		    display: block;
                position: sticky;
                top: 0;
                grid-row: 1 / 2;
                grid-column: 1 / 3;
                background-color: var(--color-surface);
                border-bottom: 1px solid var(--color-primary);
    		}

			& .chat-button-mobile {
				display: block;
			}

			& .chat-button-desktop {
				display: none;
			}

			& .color-pickers-mobile {
				display: flex;
				gap: 0.25em;

				& input[type='color'] {
					width: 1.75em;
					height: 1.75em;
				}
			}

			& .color-pickers-desktop {
				display: none;
			}

			& .header-bar {
				align-items: center;
				padding-right: 0.5em;
				border-bottom: 1px solid var(--color-primary);
				padding-bottom: 0.5em;

				& nav {
				    display: flex;
					justify-content: space-between;
					width: 100%;
					height: min-content;
				}
			}
		}
	}

	.chat-button {
		background-color: var(--color-primary);
		color: var(--color-surface);
		width: var(--block-size);
		padding: 0em 1em;
		border: 1px solid var(--color-surface);
		outline: 1px solid var(--color-primary);
	}

	.chat {
		width: 0;
		flex-shrink: 0;
		transition: width 300ms ease;
		background-color: var(--color-surface);

    	&.chat-active {
    		width: min(30vw, 28em);
    	}

    	@media (max-width: 48em) {
 			position: fixed;
 			top: 0;
 			right: 0;
 			bottom: 0;
 			z-index: 1000;
 			transform: translateX(100%);
 			transition: transform 300ms ease;

    		&.chat-active {
    			transform: translateX(0);
                width: 75vw;
    		}
    	}
	}

	@media (max-width: 48em) {
	    :global(body.chat-visible) {
			overflow-y: hidden;
		}
	}

	.chat-backdrop {
		display: none;

    	@media (max-width: 48em) {
 			display: block;
 			position: fixed;
 			inset: 0;
 			z-index: 999;
 			border: none;
 			padding: 0;
 			background-color: rgb(0 0 0 / 0%);
 			pointer-events: none;
 			transition: background-color 300ms ease;

 			&.chat-backdrop-active {
				background-color: rgb(0 0 0 / 50%);
				pointer-events: auto;
 			}
    	}
	}

</style>
