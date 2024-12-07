<script lang="ts">
//console.log("App.svelte.NODE_ENV=", process.env.NODE_ENV);
</script>

<!-- -->
<main>
    <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>welcome</title>
        {#if process.env.NODE_ENV === "develop"}
            <link href="/static/main.css" rel="stylesheet" />
        {:else}
            <link href="/public/static/main.css" rel="stylesheet" />
        {/if}
        </head>
    <body>
        <div id="app"></div>
        {#if process.env.NODE_ENV === "develop"}
            <script type="module" src="/static/main.js"></script>
        {:else}
            <script type="module" src="/public/static/main.js"></script>
        {/if}
    </body>
</main>

<style>
</style>
<!--
-->