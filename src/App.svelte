<script lang="ts">
  import Counter from "./lib/Counter.svelte";
  import Slider1 from "./lib/Slider1.svelte";
  import Sandbox from "./lib/Sandbox.svelte";
  import { store } from "./lib/stores";
  import Edges from "./lib/Edges.svelte";

  let s = store.tracker;
</script>

<main>
  <h1>Hello Typescript!</h1>

  <Slider1 />
  <Edges />
  <div>{$s[0]}, {$s[1]}</div>
  <p>
    Visit <a href="https://svelte.dev">svelte.dev</a> to learn how to build Svelte
    apps.
  </p>

  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme">SvelteKit</a> for
    the officially supported framework, also powered by Vite!
  </p>
</main>


<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  main {
    text-align: center;
    padding: 0;
    margin: 0 auto;
    height:100vh;
  }

  /* img {
    height: 16rem;
    width: 16rem;
  } */

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 100;
    line-height: 1.1;
    margin: 2rem auto;
    max-width: 14rem;
  }

  p {
    max-width: 14rem;
    margin: 1rem auto;
    line-height: 1.35;
  }

  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }

    p {
      max-width: none;
    }
  }

  /* #ghostSpace{
    position:fixed;
    top:0;
    z-index: -1000;
    width:100vw;
    height:100vh;
    background-color: rgba(10,220,0,0.2);
  } */
</style>
