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

//Stream that holds the value of a one time event (triggered on "startConditionStream") until an endConditionStream has been triggered                    
export const hold = function(startConditionStream,endConditionStream,transform){
    return startConditionStream.flatMap((e) => {
        return Kefir.interval(100, transform(e))
        .takeUntilBy(endConditionStream);
    })
}

//Stream that holds the value of a one time event (triggered on "startConditionStream") until an endConditionStream has been triggered, and counts how much time has elapsed
export const holdAndCountDate = function(startConditionStream,endConditionStream){
    return startConditionStream.flatMap(
        (e) => {
            let start: Date = new Date();
            let counter = Kefir.fromPoll(100, function () {
                let a: Date = new Date();
                return [a.getTime() - start.getTime(), e];
            });
            return counter.takeUntilBy(endConditionStream);
        }
    )
}




let mouseDragStream = Kefir.fromEvents(mouseDownStream).flatMap((md) => {
    return Kefir.fromEvents(mouseMoveStream).takeUntilBy(mouseUpStream);
});

// let scaleStream //returns a stream containing a homography matrix and a reference point

// const Resi
//
// //onClick scaling anchor
// let scalingAnchorClick
// let scaleStream = scalingAnchorClick.flatMap((e)=>)
// const scaleStream = function(){

// }
export const mouseDownStreamFactory = source => Kefir.fromEvents(source, "down")
export const mouseMoveStreamFactory = (source, transformer) => Kefir.fromEvents(source, "mousemove", transformer)