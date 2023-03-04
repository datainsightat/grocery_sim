import { movePlayer } from "../move.js";

function strategyBFS(obj) {

    console.log('BFS')

    function getOptions() {

        let options = [];

        // get all neighbouring cells

        if (obj.map[obj.player.y-1][obj.player.x] == 0) { // & (obj.player.knowledge_level[obj.player.y-1][obj.player.x] != 3)) {
            options.push(obj.player.y-1,obj.player.x);
        }
    
        if (obj.map[obj.player.y][obj.player.x+1] == 0) { //  & (obj.player.knowledge_level[obj.player.y][obj.player.x+1] != 3)) {
            options.push(obj.player.y,obj.player.x+1);
        }
    
        if (obj.map[obj.player.y+1][obj.player.x] == 0) { //  & (obj.player.knowledge_level[obj.player.y+1][obj.player.x] != 3)) {
            options.push(obj.player.y+1,obj.player.x);
        }
    
        if (obj.map[obj.player.y][obj.player.x-1] == 0) { //  & (obj.player.knowledge_level[obj.player.y][obj.player.x-1] != 3)) {
            options.push(obj.player.y,obj.player.x-1);
        }

        return options;
    }

    // get a list of all avialable directions
    let options = getOptions(obj);

    console.log(options);

    let d = {};

    // def min_path_precise(map_, src, dest, COL, ROW):
    
    d = {1:(obj.player.y,obj.player.x)};

    let path_length = 2

    // while path_length < 401 and d[path_length-1]:
    //     # Fill fringe
    //     fringe = set()

    //     for x in d[path_length-1]:

    //         expand_x = {y for y in neighbors(x,map_) if not any(y in visited for visited in d.values())}
    //         fringe = fringe | expand_x
            
    //     # Have we found min path of exit node?
    //     if (dest.x, dest.y) in fringe:

    //         return path_length
        
    //     # Store new fring of minimal-path nodes
    //     d[path_length] = fringe
    //     # Find nodes with next-higher path_length
    //     path_length += 1

    // return 401 # Infinite path length

    movePlayer(obj,options[i]);

};

export {strategyBFS};