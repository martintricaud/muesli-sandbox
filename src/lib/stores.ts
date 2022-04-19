import { derived, writable, Writable } from "svelte/store";
import Graph from 'graphology';


class Store {
    constructor(
        public color1: Writable<string> = writable('#52g'),
        public color2: Writable<string> = writable('#34a'),
        public colorRGB: Writable<Array<number>> = writable([24,43,10]),
        public tracker: Writable<Array<number>> = writable([0,0]),
        public tracker2: Writable<Array<number>> = writable([0,0])
    ) { }

    // get trackerValue(){
    //     return 
    // }
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


type ColorSwatch = Array<number> & { 
    name: string
}

class colorSwatchesStore{
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