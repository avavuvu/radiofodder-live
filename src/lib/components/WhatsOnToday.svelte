<script lang="ts">
	import { fetchTodaySchedule, formatEventTime, type ScheduleEvent } from '$lib/radiocult-schedule';

	let isLoading = $state(true);
	let isError = $state(false);
	let errorMessage = $state('');
	let events: ScheduleEvent[] = $state([]);

	$effect(() => {
		(async () => {
			try {
				events = await fetchTodaySchedule();
			} catch (error) {
				isError = true;
				errorMessage = error instanceof Error ? error.message : 'Unknown error';
			} finally {
				isLoading = false;
			}
		})();
	});
</script>

<section class="whats-on-today">
	<h2>What's on Today</h2>

	{#if !isLoading}
		{#if isError}
			<span class="error">ERROR: {errorMessage}</span>
		{:else if events.length === 0}
			<p class="empty">Nothing on today</p>
		{:else}
			<ul>
				{#each events as event}
					<li>
						<span class="time">{formatEventTime(event.start, event.timezone)}</span>
						<span class="title">{event.title}</span>
					</li>
				{/each}
			</ul>
		{/if}
	{/if}
</section>

<style>
	.whats-on-today {
		max-width: 32rem;
		margin-inline: auto;

		& h2 {
			font-size: 1em;
		}

		& ul {
			list-style: none;
			padding: 0;
			margin: 0;
		}

		& li {
			display: flex;
			gap: 0.5em;
		}

		& .time {
			font-weight: bold;
		}

		& .empty,
		& .error {
			font-style: italic;
		}

		@container player (min-width: 40em) {
			margin-inline: 0;
		}
	}
</style>
