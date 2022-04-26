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
    } from "pts";
    import { store } from "../lib/stores";
    import Kefir from "kefir";

    //at some point colors should be imported from the store
    let [color1, color2] = ["#fa5", "#f06"];
    let container, space, form;

    // function handleDrag(x: number, y: number, t: number = 0) {
    //     store.tracker.update((n) => [x, y]);
    // }

    onMount(() => {
        space = new CanvasSpace(container).setup({ bgcolor: color1, resize:true});
        form = space.getForm();
        let pointArray = [[0.5, 0],[0.2, 0],[0.3, 0]]
        let hs: Pt[];
        let handles=[];
        let rectWidth = 10;
        let currBound = new Bound();
        space.add({
            //create a canvas space
            start: (bound, space) => {
                currBound = bound;
                //create a group of points
                hs = Group.fromArray(pointArray).scale([currBound.width, 1], [0, currBound.height / 2]);
                // convert points to UIs
                handles = hs.map((h,i) => {
                    let ud = UIDragger.fromRectangle(Rectangle.from([h.x - rectWidth / 2, 0],rectWidth,currBound.height),{id:i},"");
                    // handle "holding" a handle

                    ud.on("down", (ui, pt) => {
                        const controller = new AbortController();
                        //todo: check where the mouse down

                        //bind the drag event to the window in order to handle dragging out of the slider area
                        window.addEventListener(
                            "mousemove",
                            (e) => {
                                let a = space.element.getBoundingClientRect();
                                
                                let delta = [
                                    e.offsetX - ui.state("offset").x,
                                    e.offsetY - ui.state("offset").y,
                                ];
                                //handle drag in the rendering view
                                ui.group.moveTo([
                                    Math.min(
                                        Math.max(delta[0], a.left),
                                        a.right
                                    ),
                                    0,
                                ]);
                                //handle drag in the model. So basically: we execute handler of the view and the handler of the model connected to the view
                                //handleDrag(ui.group[0].x, delta[1]);
                                e.stopPropagation();
                            },
                            { signal: controller.signal }
                        );
                        window.addEventListener(
                            "mouseup",
                            (e) => {
                                controller.abort();
                            },
                            { signal: controller.signal }
                        );
                    });
                    ud.on("enter", (ui, pt) =>
                        ui.group.scale([2, 1], ui.group.centroid())
                    );
                    ud.on("leave", (ui, pt) =>
                        ui.group.scale([0.5, 1], ui.group.centroid())
                    );
                    return ud;
                });
            },

            animate: (time, ftime) => {
                form.fillOnly("black");
                handles.forEach((h) => h.render((g) => form.rect(g)));
            },

            action: (type, px, py, event) => {
                UI.track(handles, type, new Pt(px, py), event);
            },

            resize: (bound, evt) => {
                currBound = bound;
                hs = Group.fromArray(pointArray).scale([currBound.width, 1], [0, currBound.height / 2]);
                handles.map((h, i) => {
                    h.group = hs[i];
                });
                // handles.forEach(h => h.group = Rectangle.from(
                //             [h.x - rectWidth / 2, 0],
                //             rectWidth,
                //             currBound.height
                //         ))
            },
        });

        space.bindMouse().bindTouch().play();
    });
</script>

<div id="slider1" class="sketch"  bind:this={container} />

<!-- // the "state" attribute of ui contains a link to the ID of the corresponding
node in the constraint graph // adding an ui logs it in the graph. By default
the event handler is the identity function. // Constraints between uis can be
added. // Upon adding a constraint, the handlers are updated -->
<style>
    #slider1 {
        width: 80%;
        min-height:40vh;
        max-height: 50vh;
        margin:auto;
    }

    .sketch{
    padding-bottom:10px;
  }
</style>
