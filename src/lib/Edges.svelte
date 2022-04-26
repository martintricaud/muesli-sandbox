<script lang="ts">
    /* This is a quick test of Pts (https://ptsjs.org) with Svelte (https://svelte.dev) */
    import { onMount } from 'svelte';
    import { CanvasSpace, Rectangle, Bound, Pt, Polygon, Geom, UI, UIButton, UIDragger } from 'pts';
    import { makeEdgeAreas } from '../lib/pts-utils';
    //import {holdAndCount} from '../lib/stream-utils';
    import Kefir from 'kefir';
    let container;
    let edgeAreas,edgeUIs = [],swatches, dummyRect, dummyUIs ;
    let uiRegistry = new Map();

    onMount(() => {
        uiRegistry.set(90, Kefir.never());
        let space = new CanvasSpace(container).setup({
            bgcolor: 'rgba(244,244,244,0.7)',
            resize: true,
        });
        let form = space.getForm();
        let currBound = new Bound();
        swatches = ['indianred', 'steelblue', 'khaki', 'olivedrab'];
        

        let edgeEnter = (ui) => {
            ui.state('color', swatches[ui.state('id')]);
        };

        //handler for when the mouse leaves an edge area
        let edgeLeave = (ui) => {
            ui.state('color', 'aliceblue');
        };

        space.add({
            start: (bound, space) => {
                // dummyRect = Polygon.rectangle([space.width/2, space.height/2], 100, 100);
                // dummyUIs = [dummyRect].map((dr)=>{
                //     let res
                //     let dui = UIDragger.fromPolygon(dr,{color: 'slategray'},"");
                //     res.push(dui);
                //     dr.forEach(corner=>{
                //         let cornerHandle = UIDragger.fromCircle(corner,{},"");
                //         res.push(cornerHandle)
                //     });
                //     return res;
                // });

                // EDGE AREAS
                edgeAreas = makeEdgeAreas(
                    Rectangle.corners(Rectangle.from([0, 0], [space.width, space.height]))
                );
                edgeUIs = edgeAreas.map((ea, i) => {
                    let eui = UIButton.fromPolygon(ea, { color: 'aliceblue', id: i }, i);
                    eui.on('enter', edgeEnter);
                    uiRegistry.set(
                        'enter_' + i,
                        Kefir.fromEvents(eui, 'enter', (ui) => ui.id)
                    );
                    eui.on('leave', edgeLeave);
                    uiRegistry.set(
                        'leave_' + i,
                        Kefir.fromEvents(eui, 'leave', (ui) => ui.id)
                    );
                    uiRegistry.set(
                        "enteredSince_" + i,
                        uiRegistry.get("enter_" + i).flatMap((e) => {
                            //starts a clock that ticks every 100ms and increments
                            let counter = Kefir.interval(100, 1).scan((prev, next) => next + prev,0);
                            return counter.takeUntilBy(
                                uiRegistry.get("leave_" + i)
                            );
                        })
                    );
                    return eui;
                });
                
                uiRegistry.forEach((val, key) => {
                    val.log(key + ': ');
                });
            },
            animate: (time, ftime) => {
                edgeUIs.forEach((eui, i) => {
                    //at each frame, render the edge UI areas as polygons of corresponding colors
                    eui.render((g) => form.fillOnly(eui.state('color')).polygon(g));
                });
            },
            action: (type, px, py, event) => {
                UI.track(edgeUIs, type, new Pt(px, py), event);
                //UI.track(dummyUIs, type, new Pt(px, py), event);
            },

            resize: (bound, evt) => {
                currBound = bound;
                edgeAreas = makeEdgeAreas(
                    Rectangle.corners(Rectangle.from([0, 0], [bound.width, bound.height]))
                );
                edgeUIs.map((eui, i) => {
                    eui.group = edgeAreas[i];
                });
            },
        });
        space.bindMouse().bindTouch().play();
    });
</script>

<div id="edges" class="sketch" bind:this={container} />

<style>
    #edges {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        margin: auto;
        z-index: 10;
    }

    .sketch {
        padding-bottom: 10px;
    }
</style>
