import { derived, writable, Writable } from "svelte/store";

class Store {
    constructor(
        public color1: Writable<string> = writable('#52g'),
        public color2: Writable<string> = writable('#34a'),
        public colorRGB: Writable<Array<number>> = writable([24,43,10]),
        public tracker: Writable<number> = writable(0.5)
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