<script lang="ts">
    import { page } from '$app/state';

    const { image = '/og.png', title, description }: {
        description: string,
        title: string,
        image?: string,
    } = $props()

    const absoluteImage = $derived(new URL(image, page.url.origin).href);
</script>

<svelte:head>
    <title>
        {title}
    </title>

    <meta property="og:title" content={title} />
    <meta name="twitter:title" content={title} />
    <meta property="og:description" content={description} />
    <meta name="twitter:description" content={description} />
    <meta name="description" content={description} />

    <meta property="og:type" content="website" />

    {#if image}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:image" content={absoluteImage} />
        <meta name="twitter:image" content={absoluteImage} />
    {/if}
</svelte:head>
