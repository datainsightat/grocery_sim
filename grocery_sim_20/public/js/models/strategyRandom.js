import { movePlayer } from "../move.js";

function strategyRandom(obj) {

    // get a list of all avialable directions
    let options = ['n','e','s','w'];

    // pick a random cell of the list of available cells
    let i = Math.floor(Math.random() * options.length);

    movePlayer(obj,options[i]);

};

export {strategyRandom};