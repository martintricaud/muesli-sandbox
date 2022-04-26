import { derived, writable, Writable } from "svelte/store";
import Graph from 'graphology';


class Store {
    constructor(
        public edgeHighlight: Writable<string> = writable('aliceblue'),
        public background: Writable<string> = writable('cornsilk'),   
        public tracker: Writable<Array<number>> = writable([0,0]),
    ) { }

    get backgroundValue(){
        return this.background;
    }
    // get trackerValue(){
    //     return 
    // }

    // }
}


type ColorSwatch = {
    name: string;
    value: string;
};

class ColorSwatchesStore{
    constructor(
        public swatches: Writable<Array<ColorSwatch>> = writable()
    ){}
}
class colorRGBStore {
    constructor(
        public colorRGB: Writable<Array<number>> = writable([24,43,10]),
    ) { }

    // get fullname() {
    //     // Use derived to access writable values and export as readonly
    //     return derived(
    //         [this.color, this.lastname],
    //         ([$color, $lastName]) => {
    //             return $color + " " + $lastName
    //         }
    //     )
    // }
}


// Export a singleton
export const store = new Store();
export const color_rgb_store = new colorRGBStore();
export const colorSwatchesStore = new ColorSwatchesStore()