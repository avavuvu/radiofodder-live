<script lang="ts">
	import type { Artist } from '$lib/radiocult-schedule';
	import { renderTipTapHtml, extractShowMetadata } from '$lib/radiocult-content';

	let { artists }: { artists: Promise<Artist[]> } = $props();

	const COLUMN_BREAKPOINTS = [
		{ maxWidth: 768, columns: 1 },
		{ maxWidth: 1024, columns: 2 }
	];
	const DEFAULT_COLUMNS = 4;

	let columnCount = $state(DEFAULT_COLUMNS);

	$effect(() => {
		const updateColumnCount = () => {
			const breakpoint = COLUMN_BREAKPOINTS.find((b) => window.innerWidth <= b.maxWidth);
			columnCount = breakpoint?.columns ?? DEFAULT_COLUMNS;
		};

		updateColumnCount();
		window.addEventListener('resize', updateColumnCount);
		return () => window.removeEventListener('resize', updateColumnCount);
	});

	function splitIntoColumns<T>(items: T[], columns: number): T[][] {
		const perColumn = Math.ceil(items.length / columns) || 1;

		return items.reduce<T[][]>((result, item, index) => {
			const column = Math.min(columns - 1, Math.floor(index / perColumn));
			result[column].push(item);
			return result;
		}, Array.from({ length: columns }, () => []));
	}
</script>

{#snippet artistHeader(artist: Artist, hosts?: string)}
	<hgroup>
		{#if artist.logo?.default}
			<img src={artist.logo.default} alt={artist.name ?? ''} />
		{/if}

		<h3 class="name">{artist.name ?? 'no artist name'}</h3>

		{#if hosts}
			<span class="hosts">– with {hosts}</span>
		{/if}
	</hgroup>
{/snippet}

<section class="artists-list">
	<h2>Our Shows</h2>

	{#await artists}
		<!-- <p>Loading…</p> -->
	{:then artists}
		<div class="artist-columns" style:--column-count={columnCount}>
			{#each splitIntoColumns(artists, columnCount) as column}
				<ul class="artist-column">
					{#each column as artist}
						<li>
							{#if artist.description || artist.logo?.default}
								{@const metadata = artist.description && extractShowMetadata(artist.description)}
								<details>
									<summary>
										{@render artistHeader(artist, metadata?.hosts)}
										<span class="icon--add"></span>
									</summary>

									<div class="content">
										{#if artist.logo?.default}
											<img
												class="detail-image"
												src={artist.logo.default}
												alt={artist.name ?? ''}
											/>
										{/if}

										{#if artist.description}
											{@html renderTipTapHtml(artist.description)}
										{/if}

										{#if metadata?.showtime}
											<p class="showtime">{metadata.showtime}</p>
										{/if}

										{#if artist.socials?.instagramHandle}
											<a
												class="instagram-link"
												href={`https://instagram.com/${artist.socials.instagramHandle}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												{artist.socials.instagramHandle}
											</a>
										{/if}
									</div>
								</details>
							{:else}
								<hgroup>
									{@render artistHeader(artist)}
								</hgroup>

								{#if artist.socials?.instagramHandle}
									<a
										class="instagram-link"
										href={`https://instagram.com/${artist.socials.instagramHandle}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										{artist.socials.instagramHandle}
									</a>
								{/if}
							{/if}
						</li>
					{/each}
				</ul>
			{/each}
		</div>
	{:catch error}
		<span class="error">ERROR: {error.message}</span>
	{/await}
</section>

<style>
	.artists-list {
		padding: 0 0;

		& h2 {
			font-size: 1em;
		}

		& .artist-columns {
			display: grid;
			grid-template-columns: repeat(var(--column-count, 4), 1fr);
			column-gap: 1em;
		}

		& .artist-column {
			display: flex;
			flex-direction: column;
			list-style: none;
			padding: 0;
			margin: 0;
		}

		& li {
			border-bottom: 1px solid var(--color-border);
			margin-block-end: 1em;
			min-height: 4em;
			padding-right: 1em;
		}

		& hgroup {
			display: flex;
			gap: 0.5em;

			& img {
				width: 2.5em;
				height: 2.5em;
				object-fit: cover;
			}

			& .name {
				font-weight: bold;
				display: -webkit-box;
				line-clamp: 2;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;
			}
		}

		& details[open] .name {
			display: block;
			line-clamp: unset;
			-webkit-line-clamp: unset;
			overflow: visible;
		}

		& summary {
			cursor: pointer;
			display: flex;
			justify-content: space-between;
			list-style: none;

			&::-webkit-details-marker {
				display: none;
			}
		}

		& .instagram-link {
			display: block;
			padding-block-end: 1em;
			color: inherit;
			text-decoration: underline;
		}

		& .content {
			padding-block-end: 1em;

			& .detail-image {
				display: block;
				width: min(18em, 100%);
				margin: 0 auto;
				height: auto;
				margin-block-end: 0.5em;
			}

			& a {
				color: inherit;
			}
		}

		& .error {
			font-style: italic;
		}

		@media (max-width: 64em) {
			& .artist-columns {
				--column-count: 2;
			}
		}

		@media (max-width: 48em) {
			padding: 0 var(--spacing);

			& .artist-columns {
				--column-count: 1;
			}
		}

		& img {
			border: 1px solid var(--color-primary);
			margin-bottom: 0.2em;
		}
	}
</style>
