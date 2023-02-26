function getOptions(obj) {
    // console.log(obj.player.perception)

    let options = [];

    if (obj.map[obj.player.y-1][obj.player.x] == 0) {
        options.push('n');
    }

    if (obj.map[obj.player.y][obj.player.x+1] == 0) {
        options.push('e');
    }

    if (obj.map[obj.player.y+1][obj.player.x] == 0) {
        options.push('s');
    }

    if (obj.map[obj.player.y][obj.player.x-1] == 0) {
        options.push('w');
    }

    return(options)
}

function getOptionsNoDouble(obj) {
    // console.log(obj.player.perception)

    let options = [];

    // get all neighbouring cells, where the agent has not been.

    if ((obj.map[obj.player.y-1][obj.player.x] == 0) & (obj.player.knowledge_level[obj.player.y-1][obj.player.x] != 3)) {
        options.push('n');
    }

    if ((obj.map[obj.player.y][obj.player.x+1] == 0) & (obj.player.knowledge_level[obj.player.y][obj.player.x+1] != 3)) {
        options.push('e');
    }

    if ((obj.map[obj.player.y+1][obj.player.x] == 0) & (obj.player.knowledge_level[obj.player.y+1][obj.player.x] != 3)) {
        options.push('s');
    }

    if ((obj.map[obj.player.y][obj.player.x-1] == 0) & (obj.player.knowledge_level[obj.player.y][obj.player.x-1] != 3)) {
        options.push('w');
    }

    // if the agent has been at all surrounding cells, get all available cells

    if (options.length == 0) {

        if (obj.map[obj.player.y-1][obj.player.x] == 0) {
            options.push('n');
        }

        if (obj.map[obj.player.y][obj.player.x+1] == 0) {
            options.push('e');
        }

        if (obj.map[obj.player.y+1][obj.player.x] == 0) {
            options.push('s');
        }

        if (obj.map[obj.player.y][obj.player.x-1] == 0) {
            options.push('w');
        }

    }

    return(options)
}

function movePlayer(obj,direction) {

    switch (direction) { 
        case 'w':
        obj.moveLeft();
        break;
        
        case 'n':
        obj.moveUp();
        break;

        case 'e':
        obj.moveRight();
        break;
        
        case 's':
        obj.moveDown();
        break;
    }

}

export {getOptions,getOptionsNoDouble,movePlayer};