<script module>
    export { onAir }
</script>

{#snippet onAir()}
    <span>
    	<div aria-hidden="true" class="dot"></div>
    	On Air
    </span>
{/snippet}



<style>
    span {
        display: inline-flex;
        align-items: last baseline;
        justify-content: center;
        gap: 0.2em;

        & .dot {
           	width: 0.5em;
           	height: 0.5em;
           	border-radius: 100%;
           	background-color: var(--color-primary);
           	animation: 2s ease 0s infinite alternate-reverse pulse;
        }
    }

    @keyframes pulse {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
