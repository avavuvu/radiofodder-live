<script lang="ts">
	let { width = '100%' }: { width?: string } = $props();
</script>

<span class="skeleton-line" style:width={width}></span>

<style>
	.skeleton-line {
		display: block;
		height: 1em;
		background-color: var(--color-border);
		opacity: 0.2;
		border-radius: 0.25em;
	}
</style>
