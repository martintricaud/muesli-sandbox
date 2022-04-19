import {Util, CanvasSpace, Pt, Rectangle, Group, Curve, UIDragger, UI, Line, UIButton, Bound, Geom, GroupLike} from "pts";

//1D Interactive space
//-- Inputs 1:  A pair of points [p1,p2]
//-- Input 2: A continuous path function with domain [0,1] and codomain [p1,p2]
//-- Input 3: A family of object in [0,1] with a generator whose domain is [0,1], codomain is shapes

//-- Every object in a 1D space is generated from a number between zero and 1 

export function edgeAreasUIs(boundary:Group){
    //
    let inner = boundary.scale(0.8, Bound.fromGroup(boundary).center).segments(2,1,true);
    let outer = boundary.segments(2,1,true);
    let c = Util.combine(outer,inner,(g1,g2)=>{
        // let a = g1.concat(g2.reverse());
        return Group.fromPtArray(g1.concat(g2.reverse()));
    });

    let edges = c.map(edgeArea=>UI.fromPolygon(edgeArea,{},""));
    return edges;
}

export function padding(shape:Group){
    return shape.scale(0.8, Bound.fromGroup(shape).center);
}

export function makeEdgeAreas(boundary:Group){
    //get the segments of the outer boundary.
    let outer = boundary.segments(2,1,true); //the segments are [A,B],[B,C],[C,D],[D,A]
    //offset the outer boundary and get the segments that compose it
    let inner = boundary.clone().scale([0.8,0.8], boundary.centroid())
    .segments(2,1,true) //[A1,B1],[B1,C1],[C1,D1],[D1,A1]
    .map(segment=>segment.reverse()) //[B1,A1],[C1,B1],[D1,C1],[A1,D1]
    let quads = Util.zip([outer,inner]) //[[A,B],[B1,A1]],[[B,C],[C1,B1]],[[C,D],[D1,C1]],[[D,A],[A1,D1]]
        .map(el=>Group.fromArray(Util.flatten(el))) //[[A,B,B1,A1],[B,C,C1,B1],[C,D,D1,C1],[D,A,A1,D1]]
    return quads;
}


// fromPolygon ( group, states, id )
// A static helper function to create a Polygon UI.