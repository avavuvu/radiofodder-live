<script lang="ts">
	import Player from '$lib/components/Player.svelte';
	import ArtistsList from '$lib/components/ArtistsList.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<Meta
	title="Radio Fodder"
	description="Radio Fodder is the University of Melbourne's official student radio station. Listen live, check today's shows, and meet the hosts behind them."
/>

<Player />
<ArtistsList artists={data.artists} />
