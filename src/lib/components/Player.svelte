<script lang="ts">
	import { nowPlaying } from '$lib/now-playing.svelte';
	import { fade } from 'svelte/transition';
	import { onAir } from './onair.svelte';
	import WhatsOnToday from './WhatsOnToday.svelte';
	import Skeleton from './Skeleton.svelte';

	type ArtistDescription = { type: 'text'; data: string } | { type: 'html'; data: string };

	type NowPlayingArtist = {
		title: string;
		description: ArtistDescription;
		imageSource?: string;
		instagramLink?: string;
	};

	$effect(() => {
		nowPlaying.start();
	});

	let artist = $derived.by((): NowPlayingArtist | undefined => {
		if (nowPlaying.status === 'offAir') {
			return {
				title: 'Radio Fodder is Off Air',
				description: {
					type: 'text',
					data: 'If you believe this to be a mistake, please contact the webmaster'
				}
			};
		}

		if (!nowPlaying.metadata) {
			return undefined;
		}

		return {
			title: nowPlaying.metadata.title,
			description: {
				type: 'text',
				data: nowPlaying.metadata.artist ? `by ${nowPlaying.metadata.artist}` : ''
			},
			imageSource: nowPlaying.metadata.artwork?.['256x256'] ?? nowPlaying.metadata.artwork?.original
		};
	});

	let isLoading = $derived(!nowPlaying.status && !nowPlaying.error);
	let isError = $derived(!!nowPlaying.error);
	let errorMessage = $derived(nowPlaying.error ?? '');
</script>

{#snippet placeholderArtwork()}
	<svg viewBox="0 0 237 237" xmlns="http://www.w3.org/2000/svg">
		<rect width="237" height="237" fill="white" />
		<path
			fill="var(--color-primary)"
			d="M201.58,141.99c0,8.99-5.39,16.6-16.16,22.83-9.39,5.33-18.97,8-28.76,8-7.81,0-14.68-1.38-20.61-4.15-7.71-3.56-11.56-8.75-11.56-15.57,0-8.5,5.78-15.41,17.34-20.75,9.29-4.35,18.73-6.52,28.31-6.52,6.82,0,12.85,1.04,18.08,3.11V62.54l-88.64,39.28v91.75c0,8.89-5.29,16.55-15.86,22.97-9.29,5.63-18.73,8.45-28.31,8.45-7.71,0-14.53-1.38-20.46-4.15-7.71-3.46-11.56-8.64-11.56-15.56,0-8.4,5.73-15.32,17.19-20.75,9.29-4.35,18.73-6.52,28.31-6.52,6.52,0,12.35.99,17.49,2.96V62.69L201.58,12v129.99Z"
		/>
	</svg>
{/snippet}

<div class="player-frame">
	<div class="now-playing">
		<div class="artwork">
			{#if artist?.imageSource}
				<img transition:fade src={artist.imageSource} alt={artist.title} />
			{:else}
				{@render placeholderArtwork()}
			{/if}
		</div>

		<div class="info">
			<hgroup class="details">
				{#if isLoading}
					<div class="skeleton">
						<Skeleton width="14rem" />
						<Skeleton width="14rem" />
						<Skeleton width="4rem" />
					</div>
				{:else if isError}
					<span class="error">ERROR: {errorMessage}</span>
				{:else if artist}
					{#if nowPlaying.isOnAir()}
						<h2 class="artist-title">
							{@render onAir()}
						</h2>
					{:else}
						{#if artist.instagramLink}
							<a
								class="artist-link"
								href={artist.instagramLink}
								target="_blank"
								rel="noopener noreferrer"
							>
								<span class="artist-title">{artist.title}</span>
								<span class="external-icon" aria-hidden="true">↗</span>
							</a>
						{:else}
							<span class="artist-title">{artist.title}</span>
						{/if}

						{#if artist.description.type === 'html'}
							{@html artist.description.data}
						{:else}
							<p>{artist.description.data}</p>
						{/if}
					{/if}
				{/if}
			</hgroup>

			<WhatsOnToday />
		</div>
	</div>
</div>

<style>
	.player-frame {
		container: player / inline-size;
		min-height: 60vh;
	}

	.now-playing {
		display: flex;
		flex-direction: column;
		gap: 1em;

		& .artwork {
			width: 16rem;
			height: 16rem;
			aspect-ratio: 1 / 1;
			border: 1px solid var(--color-surface);
			outline: 1px solid var(--color-primary);
			margin-inline: auto;

			& img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}

			& svg {
				width: 100%;
				height: 100%;
			}
		}

		& .info {
			display: flex;
			flex-direction: column;
			gap: 1em;
		}

		& .details {
			max-width: 32rem;
			margin-inline: auto;
			min-height: 6rem;

			& .skeleton {
				display: flex;
				flex-direction: column;
				gap: 0.5em;
			}

			& .error {
				margin-left: 1em;
			}

			& .artist-link {
				display: inline-flex;
				justify-content: space-between;
				align-items: baseline;
				width: 100%;
				color: inherit;
				text-decoration: none;

				& .external-icon {
					font-size: 0.75em;
				}
			}

			& .artist-title {
				font-weight: bold;
				font-size: x-large;
			}


		}



		@container player (min-width: 40em) {
			flex-direction: row;

			& .artwork {
				width: 24rem;
				height: 24rem;
				margin-inline: 0;
			}

			& .info {
				padding-inline: 2em;
			}

			& .details {
				margin-inline: 0;
			}
		}
	}
</style>
