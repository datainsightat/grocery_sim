let app = {};

(function(context) {

/*
 *  The game object constructor.
 *  @param {String} id - the id of the game container DOM element.
 *  @param {Object} level - the starting level of the game.
 */
  function Game(id,level) {

    // console.log(level);

    this.el = document.getElementById(id);
    this.slist = document.getElementById('shopping-list');
    this.rlist = document.getElementById('receipt');
    // level addition
    this.level_idx = 0;
    
    // establish the basic properties common to all this objects.
    this.tileTypes = ['floor','wall','shoppinglist'];
    this.tileDim = 12;

    // inherit the level's properties: map, player start, goal start.
    this.map = level.map;

    // console.log(this.map);

    this.shelfs = level.shelfs;

    this.promotions = level.promotions;

    this.theme = level.theme;
    
    // make a copy of the level's player.
    this.player = {...level.player};

    // set players knowledge level
    this.player.knowledge_level = new Array(this.map.length);

    for (var i = 0; i < this.player.knowledge_level.length; i++) {
      this.player.knowledge_level[i] = new Array(this.map[0].length).fill(0);
    }

    // initlialize player perception
    this.player.perception = {};

    // Memory steps;
    this.player.memory = 3;

    // create a property for the DOM element, to be set later.
    this.player.el = null;

    // Does the player follow a path?
    this.player.path = [];
    
    // make a copy of the goal.s
    this.goal = {...level.goal};

    // generate shoppinglist
    let min = 1;
    let max = 10;
    let no_items = Math.floor(Math.random() * (max - min + 1) + min);

    this.player.shoppinglist = [];
    this.player.receipt = [];

    let j = 0;

    for (var i = 0; i < no_items; i++) {
      j = Math.floor(Math.random() * (Object.keys(this.shelfs).length - 1 + 1) + 1) - 1;
      this.player.shoppinglist.push(this.shelfs[Object.keys(this.shelfs)[j]]);
    }

    // this.player.score.steps = 0;
    // this.player.score.money = 0;


  }

  /*
  * Create a tile or sprite <div> element.
  * @param {Number} x - the horizontal coordinate the 2D array.
  * @param {Number} y - the vertical coordinate in the 2D array.
  */
  Game.prototype.createEl = function(x,y,type) {
    // create one tile.
    let el = document.createElement('div');
        
    // two class names: one for tile, one or the tile type.
    el.className = type;

    let dim = 0;

    if (type==3) {
      dim = this.tileDim * 2;
    } else {
      dim = this.tileDim;
    }
    
    // set width and height of tile based on the passed-in dimensions.
    el.style.width = el.style.height = dim + 'px';
    
    // set left positions based on x coordinate.
    el.style.left = x*dim + 'px';
    
    // set top position based on y coordinate.
    el.style.top = y*dim + 'px';

    return el;
  }

  /*
  * Applies the level theme as a class to the game element. 
  * Populates the map by adding tiles and sprites to their respective layers.
  */
  Game.prototype.populateMap = function() {
    
    // add theme call
    this.el.className = 'game-container ' + this.theme;

    // make a reference to the tiles layer in the DOM.
    let tiles = this.el.querySelector('#tiles');
    
    // set up our loop to populate the grid.
    for (var y = 0; y < this.map.length; ++y) {
      for (var x = 0; x < this.map[y].length; ++x) {
        
        let tileCode = this.map[y][x];

          // determine tile type using code
          // index into the tileTypes array using the code.
        let tileType = this.tileTypes[tileCode];
        
        // call the helper function
        let tile = this.createEl(x,y,tileType);

        tile.setAttribute('id',''.concat('y',y,'x',x));

          // TEST TEST SATURATION
          tile.classList.remove('see_0,see_25,see_50,see_75,see_100');
          tile.className += ' see_0';

          if (this.shelfs['x'+x+'y'+y]) {
            tile.setAttribute('style',tile.getAttribute('style') + ' background-color:' + this.shelfs['x'+x+'y'+y].group);
          } else {
            if (this.map[y][x] == 1) { 
              tile.setAttribute('style',tile.getAttribute('style') + ' background-color:white');
            }
          }
        
        // add to layer
        tiles.appendChild(tile);
      }
    }
  }

  /*
  * Applies the level theme as a class to the game element. 
  * Populates the map by adding tiles and sprites to their respective layers.
  */
  Game.prototype.populateShoppinglist = function() {
    
    // add theme call
    //this.slist.className = 'shopping-list ' + this.theme;

    // make a reference to the tiles layer in the DOM.
    let sitems = this.slist.querySelector('#sitems');
    
    // set up our loop to populate the grid.
    for (var i = 0; i < this.player.shoppinglist.length; ++i) {

      let item_object = this.player.shoppinglist[Object.keys(this.player.shoppinglist)[i]]
      
      // call the helper function
      let sitem = this.createEl(0,i,3);

      sitem.setAttribute('id',item_object.item);

      sitem.className += ' see_100';

      sitem.setAttribute('style',sitem.getAttribute('style') + ' background-color:' + item_object.group);
      sitem.innerHTML = item_object.item
      // add to layer
      sitems.appendChild(sitem);
    }
  }

  /*
  * Applies the level theme as a class to the game element. 
  * Populates the map by adding tiles and sprites to their respective layers.
  */
  Game.prototype.populateReceipt = function() {
    
    // add theme call
    //this.slist.className = 'shopping-list ' + this.theme;

    // make a reference to the tiles layer in the DOM.
    let ritems = this.rlist.querySelector('#ritems');

    ritems.innerHTML = '';
    
    // set up our loop to populate the grid.
    for (var i = 0; i < this.player.receipt.length; ++i) {

      let item_object = this.player.receipt[Object.keys(this.player.receipt)[i]]
      
      // call the helper function
      let ritem = this.createEl(0,i,3);

      ritem.setAttribute('id',item_object.item);

      ritem.className += ' see_100';

      ritem.setAttribute('style',ritem.getAttribute('style') + ' background-color:' + item_object.group);
      ritem.innerHTML = item_object.item
      // add to layer
      ritems.appendChild(ritem);
    }
  }

  /*
  * Place the player or goal sprite.
  * @param {String} type - either 'player' or 'goal', used by createEl and becomes DOM ID
  */
  Game.prototype.placeSprite = function(type) {
    
    // syntactic sugar
    let x = this[type].x
    
    let y = this[type].y;
    
    // reuse the createTile function
    let sprite  = this.createEl(x,y,type);
    
    sprite.id = type;

    //console.log(type);
    // set strategy for player element
    if (type == 'player') {

      sprite.classList.remove(['idle']);
      sprite.className += ' idle';
      sprite.innerHTML += 'i';

    }
    
    // set the border radius of the sprite.
    sprite.style.borderRadius = this.tileDim + 'px';
    
    // get half the difference between tile and sprite.
    
    // grab the layer
    let layer = this.el.querySelector('#sprites');
    
    layer.appendChild(sprite);
    
    return sprite;
  }

/*
####################
# PERCEPTION LAYER #
####################
*/

  /*
  * Triggers a collide animation on the player sprite.
  */
  Game.prototype.collide = function(y,x) {

    let item_store = '';

    try {
      item_store = this.shelfs['x'+x+'y'+y].item;
    } catch (error) {
      item_store = 'NA';
    }

    for (var i = 0; i < this.player.shoppinglist.length; ++i) {
      // console.log(i,item_store,this.player.shoppinglist[i].item,item_store == this.player.shoppinglist[i].item)

      if (item_store == this.player.shoppinglist[i].item) {

        this.player.receipt.push(this.player.shoppinglist[i]);
        this.populateReceipt();

        this.player.shoppinglist.splice(i, 1);
        document.getElementById(item_store).outerHTML = '';
        this.shelfs['x'+x+'y'+y].quantity -= 1;
        // console.log(this.shelfs['x'+x+'y'+y]);
        break;
      }
    }

    // console.log(y,x,item_store);

    this.player.el.className += ' collide';
    
    let obj = this;
    
    window.setTimeout(function() {
    obj.player.el.classList.remove(['collide']);
    //obj.player.el.className = 'player';
    },200);

    // update perception
    perception(this);
    
    return 0;
    
  };

/*
###################
# PLAYER MOVEMENT #
###################
*/

  /*
  * Moves the player sprite left.
  */
  Game.prototype.moveLeft = function() {
    // if at the boundary, return
    if (this.player.x == 0) {
        this.collide();
        return;
    }
    // itentify next tile
    let nextTile = this.map[this.player.y][this.player.x-1];
  
    // if next tile is a wall, add collide effect and return
    if (nextTile ==1) {
        this.collide(this.player.y,this.player.x-1);
        return;
    }

    // change coordinates of player object
    this.player.x -=1;
    // update location of DOM element
    this.updateHoriz();
    // change colors
    // this.perception();
    perception(this);
  };

  /*
  * Moves the player sprite up.
  */
  Game.prototype.moveUp = function() {
    if (this.player.y == 0) {
          // at end: these could be combined
          this.collide();
          return;
    }
        
    let nextTile = this.map[this.player.y-1][this.player.x];
    if (nextTile ==1) {
          this.collide(this.player.y-1,this.player.x);
          return;
    }

    this.player.y -=1;
    this.updateVert();
    // change colors
    // this.perception();
    perception(this);
  };

  /*
  * Moves the player sprite right.
  */
  Game.prototype.moveRight = function()  {

    if (this.player.x == this.map[this.player.y].length-1) {
          this.collide();
          return;
    }

    let nextTile = this.map[this.player.y][this.player.x+1];
          
    if (nextTile ==1) {
          this.collide(this.player.y,this.player.x+1)
          return;
    }
    this.player.x += 1;
    
    this.updateHoriz();

    // change colors
    // this.perception();
    perception(this);
  };

  /*
  * Moves player sprite down.
  */
  Game.prototype.moveDown = function()  {

    if (this.player.y == this.map.length-1) {
          this.collide(nextTile);
          return;
    }
    // find the next tile in the 2D array.
          
    let nextTile = this.map[this.player.y+1][this.player.x];
      if (nextTile ==1) {
          this.collide(this.player.y+1,this.player.x)
          return;
    }

    this.player.y += 1;
    this.updateVert();

    // change colors
    // this.perception();
    perception(this);
  };

  /* 
  *  Updates vertical position of player sprite based on object's y coordinates.
  */
  Game.prototype.updateVert = function() { 
      this.player.el.style.top = this.player.y * this.tileDim+ 'px';
  };

  /* 
  *  Updates horizontal position of player sprite based on object's x coordinates.
  */  
  Game.prototype.updateHoriz = function() {
      this.player.el.style.left = this.player.x * this.tileDim + 'px'; 
  };

  /*
  * Moves player based on keyboard cursor presses.
  */
  Game.prototype.movePlayer = function(event) {

      event.preventDefault();
      
      if ((event.keyCode != 32 && event.keyCode < 37) || event.keyCode > 40) {
        return;
      }

      switch (event.keyCode) {
        case 32:
        this.step();
        break;

        case 37:
        this.moveLeft();
        break;
        
        case 38:
        this.moveUp();
        break;

        case 39:
        this.moveRight();
        break;
          
        case 40:
        this.moveDown();
        break;
      }
  }

  /*
  * Check on whether goal has been reached.
  */
  Game.prototype.checkGoal = function() {

      let body = document.querySelector('body');
    
      if (this.player.y == this.goal.y &&
        this.player.x == this.goal.x) {
        
        body.className = 'success';
      }
      else {
        body.className = '';
      }
  }

  /*
  * Changes the level of the game object.
  */
  Game.prototype.changeLevel = function() {
      
      // update the level index.
      this.level_idx ++;

      // if higher than max index, set back to zero.
        if (this.level_idx > levels.length -1) {
          this.level_idx = 0;
      }
      
      // get the level at this index.
      let level = levels[this.level_idx];
      
      // sync the map with the level map.
      this.map = level.map;
      // sync the theme with the level theme.
      this.theme = level.theme;

      // make a copy of the level's player object, since x and y change during the game.
      this.player = {...level.player};

      // make a copy of the level's goal object, since x and y change between levels.
      this.goal = {...level.goal};
  }

/*
################
# CONTROL LOOP #
################
*/

  Game.prototype.oneStep = function() {

    var e = document.getElementById("strategy");

    if (e.value == 'random') {
      strategyRandom(this);
    }

    if (e.value == 'random_no_walls') {
      strategyRandomNoWalls(this);
    }

    if (e.value == 'random_no_double') {
      strategyRandomNoDouble(this);
    }

    if (e.value == 'random_increase_2') {
      strategyRandomIncrease2(this);
    }

    if (e.value == 'bfs') {
      strategyBFS(this);
    }

    if (e.value == 'ri2b') {
      strategyRI2B(this);
    }

  }

/*
#############
# LISTENERS #
#############
*/

  /*
    *  Add keyboard, button, and maze tap listeners
    */
  Game.prototype.addListeners = function() {
    
    // this.keyboardListener();
    // let obj1 = this;
    keyboardListener(this);
    
    // this.buttonListeners();
    let obj = this;
    obj = buttonListeners(obj);
    
    // changing levels
    // this.addMazeListener();
    obj = addMazeListener(obj);

  }

/*
#########
# SETUP #
#########
*/

  /*
  * Sets the message of the text element.
  * @param {String} msg - The message to be printed.
  */
  Game.prototype.setMessage = function(msg) { 
    let text_el = this.el.querySelector('.text');
    text_el.textContent = msg;
  };

  /*
    * Sizes up the map based on array dimensions.
    */
  Game.prototype.sizeUp = function() {

  // inner container so that text can be below it
  let map  = this.el.querySelector('.game-map');

  // inner container, height. Need this.map
  map.style.height = this.map.length * this.tileDim + 'px';
    
  map.style.width = this.map[0].length * this.tileDim + 'px';
    
  };

  /*
  * Populates the map.
  * Sizes up the map based on array dimensions.
  * Gives the goal and player some references.
  */ 
  Game.prototype.placeLevel = function() {

    this.populateMap();

    this.populateShoppinglist();
    
    this.sizeUp();
    
    this.placeSprite('goal');
    
    // we want the DOM element that gets returned...
    let playerSprite = this.placeSprite('player');
    
    // ..so we can store it in the playerSprite element.
    this.player.el = playerSprite;

    let draw_radar = function(canvas_name) {

      const canvas = document.querySelector(canvas_name);

      if (!canvas.getContext) {
        return;
      }
    
      let ctx = canvas.getContext('2d');
    
      // set line stroke and line width
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;

      return(ctx);

    }

    this.knowledge_ctx = draw_radar('#knowledge_canvas');
    this.aisle_ctx = draw_radar('#aisle_canvas');
    this.aisle_unknown_ctx = draw_radar('#aisle_unknown_canvas');
    this.group_ctx = draw_radar('#group_canvas');
    this.item_ctx = draw_radar('#item_canvas');
    this.promotion_ctx = draw_radar('#promotion_canvas');

    // first impression of the store
    // this.perception();
    perception(this);

  }

  /*
   *  Initialization function called once
   */
  context.init = function () {

    let store_promise = '';

    // Read store data from JSON File
    store_promise = fetch('./data/store.json')
    .then((response) => response.json())
    // .then((json) => res = json);

    // Setup Simulation, once the data was read
    store_promise.then(function(level) {
    
      let myGame = new Game('game-container-1',level);
      
      // encapsulate for multi-level
      myGame.placeLevel();
      
      // add listeners
      myGame.addListeners();

    });

  }

})(app);

/*
 * Tell app to activate the init() function.
 */

import { buttonListeners,keyboardListener,addMazeListener } from './listeners.js';
import { perception } from './perception.js';

import { strategyRandom } from './models/strategyRandom.js';
import { strategyRandomNoWalls } from './models/strategyRandomNoWalls.js';
import { strategyRandomNoDouble } from './models/strategyRandomNoDouble.js';
import { strategyRandomIncrease2 } from './models/strategyRandomIncrease2.js';
import { strategyBFS } from './models/strategyBFS.js';
import { strategyRI2B } from './models/strategyRI2B.js';

app.init();