<script lang='ts'>
    /* This is a quick test of Pts (https://ptsjs.org) with Svelte (https://svelte.dev) */
    import { onMount } from "svelte";
    import { CanvasSpace, Pt, Rectangle, Group, Curve, UIDragger, UI, Line, UIButton} from "pts";
    import { store } from "../lib/stores";
    
    let container, space, form;

    function handleDrag(x) {
		store.tracker.update(n => x);
	}

    onMount(() => {
        space = new CanvasSpace(container).setup({ bgcolor: "#fa5" });
        form = space.getForm();
        let handles;

        space.add({
            start: (bound, space) => {
                let hs = Line.subpoints([space.center.$multiply(0.25), space.center.$add(space.center.$multiply(0.75)),],3);
                // convert points to UIs
                handles = hs.map((h) => {
                    let rectWidth = 10;
                    let ud = UIDragger.fromRectangle(Rectangle.from([h.x-rectWidth/2,0],rectWidth,space.height),{},"");
                    ud.onDrag((ui, pt) => {
                        // drag handling
                        //TODO refactor this block
                        ui.group[0].to([space.pointer.$subtract(ui.state("offset")).x, 0]);
                        ui.group[1].to([space.pointer.$subtract(ui.state("offset")).x + rectWidth, space.height]);
                        handleDrag(ui.group[0].x);
                    });
                    // hover handling
                    ud.onHover((ui) => ui.group[1].scale(1),);
                    return ud;
                });
            },

            animate: (time, ftime) => {
                form.fillOnly("#f06");
                handles.forEach((h) => h.render((g) => form.rect(g)));
            },

            action: (type, px, py) => {
                UI.track(handles, type, new Pt(px, py), new MouseEvent(""));
            }, 

            // resize: (bound, evt) => {
            // },
        });

        space.bindMouse().bindTouch().play();
    });
</script>

<div id="pts" bind:this={container} />

<style>
    #pts {
        width: 100%;
        height: 100%;
    }
</style>
