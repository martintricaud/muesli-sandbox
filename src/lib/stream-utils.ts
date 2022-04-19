import Kefir from "kefir"

let ud;

let mouseDownStream = Kefir.fromEvents(ud, "down");
let mouseUpStream = Kefir.fromEvents(window, "mouseup");
let mouseMoveStream = Kefir.fromEvents(
    window,
    "mousemove",
    (e) => [e.clientX, e.clientY]
);
let mouseLeaveStream = Kefir.fromEvents(ud, "leave");
let mouseEnterStream = Kefir.fromEvents(ud, "enter");

let mouseInsideSinceStream = mouseEnterStream.flatMap(
    (e) => {
        let start: Date = new Date();
        let counter = Kefir.fromPoll(100, function () {
            let a: Date = new Date();
            return [a.getTime() - start.getTime(), e];
        });
        return counter.takeUntilBy(mouseLeaveStream);
    }
);

let mouseInsideStream = mouseEnterStream.flatMap((e) => {
    return Kefir.interval(100, e).takeUntilBy(mouseLeaveStream);
});


let mouseDragStream = Kefir.fromEvents(mouseDownStream).flatMap((md) => {
    return Kefir.fromEvents(mouseMoveStream).takeUntilBy(mouseUpStream);
});
export const mouseDownStreamFactory = source => Kefir.fromEvents(source, "down")
export const mouseMoveStreamFactory = (source, transformer) => Kefir.fromEvents(source, "mousemove", transformer)