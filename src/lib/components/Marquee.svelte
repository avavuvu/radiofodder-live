<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		duration = '30s',
		gap = '2em'
	}: { children: Snippet; duration?: string; gap?: string } = $props();
</script>

<div class="marquee" style:--marquee-duration={duration} style:--marquee-gap={gap}>
	<div class="marquee-track">
		<div class="marquee-group">{@render children()}</div>
		<div class="marquee-group" aria-hidden="true">{@render children()}</div>
	</div>
</div>

<style>
	.marquee {
		overflow: hidden;
	}

	.marquee-track {
		display: flex;
		width: max-content;
		animation: marquee-scroll var(--marquee-duration) linear infinite;
	}

	/* each group's own trailing gap makes both groups equal width,
	   so translateX(-50%) always lands exactly on the next group's start */
	.marquee-group {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		white-space: nowrap;
		gap: var(--marquee-gap);
		padding-right: var(--marquee-gap);
	}

	@keyframes marquee-scroll {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.marquee-track {
			animation-play-state: paused;
		}
	}
</style>
