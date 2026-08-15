<footer>
	<div class="divider"></div>

	<div class="content">
		<div class="links">
			<a href="mailto:managers@radiofodder.com"> managers@radiofodder.com </a>
			<div class="separator"></div>
			<a href="https://farragomagazine.com"> farragomagazine.com </a>
		</div>

		<div class="credit">
			<a href="https://avavu.au">This website was made with love by <span>Ava Dinh-Vu</span> ♥</a>
		</div>
	</div>
</footer>

<style>
	footer {
		min-height: 16rem;
		height: 100%;

		& .divider {
			border-bottom: 1px solid var(--color-border);
		}

		& .content {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding-block: 6em;
			color: var(--color-primary);

			& .links {
				display: flex;
				gap: 0.5em;

				& a {
					text-decoration: underline;
				}

				& .separator {
					border-right: 1px solid var(--color-border);
				}
			}

			& .credit {
				width: fit-content;
				font-style: italic;
				text-align: center;

				& span {
					text-decoration: underline;
				}
			}
		}
	}
</style>
