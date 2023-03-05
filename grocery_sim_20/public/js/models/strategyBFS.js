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

    // get a list of all avialable directions
    // let options = getOptions(obj,y,x);
    let i = 0;
    let paths = {};
    paths[i] = [[obj.player.y,obj.player.x]];
    i += 1;
    let options = [];

    for (let n=0;n<=3;n++) {

        let keys = JSON.parse(JSON.stringify(Object.keys(paths)));

        for (var k in keys) {
            //get neighbours of last item in path
            // console.log(paths[path]);
    
            var key = keys[k];
    
            options = getOptions(obj,paths[key][paths[key].length-1][0],paths[key][paths[key].length-1][1]);
    
            for (var option in options) {
    
                // path_tmp = paths[path].push(options[option]);
                paths[i] = JSON.parse(JSON.stringify(paths[key]));//[...paths[key]];
                paths[i].push(JSON.parse(JSON.stringify(options[option])));//options[option]);
                i += 1;
                // console.log(option,'a',options[option],'b',paths[path],'c',path_tmp);
            }
            delete paths[key];

        }

    }

    console.log(key,JSON.parse(JSON.stringify(paths)));

    // console.log(paths);
    // console.log(Object.keys(paths));

    // for (var path in Object.keys(paths)) {
    //     //get neighbours of last item in path
    //     var key = Object.keys(paths)[path];

    //     options = getOptions(obj,paths[key][paths[key].length-1][0],paths[key][paths[key].length-1][1]);

    //     for (var option in options) {

    //         // path_tmp = paths[path].push(options[option]);
    //         paths[i] = [...paths[key]];
    //         paths[i].push(options[option]);
    //         i += 1;
    //         // console.log(option,'a',options[option],'b',paths[path],'c',path_tmp);
    //     }
    //     delete paths[key];
    // }

    // console.log(paths);

    // def min_path_precise(map_, src, dest, COL, ROW):
    
    // d = {1:(obj.player.y,obj.player.x)};

    // let start = (obj.player.y,obj.player.x);

    // //A Queue to manage the nodes that have yet to be visited
    // var queue = [];
    // //Adding the node to start from
    // queue.push(start);
    // //A boolean array indicating whether we have already visited a node
    // var visited = [];
    // //(The start node is already visited)
    // visited[start] = true;
    // // Keeping the distances (might not be necessary depending on your use case)
    // var distances = []; // No need to set initial values since every node is visted exactly once
    // //(the distance to the start node is 0)
    // distances[start] = 0;

    // //While there are nodes left to visit...
    // while (queue.length > 0) {
    //     console.log("Visited nodes: " + visited);
    //     console.log("Distances: " + distances);
    //     var node = queue.shift();
    //     console.log("Removing node " + node + " from the queue...");
    //     //...for all neighboring nodes that haven't been visited yet....
    //     for (var i = 1; i < graph[node].length; i++) {
    //         if (graph[node][i] && !visited[i]) {
    //             // Do whatever you want to do with the node here.
    //             // Visit it, set the distance and add it to the queue
    //             visited[i] = true;
    //             distances[i] = distances[node] + 1;
    //             queue.push(i);
    //             console.log("Visiting node " + i + ", setting its distance to " + distances[i] + " and adding it to the queue");

    //         }
    //     }
    // }
    // console.log("No more nodes in the queue. Distances: " + distances);
    // return distances;

    // movePlayer(obj,options[i]);

};

export {strategyBFS};