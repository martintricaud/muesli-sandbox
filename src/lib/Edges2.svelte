<script lang="ts">
    /* This is a quick test of Pts (https://ptsjs.org) with Svelte (https://svelte.dev) */
    import { onMount } from "svelte";
    import {CanvasSpace, Rectangle, Bound, Pt, Polygon, Geom, UI, UIButton} from "pts";
    import { makeEdgeAreas } from "../lib/pts-utils";
    let container, space, form;
    let frame, edgeAreas, edgeUIs, swatches;

    onMount(() => {
        space = new CanvasSpace(container).setup({
            bgcolor: "aliceblue",
            resize: true,
        });
        form = space.getForm();
        let currBound = new Bound();
        swatches = ["indianred", "steelblue", "yellow", "green"];
        let edgeEnter = (ui,pt) => {
                        ui.state("color",swatches[ui.state("id")])
                    }
        let edgeLeave = (ui) => {
                        ui.state("color","aliceblue");
                    }

        space.add({
            start: (bound, space) => {
                frame = Rectangle.from([0, 0], [space.width, space.height]);
                edgeAreas = makeEdgeAreas(Rectangle.corners(frame));
                edgeUIs = edgeAreas.map((ea,i) => {
                    let eui = UIButton.fromPolygon(ea, {color:"aliceblue",id:i}, "");
                    eui.on("enter",edgeEnter);
                    eui.on("leave", edgeLeave)
                    return eui;
                });
            },
            animate: (time, ftime) => {
                edgeUIs.forEach((eui, i) =>
                    eui.render((g) => form.fillOnly(eui.state("color")).polygon(g))
                );
            },
            action: (type, px, py, event) => {
                UI.track(edgeUIs, type, new Pt(px, py), event);
            },

            resize: (bound, evt) => {
                currBound = bound;
                //TODO handle UI resize
            },
        });
        space.bindMouse().bindTouch().play();
    });
</script>

<div id="edges" bind:this={container} />


<style>
    #edges {
        width: 80%;
        height: 50vh;
        margin: auto;
    }
</style>
