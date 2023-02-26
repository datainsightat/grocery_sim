// Randomly choose any direction, but do not crash into walls

function strategyRandomNoWalls(obj) {

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

    let i = Math.floor(Math.random() * options.length);

    switch (options[i]) { 
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

};

export {strategyRandomNoWalls};