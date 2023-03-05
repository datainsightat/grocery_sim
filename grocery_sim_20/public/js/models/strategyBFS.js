import { movePlayer } from "../move.js";

function strategyBFS(obj) {

    function getOptions(obj,y,x) {

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
    }

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
        
                options = getOptions(obj,paths[key][paths[key].length-1][0],paths[key][paths[key].length-1][1]);
        
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

    let solution = searchPath(obj);

    console.log(solution);


    // movePlayer(obj,options[i]);

};

export {strategyBFS};