<script lang="ts">
	import { nowPlaying } from '$lib/now-playing.svelte';
	import { audioPlayback } from '$lib/audio-playback.svelte';
	import { onAir } from './onair.svelte';

	let audioElement: HTMLAudioElement = $state(null!);
	let volume = $state(0.75);
	let muted = $state(false);

	$effect(() => {
		nowPlaying.start();
	});

	const play = async () => {
		if (!nowPlaying.streamingUrl) return;

		audioPlayback.state = 'loading';
		audioElement.src = nowPlaying.streamingUrl;
		audioElement.load();

		try {
			await audioElement.play();
		} catch {
			audioPlayback.state = 'paused';
		}
	};

	const pause = () => {
		audioElement.pause();
		audioElement.removeAttribute('src');
		audioElement.load();
		audioPlayback.state = 'paused';
	};

	const togglePlaying = () => {
		if (audioPlayback.state === 'paused') {
			play();
		} else {
			pause();
		}
	};
</script>

<div class="audio-player">
	<audio
		bind:this={audioElement}
		bind:muted
		bind:volume
		preload="none"
		onplaying={() => (audioPlayback.state = 'playing')}
		onwaiting={() => (audioPlayback.state = 'loading')}
		onerror={() => {
			if (audioElement.getAttribute('src')) audioPlayback.state = 'paused';
		}}
	></audio>

	<button class="play-button" onclick={togglePlaying} disabled={!nowPlaying.streamingUrl}>
		{#if audioPlayback.state === 'playing'}
			<!-- Pause -->
		    <span class="icon--pause"></span>

		{:else if audioPlayback.state === 'loading'}
			<!-- Loading… -->
		    <span class="icon--loading"></span>

		{:else}
			<!-- Play -->
		    <span class="icon--play"></span>

		{/if}
	</button>

	<div class="player-content">
    	<div class="now-playing">
    		<span class="title">
    		    {#if nowPlaying.isOnAir()}
    				{@render onAir()}
    			{:else}
    			    {nowPlaying.metadata?.title ?? 'Radio Fodder'}
    			{/if}

    		</span>
    		<span class="artist">{nowPlaying.metadata?.artist ?? ''}</span>
    	</div>

        <span class="sound-controls">
           	<button class="mute" onclick={() => (muted = !muted)}>
           	    {#if muted}
         			<span class="icon--sound-muted"></span>
          		{:else}
          		    {#if volume === 0}
          		        <span class="icon--sound-silent"></span>
         			{:else}
          		        <span class="icon--sound-high"></span>
         			{/if}
          		{/if}
           	</button>

           	<input type="range" min="0" max="1" step="0.1" bind:value={volume} />
        </span>
	</div>

</div>

<style>
    /* Safari was struggling with nested pseudo components */
	input[type='range']::-webkit-slider-thumb {
    	-webkit-appearance: none;
    	appearance: none;
    	width: 0.75em;
    	height: 0.75em;
    	border-radius: 0;
    	background-color: var(--color-primary);
    	border: none;
    	outline: 1px solid var(--color-primary);
    	margin-top: calc((0.25em - 0.75em) / 2);
    }

	.audio-player {
		position: fixed;
		inset-inline: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		gap: 1em;
		padding: 0.5em 1em;
		background-color: var(--color-surface);
		color: var(--color-primary);
		border-top: 1px solid var(--color-border);
		z-index: 50;
		padding-left: calc(
		    var(--spacing) * 2 + var(--logo-size)
		);
		padding-right: var(--spacing);

		& .player-content {
		    display: flex;
			justify-content: space-between;
			width: 100%;
		}

		& .sound-controls {
		    display: flex;
			align-items: center;
			gap: 0.5em;

			& .mute {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 1.5em;
				height: 1.5em;
				border: none;
				padding: 0;
				background: none;
				color: inherit;
				cursor: pointer;
			}

			& input[type='range'] {
				-webkit-appearance: none;
				appearance: none;
				width: var(--block-size);
				height: 0.75em;
				background: transparent;
				cursor: pointer;

				&::-webkit-slider-runnable-track {
					-webkit-appearance: none;
					height: 0.25em;

					outline: 1px solid var(--color-primary);
				}

				&::-moz-range-track {
					height: 0.25em;

					outline: 1px solid var(--color-primary);
				}

				&::-moz-range-thumb {
					width: 0.75em;
					height: 0.75em;
					border-radius: 0;
					background-color: var(--color-primary);
					border: none;
					outline: 1px solid var(--color-primary);
				}
			}
		}

		@media (max-width: 48em) {
		    padding-left: 1em;

			& .player-content {
			    display: block;
			}
		}

		@media (max-width: 32em) {
		    padding-left: 0.5em;
			padding-right: 0.5em;
		}



		& .play-button {
		    border: 1px solid var(--color-surface);
		    outline: 1px solid var(--color-primary);
			color: var(--color-surface);
			font-size: var(--text-3xl);
			padding: 0.5em;
		    background-color: var(--color-primary);
			display: flex;
			justify-content: center;
			align-items: center;
			transition: background-color;
			transition-duration: 100ms;
			cursor: pointer;

			&:hover {
			    background-color: var(--color-surface);
				color: var(--color-primary);
			}
		}

		& .now-playing {
			display: flex;
			flex-direction: column;
			flex: 1 1 auto;
			overflow: hidden;

			& .title {
				font-weight: bold;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
	}
</style>
