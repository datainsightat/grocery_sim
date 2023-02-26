// Randomly choose any direction, but do not crash into walls

import { getOptionsNoDouble,movePlayer } from "../move.js";

function strategyRandomNoDouble(obj) {

    // which neighbouring cells are free?
    let options = getOptionsNoDouble(obj);

    // pick a random cell of the list of available cells
    let i = Math.floor(Math.random() * options.length);

    movePlayer(obj,options[i]);

};

export {strategyRandomNoDouble};