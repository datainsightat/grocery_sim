// Randomly choose any direction, but do not crash into walls

import { getOptions,movePlayer } from "../move.js";

function strategyRandomNoWalls(obj) {

    // which neighbouring cells are free?
    let options = getOptions(obj);

    // pick a random cell of the list of available cells
    let i = Math.floor(Math.random() * options.length);

    movePlayer(obj,options[i]);

};

export {strategyRandomNoWalls};