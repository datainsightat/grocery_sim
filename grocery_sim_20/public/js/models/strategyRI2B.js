// The agent moves randomly, trying to move towards cells where he has not been before. If the agent recognices a color of an item of his shopping list, he moves towards the color.


import {getOptions,getOptionsNoDouble,movePlayer } from "../move.js";

function strategyRI2B(obj) {

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

    function getOptions_xy(obj,y,x) {

        let options = [];
    
        // get all neighbouring cells
    
        if (obj.map[y-1][x] == 0) { // & (obj.player.knowledge_level[obj.player.y-1][obj.player.x] != 3)) {
            options.push([y-1,x]);
        }
    
        if (obj.map[y][x+1] == 0) { //  & (obj.player.knowledge_level[obj.player.y][obj.player.x+1] != 3)) {
            options.push([y,x+1]);
        }
    
        if (obj.map[y+1][x] == 0) { //  & (obj.player.knowledge_level[obj.player.y+1][obj.player.x] != 3)) {
            options.push([y+1,x]);
        }
    
        if (obj.map[y][x-1] == 0) { //  & (obj.player.knowledge_level[obj.player.y][obj.player.x-1] != 3)) {
            options.push([y,x-1]);
        }
    
        return options;
    };

    function searchPath(obj) {

        let i = 0;
        let paths = {};
        paths[i] = [[obj.player.y,obj.player.x]];
        let goal = [obj.goal.y,obj.goal.x];
        i += 1;
        let options = [];
        let visited = ['y'+obj.player.y+'x'+obj.player.x];

        for (let n=0;n<=100;n++) {

            let keys = JSON.parse(JSON.stringify(Object.keys(paths)));
    
            for (var k in keys) {

                var key = keys[k];
        
                options = getOptions_xy(obj,paths[key][paths[key].length-1][0],paths[key][paths[key].length-1][1]);
        
                for (var option in options) {
    
                    if (options[option].join(',') == goal.join(',')) {
                        console.log ('Goal found')
                        let solution = JSON.parse(JSON.stringify(paths[key]));
                        solution.push(JSON.parse(JSON.stringify(options[option])));
                        return solution;
                    }

                    if (!visited.includes('y'+options[option][0]+'x'+options[option][1])) {
                        // path_tmp = paths[path].push(options[option]);
                        paths[i] = JSON.parse(JSON.stringify(paths[key]));//[...paths[key]];
                        paths[i].push(JSON.parse(JSON.stringify(options[option])));//options[option]);
                        i += 1;
                        visited.push('y'+options[option][0]+'x'+options[option][1]);
                    }

                }
                delete paths[key];
    
            }
    
        }

        return 0;
    }

    // console.log(obj.player.perception);

    // If player does not see color, searach random, else go to color

    let keys = JSON.parse(JSON.stringify(Object.keys(obj.player.perception[0])));
    let color = false;
    
    for (var k in keys) {

        var key = keys[k];

        if (obj.player.perception[0][key].group > 0) {
            color = true;
        }

    }

    
    if (color) {
        console.log('color');

    } else {
        console.log('random');
        strategyRandomIncrease2(obj);
    }

    // let solution = searchPath(obj);

    // console.log(solution);


    // movePlayer(obj,options[i]);

};


export {strategyRI2B};