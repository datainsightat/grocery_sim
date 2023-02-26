// Randomly choose any direction, but do not crash into walls

import { getOptions,getOptionsNoDouble,movePlayer } from "../move.js";

function strategyRandomIncrease2(obj) {

    let options = [];

    // Look at the first cell outside range of perception level 2 and get its value.
    // If the cells has a low perception value, add it to the options

    if ((obj.map[obj.player.y-3][obj.player.x] == 0) & (obj.map[obj.player.y-1][obj.player.x] == 0) & (obj.player.knowledge_level[obj.player.y-3][obj.player.x] <= 2)) {
        options.push('n');
    }

    if ((obj.map[obj.player.y][obj.player.x+3] == 0) & (obj.map[obj.player.y][obj.player.x+1] == 0) & (obj.player.knowledge_level[obj.player.y][obj.player.x+3] <= 2)) {
        options.push('e');
    }

    if ((obj.map[obj.player.y+3][obj.player.x] == 0) & (obj.map[obj.player.y+1][obj.player.x] == 0) & (obj.player.knowledge_level[obj.player.y+3][obj.player.x] <= 2)) {
        options.push('s');
    }

    if ((obj.map[obj.player.y][obj.player.x-3] == 0) & (obj.map[obj.player.y][obj.player.x-1] == 0) & (obj.player.knowledge_level[obj.player.y][obj.player.x-3] <= 2)) {
        options.push('w');
    }

    // console.log(options);

    // if the agent has been at all surrounding cells, get all available cells
    // Avoid cells where the player has already been

    if (options.length == 0) {
            options = getOptionsNoDouble(obj);
    }

    // Sometimes, to a random step
    if (Math.random() < 0.1) {
        console.log('random');
        options = getOptions(obj);
    }

    // pick a random cell of the list of available cells
    let i = Math.floor(Math.random() * options.length);

    movePlayer(obj,options[i]);

};

export {strategyRandomIncrease2};