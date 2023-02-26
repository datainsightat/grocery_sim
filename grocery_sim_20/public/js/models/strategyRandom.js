// Randomly choose any direction

function strategyRandom(obj) {

    let keyCode = Math.floor(Math.random() * (40 - 37 + 1) + 37);

    switch (keyCode) { 
        case 37:
        obj.moveLeft();
        break;
        
        case 38:
        obj.moveUp();
        break;

        case 39:
        obj.moveRight();
        break;
        
        case 40:
        obj.moveDown();
        break;
    }

};

export {strategyRandom};