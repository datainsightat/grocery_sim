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

    console.log([options,i,options[i]]);

    switch (options[i]) { 
        case 'n':
        obj.moveLeft();
        break;
        
        case 'e':
        obj.moveUp();
        break;

        case 's':
        obj.moveRight();
        break;
        
        case 'w':
        obj.moveDown();
        break;
    }

};

export {strategyRandomNoWalls};