  /*
    * Adds mouse down listeners to buttons
    */

// http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export

function buttonListeners(obj) {

    let up = document.getElementById('up');
    let left = document.getElementById('left');
    let down = document.getElementById('down')
    let right = document.getElementById('right');
    let sequence_1 = document.getElementById('sequence_1');
    let sequence_10 = document.getElementById('sequence_10');
    let sequence_100 = document.getElementById('sequence_100');
    let sequence_1000 = document.getElementById('sequence_1000');
    let sequence_10000 = document.getElementById('sequence_10000');
    
    // the sprite is out of date
    // let obj = this;

    up.addEventListener('mousedown',function() {
      obj.moveUp();
      obj.checkGoal();   
    });

    down.addEventListener('mousedown',function() {
      obj.moveDown();
      obj.checkGoal();   
    });

    left.addEventListener('mousedown',function() {
      obj.moveLeft();
      obj.checkGoal();   
    });

    right.addEventListener('mousedown',function() {
      obj.moveRight();
      obj.checkGoal();   
    });

    sequence_1.addEventListener('mousedown',function() {
      for (var i = 0; i < 1; i++) {
        obj.oneStep();
        if (obj.player.y == obj.goal.y & obj.player.x == obj.goal.x) {
          return;
        }
      }
    });

    sequence_10.addEventListener('mousedown',function() {
      for (var i = 0; i < 10; i++) {
        obj.oneStep();
        if (obj.player.y == obj.goal.y & obj.player.x == obj.goal.x) {
          return;
        }
      }
    });

    sequence_100.addEventListener('mousedown',function() {
      for (var i = 0; i < 100; i++) {
        obj.oneStep();
        if (obj.player.y == obj.goal.y & obj.player.x == obj.goal.x) {
          return;
        }
      }
    });

    sequence_1000.addEventListener('mousedown',function() {
      for (var i = 0; i < 1000; i++) {
        obj.oneStep();
        if (obj.player.y == obj.goal.y & obj.player.x == obj.goal.x) {
          return;
        }
      }
    });

    sequence_10000.addEventListener('mousedown',function() {
      for (var i = 0; i < 10000; i++) {
        obj.oneStep();
        if (obj.player.y == obj.goal.y & obj.player.x == obj.goal.x) {
          return;
        }
      }
    });

	return obj;

};

function keyboardListener(obj) {

    document.addEventListener('keydown', event => {
        obj.movePlayer(event);
        obj.checkGoal();
    });

    // return obj;

};

function addMazeListener(obj) {

    // grab the map

    let map = obj.el.querySelector('.game-map');

    // grab reference to game object since we are going into a function 
    // and "this" will no longer refer to the game object

    // let obj = this;

    // if game board is clicked or tapped, see if we should change levels
    map.addEventListener('mousedown',function(e) {
        
        // if not at the goal, then get outta here
        if (obj.player.y != obj.goal.y ||
        obj.player.x != obj.goal.x) {
            return;
        }
        // change level of game object by changing it's properties
        obj.changeLevel();
        
        // get the two layers
        let layers = obj.el.querySelectorAll('.layer');
        
        // clear tiles and sprites from layers
        for (layer of layers) {
            layer.innerHTML = '';
        }
        
        // place the new level.
        obj.placeLevel();
        
        // check the goal to reset the message.
        obj.checkGoal();
        
    });

    return obj;

};

export {buttonListeners,keyboardListener,addMazeListener};