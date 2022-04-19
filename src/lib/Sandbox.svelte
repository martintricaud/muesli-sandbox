<script lang="ts">
    /* This is a quick test of Pts (https://ptsjs.org) with Svelte (https://svelte.dev) */
    import { onMount } from "svelte";
    import {
        CanvasSpace,
        Pt,
        Rectangle,
        Group,
        Curve,
        UIDragger,
        UI,
        Line,
        UIButton,
        Bound,
        Mat,
    } from "pts";
    import { store } from "../lib/stores";

    let b = new Bound;

    function handleResize(event){
        b.width = window.innerWidth;
        b.height = window.innerHeight;
    }
    //at some point colors should be imported from the store
    let [color1, color2] = ["indianred", "#f06"];
    let styleProps = {
        globalBackground:"aliceblue"
    }

    let container, space, form;
    let sliderStyleProps = {
        w: 1000,
        h: 100,
        thumb: 2,
        bg: "aliceblue",
        c: "lightsteelblue",
    };
    let sliderDataProps = [0.3, 0.5, 0.1];

    onMount(() => {
        b.width = window.innerWidth;
        b.height = window.innerHeight;
        space = new CanvasSpace(container).setup({ bgcolor: styleProps.globalBackground });
        form = space.getForm();
        let currBound = new Bound();

        space.add({
            animate: (time, ftime) => {
                // create a circles in each quarter
                let quads = Rectangle.quadrants([new Pt(), currBound.size]);
                let circles = quads.map((q) => Rectangle.toCircle(q));

                form.fillOnly("#09f").circles(circles);
                form.strokeOnly("#fff", 2).lines(quads);
                form.fill("#f03").point(b.center, 10, "circle");
                form.log("Size: " + currBound.size.toString());
            },

            resize: (bound, evt) => {
                currBound = bound;
            },
        });

        //// ----

        space.bindMouse().bindTouch().play();
    });
</script>
<svelte:window on:resize={handleResize}/>
<div id="pts2" bind:this={container} />

<!-- // the "state" attribute of ui contains a link to the ID of the corresponding
node in the constraint graph // adding an ui logs it in the graph. By default
the event handler is the identity function. // Constraints between uis can be
added. // Upon adding a constraint, the handlers are updated -->
<style>
    #pts2 {
        width: 100%;
        height: 100vh;
    }
</style>
