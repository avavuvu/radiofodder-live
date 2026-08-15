<script lang="ts">
	import { formatEventTime } from '$lib/radiocult-schedule';
	import Horse from '$lib/components/Horse.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
</script>

<Meta
	title="Schedule - Radio Fodder"
	description="See the full weekly schedule for Radio Fodder, the University of Melbourne's official student radio station, and find out what's playing each day."
/>

<div class="schedule-page">
	<h1 class="sr-only">Schedule</h1>

	{#await data.scheduleByDay}
		<p>Loading…</p>
	{:then scheduleByDay}
		{#each weekdays as weekday, index}
			<section class="day">
			    <div class="horse">
					<Horse variant={((index) % 6) + 1 as 1 | 2 | 3 | 4 | 5 | 6} />
				</div>

				<h2>{weekday}</h2>

				{#if scheduleByDay.get(weekday)?.length}
					<ul>
						{#each scheduleByDay.get(weekday) ?? [] as event}
							<li>
								<span class="time">
									{formatEventTime(event.start, event.timezone)} – {formatEventTime(
										event.end,
										event.timezone
									)}
								</span>
								<span class="title">{event.title}</span>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="empty">Nothing scheduled</p>
				{/if}
			</section>
		{/each}
	{:catch error}
		<span class="error">ERROR: {error.message}</span>
	{/await}
</div>

<style>
	.schedule-page {
	    &:first-child {
		    border-top: 1px solid var(--color-primary);
		}

		& .day {
			margin-bottom: 2em;
			position: relative;
			min-height: 20em;

			& .horse {
			    position: absolute;
				height: 500px;
				width: 400px;
				right: 0;
				pointer-events: none;
			}

			& > * {
				padding: 0 .25em;
			}

			& h2 {
				border-bottom: 1px solid var(--color-border);
				background-color: var(--color-primary);
				color: var(--color-surface);

				&::selection {
				    background-color: var(--color-surface);
				    color: var(--color-primary);
				}
			}

			& ul {
				list-style: none;
				margin: 0;
			}

			& li {
				display: flex;
				gap: 1em;
				padding-block: 0.5em;
				border-bottom: 1px solid var(--color-border);
				& > * {
				    z-index: 10;
				}
			}

			& .time {
				font-weight: bold;
				white-space: nowrap;
				min-width: calc(2 * var(--block-size));
			}

			& .empty {
				font-style: italic;

			}
		}

		& .error {
			font-style: italic;
		}
	}
</style>
