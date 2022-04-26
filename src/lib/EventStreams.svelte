<script lang="ts">
    /* This is a quick test of Pts (https://ptsjs.org) with Svelte (https://svelte.dev) */
    import { onMount } from "svelte";
    import {CanvasSpace,Rectangle,Bound,Pt,Polygon,Geom,UI,UIButton,Group,} from "pts";
    import Kefir from "kefir";
    //import {holdAndCount} from "../lib/stream-utils"
    let container, space, form;
    let left, right, leftUI, rightUI, swatches, halves;
    let uis = [];
    
    
    onMount(() => {
        //let testStream = Kefir.fromEvents(window,"resize");
        let mouseLeaveStream;
        let mouseEnterStream;
        let mouseInsideSinceStream;
        //mouseEnterStream = Kefir.interval(1000,0);
        space = new CanvasSpace(container).setup({
            bgcolor: "cornsilk",
            resize: true,
        });
        form = space.getForm();

        //let currBound = new Bound();
        swatches = ["sandybrown", "rosybrown"];

        //handler for when the mouse enters an edge area
        let edgeEnter = (ui) => {
            ui.state("color", swatches[1]);
            mouseEnterStream = Kefir.fromEvents(ui, "enter");
            mouseInsideSinceStream = mouseEnterStream.flatMap(
                (e) => {
                    let start: Date = new Date();
                    let counter = Kefir.fromPoll(10, function () {
                        return [new Date().getTime() - start.getTime(), e];
                    });
                    return counter.takeUntilBy(mouseLeaveStream);
                }
            );
            mouseInsideSinceStream.log();
        };


        //handler for when the mouse leaves an edge area
        let edgeLeave = (ui) => {
            ui.state("color", swatches[0]);
            mouseLeaveStream = Kefir.fromEvents(ui, "leave");
            
        };

        space.add({
            start: (bound, space) => {
                left = Rectangle.from([0, 0], [bound.width / 2, bound.height]);
                right = Rectangle.from([bound.width / 2, 0], [bound.width/2, bound.height]);
                let ha = [left]
                uis = ha.map((h, i) => {
                    let ui = UIButton.fromRectangle(h,{ color: swatches[i], id:i},"");
                    ui.on("enter", edgeEnter);
                    ui.on("leave", edgeLeave);
                    return ui
                });
            },
            animate: (time, ftime) => {
                uis.forEach((ui) =>
                    ui.render((g: Group) =>
                        form.fill(ui.state("color")).stroke("aliceblue",100,"miter").rect(g)
                    )
                );
            },
            action: (type, px, py, event) => {UI.track(uis, type, new Pt(px, py), event);},

            resize: (bound, evt) => {
                uis.forEach((ui)=>ui.group.scale(bound.center));
                //console.log(bound.center);

                //return(evt);
               
            },
        });
        space.bindMouse().bindTouch().play();
    });
</script>

<div id="eventstreams" class="sketch" bind:this={container} />

<style>
    #eventstreams {
        width: 80%;
        min-height: 40vh;
        max-height: 50vh;
        margin: auto;
    }

    .sketch {
        padding-bottom: 10px;
    }
</style>
