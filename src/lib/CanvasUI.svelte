<script lang="ts">
    /* This is a quick test of Pts (https://ptsjs.org) with Svelte (https://svelte.dev) */
    import { onMount } from "svelte";
    import { store } from "../lib/stores";
    import { color_rgb_store } from "../lib/stores";
    import { CanvasSpace, Pt, Rectangle, Group, UIDragger, UIButton, UI, Line, Const, Curve, Num, Form} from "pts";


    //const colorRGB2store = color_rgb_store;

    let container, space, form;
    onMount(() => {
        space = new CanvasSpace(container).setup({ bgcolor: "#d66" });
        form = space.getForm();
        let handles;
        let firstPt, lastPt;
        let tension = 0.5;
        let prev;
        let ang = 0;

        space.add({
            start: (bound, space) => {
                let hs = Line.subpoints(
                    [
                        space.center.$multiply(0.25),
                        space.center.$add(space.center.$multiply(0.75)),
                    ],
                    5
                );

                // convert points to UIs
                handles = hs.map((h) => {
                    let ud = UIDragger.fromCircle([h, [10, 10]],{},"");

                    ud.onDrag((ui, pt) => {
                        // drag handling
                        ui.group[0].to(
                            space.pointer.$subtract(ui.state("offset"))
                        );
                    });

                    ud.onHover(
                        // hover handling
                        (ui) => ui.group[1].scale(2),
                        (ui) => ui.group[1].scale(1 / 2)
                    );
                    return ud;
                });
                form.fillOnly("#d66");
                handles.forEach( h => h.render( g => form.circle(g) ) );
                let hovOn = (ui) => ui.group.scale(3, ui.group.centroid());
                let hovOff = (ui) => ui.group.scale(1 / 3, ui.group.centroid());

                firstPt = UIButton.fromPolygon([
                    [0, space.center.y - 30],
                    [0, space.center.y + 30],
                    [30, space.center.y],
                ],{},"");
                firstPt.onClick((ui) => {
                    tension = Math.max(0.1, tension - 0.1);
                });
                firstPt.onHover(hovOn, hovOff);

                lastPt = UIButton.fromPolygon([
                    [space.width, space.center.y - 30],
                    [space.width, space.center.y + 30],
                    [space.width - 30, space.center.y],
                ],{},"");
                lastPt.onClick((ui) => {
                    tension = Math.min(2, tension + 0.1);
                });
                lastPt.onHover(hovOn, hovOff);
            },

            animate: (time, ftime) => {
                let ctrls = handles.map((g) => g.group[0]);
                ctrls.unshift(firstPt.group[2]);
                ctrls.push(lastPt.group[2]);

                let curve = Curve.cardinal(ctrls, 15, tension);
                curve.unshift(firstPt.group[0]);
                curve.unshift(new Pt(0, 0));
                curve.push(lastPt.group[0]);
                curve.push(new Pt(space.size.x, 0));
        

                form.fillOnly("#f06");
                handles.forEach((h) => h.render((g) => form.circle(g)));

                form.fillOnly("rgba(0,0,50,.8)").line(curve);
                firstPt.render((g) => form.fillOnly("#fe3").polygon(g));
                lastPt.render((g) => form.fillOnly("#0c6").polygon(g));
            },

            action: (type, px, py) => {
                UI.track(handles, type, new Pt(px, py), new MouseEvent("mousemove"));
                UI.track([firstPt, lastPt], type, new Pt(px, py), new MouseEvent("mousemove"));
            }, 

            resize: (bound, evt) => {
                if (form.ready) {
                    firstPt.group = Group.fromArray([
                        [0, space.center.y - 30],
                        [0, space.center.y + 30],
                        [30, space.center.y],
                    ]);
                    lastPt.group = Group.fromArray([
                        [space.width, space.center.y - 30],
                        [space.width, space.center.y + 30],
                        [space.width - 30, space.center.y],
                    ]);
                }
            },
        });

        //// ----
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
