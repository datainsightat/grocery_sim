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
    
    // create a property for the DOM element, to be set later.
    this.player.el = null;
    
    // make a copy of the goal.s
    this.goal = {...level.goal};

    // generate shoppinglist
    min = 1;
    max = 10;
    no_items = Math.floor(Math.random() * (max - min + 1) + min);

    this.player.shoppinglist = [];

    for (var i = 0; i < no_items; i++) {
      j = Math.floor(Math.random() * (Object.keys(this.shelfs).length - 1 + 1) + 1) - 1;
      this.player.shoppinglist.push(this.shelfs[Object.keys(this.shelfs)[j]]);
    }

    console.log(this.player.shoppinglist.sort());

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
  * Triggers a collide animation on the player sprite.
  */
  Game.prototype.collide = function(y,x) {

    try {
      item = this.shelfs['x'+x+'y'+y].item;
    } catch (error) {
      item = 'NA';
    }

    for (var i = 0; i < this.player.shoppinglist.length; ++y) {
      if (item == this.player.shoppinglist[i].item) {
        delete this.player.shoppinglist[i];
        this.prototype.populateShoppinglist();
        break;
      }
    }

    console.log(y,x,item);

    this.player.el.className += ' collide';
    
    let obj = this;
    
    window.setTimeout(function() {
    obj.player.el.classList.remove(['collide']);
    //obj.player.el.className = 'player';
    },200);
    
    return 0;
    
  };

  /*
  Roate a ray from the players point of view and collect information about the map.
  Choose strategy based on information.
  */
  Game.prototype.perception= function() {
    // Clear radars

    clear_radar = function(ctx) {
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;
      ctx.clearRect(0,0,100,100);
      ctx.beginPath();
      ctx.arc(50, 50, 50, 0, 2 * Math.PI);
      ctx.stroke();
      // ctx.beginPath();
      // ctx.arc(50, 50, 2, 0, 2 * Math.PI);
      // ctx.fill();
    }

    draw_line = function(ctx,nav_x0,nav_y0,nav_dx,nav_dy,color,width) {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(nav_x0, nav_y0);
      ctx.lineTo(nav_x0 + nav_dx, nav_y0 + nav_dy);
      ctx.stroke();
    }

    clear_radar(this.knowledge_ctx);
    clear_radar(this.aisle_ctx);
    clear_radar(this.aisle_unknown_ctx);
    clear_radar(this.group_ctx);
    clear_radar(this.item_ctx);
    clear_radar(this.promotion_ctx);

    // set player center

    let y0 = [this.player.y] * 1;
    let x0 = [this.player.x] * 1;

    let ray_length = 25;

    let nav_x0 = 50;
    let nav_y0 = 50;

    let knowledge_sum = 0;
    let unknown_aisle_sum = 0;
    let aisle_sum = 0;
    let group_sum = 0;
    let item_sum = 0;
    let promotion_sum = 0;

    let knowledge_sin = 0;
    let knowledge_cos = 0;
    let unknown_aisle_sin = 0;
    let unknown_aisle_cos = 0;
    let aisle_sin = 0;
    let aisle_cos = 0;
    let group_sin = 0;
    let group_cos = 0;
    let item_sin = 0;
    let item_cos = 0;
    let promotion_sin = 0;
    let promotion_cos = 0;

    let rays = 8

    for (let i = (2 * Math.PI / rays); i <= 2 * Math.PI; i += (2 * Math.PI / rays)) {

      let knowledge_score = 0;
      let unknown_aisle_score = 0;
      let aisle_score = 0;
      let group_score = 0;
      let item_score = 0;
      let promotion_score = 0;

      let view_blocked = false;

      for (let j = 1; j <= ray_length; j++) {

        let dy = Math.round(Math.sin(i) * j);
        let dx = Math.round(Math.cos(i) * j);
        let y = y0 + dy;
        let x = x0 + dx;
        let tile = document.getElementById(''.concat('y',y,'x',x));

        // if coordinates are out of Matrix, break
        if (y < 0 | y > (this.player.knowledge_level.length-1) | x < 0 | x > (this.player.knowledge_level[0].length-1)) {
          knowledge_score += 2*((ray_length + 1)-j);
          break;
        }
    
        if (j > 2) {
          percive = 1
        } else {
          percive = 2
        }

        if (this.player.knowledge_level[y][x] < percive & view_blocked == false) {
          this.player.knowledge_level[y][x] = percive;
        }

        // if there is an aisle and the player has little knowledge about it and the view
        // is not blocked, increase score
        if (this.map[y][x] == 0 & view_blocked == false) {
          aisle_score += 1;
        }

        // if there is an aisle and the player has little knowledge about it and the view
        // is not blocked, increase score
        if (this.map[y][x] == 0 & this.player.knowledge_level[y][x] < 2 & view_blocked == false) {
          unknown_aisle_score += 1;
        }

        // sum up everything the player knows about the direction
        // if view is blocked, the player has all information about the wall objects
        if (view_blocked == true & this.map[y][x] == 1) {
          knowledge_score += 2;
        } else {
          knowledge_score += this.player.knowledge_level[y][x]
        }

        // If Agent sees group
        if (this.shelfs['x'+x+'y'+y]) {
          // Agent sees group
          if (this.player.knowledge_level[y][x] > 0) {
            group_score += 1;
          }
          // Agent sees item
          if (this.player.knowledge_level[y][x] > 1) {
            item_score += 1;
            tile.innerHTML = this.shelfs['x'+x+'y'+y].item;
            // if item is promoted
            if (this.promotions[this.shelfs['x'+x+'y'+y].item]) {
              promotion_score += 1;
              tile.className += ' promotion';
            }
          }
        }
    
        // set saturation of tile

        //console.log(tile.classList);
        tile.classList.remove('see_0','see_1','see_2');
        tile.className += ' see_'.concat(this.player.knowledge_level[y][x]);

        // If shelf hight > 1 then stop ray
        if (this.map[y][x] > 0) {
          view_blocked = true;
        }

      }

      // #onsole.log(i,aisle_score);

      // TEST LINE

      let know_nav_dy = Math.sin(i) * knowledge_score / (ray_length+1) * 50 / 2;
      let know_nav_dx = Math.cos(i) * knowledge_score / (ray_length+1) * 50 / 2;
      let aisle_nav_dy = Math.sin(i) * (aisle_score + 1) / ray_length * 50;
      let aisle_nav_dx = Math.cos(i) * (aisle_score + 1) / ray_length * 50;
      let aisle_unknown_nav_dy = Math.sin(i) * (unknown_aisle_score + 1) / ray_length * 50;
      let aisle_unknown_nav_dx = Math.cos(i) * (unknown_aisle_score + 1) / ray_length * 50;
      let group_dy = Math.sin(i) * (group_score) / ray_length * 250;
      let group_dx = Math.cos(i) * (group_score) / ray_length * 250;
      let item_dy = Math.sin(i) * (item_score) / ray_length * 250;
      let item_dx = Math.cos(i) * (item_score) / ray_length * 250;
      let promotion_dy = Math.sin(i) * (promotion_score) / ray_length * 250;
      let promotion_dx = Math.cos(i) * (promotion_score) / ray_length * 250;

      // draw a black line
      draw_line(this.knowledge_ctx,nav_x0,nav_y0,know_nav_dx,know_nav_dy,'black',1);
      draw_line(this.aisle_ctx,nav_x0,nav_y0,aisle_nav_dx,aisle_nav_dy,'black',1);
      draw_line(this.aisle_unknown_ctx,nav_x0,nav_y0,aisle_unknown_nav_dx,aisle_unknown_nav_dy,'black',1);
      draw_line(this.group_ctx,nav_x0,nav_y0,group_dx,group_dy,'black',1);
      draw_line(this.item_ctx,nav_x0,nav_y0,item_dx,item_dy,'black',1);
      draw_line(this.promotion_ctx,nav_x0,nav_y0,promotion_dx,promotion_dy,'black',1);

      // Aggregate Values

      knowledge_sin += Math.sin(i) * knowledge_score;
      knowledge_cos += Math.cos(i) * knowledge_score;
      unknown_aisle_sin += Math.sin(i) * unknown_aisle_score;
      unknown_aisle_cos += Math.cos(i) * unknown_aisle_score;
      aisle_sin += Math.sin(i) * aisle_score;
      aisle_cos += Math.cos(i) * aisle_score;
      group_sin += Math.sin(i) * group_score;
      group_cos += Math.cos(i) * group_score;
      item_sin += Math.sin(i) * item_score;
      item_cos += Math.cos(i) * item_score;
      promotion_sin += Math.sin(i) * promotion_score;
      promotion_cos += Math.cos(i) * promotion_score;

      knowledge_sum += knowledge_score;
      unknown_aisle_sum += unknown_aisle_score;
      aisle_sum += aisle_score;
      group_sum += group_score;
      item_sum += item_score;
      promotion_sum += promotion_score;

    }

    //https://en.wikipedia.org/wiki/Circular_mean

    knowledge_arc = Math.atan2(knowledge_sin / knowledge_sum, knowledge_cos / knowledge_sum);
    unknown_aisle_arc = Math.atan2(unknown_aisle_sin / unknown_aisle_sum, unknown_aisle_cos / unknown_aisle_sum);
    aisle_arc = Math.atan2(aisle_sin / aisle_sum, aisle_cos / aisle_sum);
    group_arc = Math.atan2(group_sin / group_sum, group_cos / group_sum);
    item_arc = Math.atan2(item_sin / item_sum, item_cos / item_sum);
    promotion_arc = Math.atan2(promotion_sin / promotion_sum, promotion_cos / promotion_sum);

    // console.log(aisle_avg);

    let know_nav_dy = Math.sin(knowledge_arc) * 50;
    let know_nav_dx = Math.cos(knowledge_arc) * 50;
    let aisle_nav_dy = Math.sin(aisle_arc) * 50;
    let aisle_nav_dx = Math.cos(aisle_arc) * 50;
    let aisle_unknown_nav_dy = Math.sin(unknown_aisle_arc) * 50;
    let aisle_unknown_nav_dx = Math.cos(unknown_aisle_arc) * 50;
    let group_dy = Math.sin(group_arc) * 50;
    let group_dx = Math.cos(group_arc) * 50;
    let item_dy = Math.sin(item_arc) * 50;
    let item_dx = Math.cos(item_arc) * 50;
    let promotion_dy = Math.sin(promotion_arc) * 50;
    let promotion_dx = Math.cos(promotion_arc) * 50;

    // console.log(knowledge_sum,knowledge_avg,know_nav_dx,know_nav_dy);

    draw_line(this.knowledge_ctx,nav_x0,nav_y0,know_nav_dx,know_nav_dy,'red',2);
    draw_line(this.aisle_ctx,nav_x0,nav_y0,aisle_nav_dx,aisle_nav_dy,'red',2);
    draw_line(this.aisle_unknown_ctx,nav_x0,nav_y0,aisle_unknown_nav_dx,aisle_unknown_nav_dy,'red',2);
    draw_line(this.group_ctx,nav_x0,nav_y0,group_dx,group_dy,'red',2);
    draw_line(this.item_ctx,nav_x0,nav_y0,item_dx,item_dy,'red',2);
    draw_line(this.promotion_ctx,nav_x0,nav_y0,promotion_dx,promotion_dy,'red',2);

  }

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
      this.perception();
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
    this.perception();
  };
  /*
  * Moves the player sprite right.
  */
  Game.prototype.moveRight = function()  {
    if (this.player.x == this.map[this.player.y].length-1) {
          this.collide();
          return;
    }
    nextTile = this.map[this.player.y][this.player.x+1];
          
    if (nextTile ==1) {
          this.collide(this.player.y,this.player.x+1)
          return;
    }
    this.player.x += 1;
    
    this.updateHoriz();

      // change colors
      this.perception();
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
    this.perception();
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
      
      if (event.keyCode < 37 || event.keyCode > 40) {
        return;
      }

      switch (event.keyCode) { 
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
    * If goal has been reached, 
    */
  Game.prototype.addMazeListener = function() {

    // grab the map

    let map = this.el.querySelector('.game-map');

    // grab reference to game object since we are going into a function 
    // and "this" will no longer refer to the game object

    let obj = this;

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
  };

  /*
  *  Responds to a keydown event by moving the player and checking the goal.
  */
  Game.prototype.keyboardListener = function() {
    document.addEventListener('keydown', event => {
        this.movePlayer(event);
        this.checkGoal();
    });
    
  }
  /*
    * Adds mouse down listeners to buttons
    */
  Game.prototype.buttonListeners = function() {
    let up = document.getElementById('up');
    let left = document.getElementById('left');
    let down = document.getElementById('down')
    let right = document.getElementById('right');
    
    // the sprite is out of date
    let obj = this;
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
    
  }
    
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

    draw_radar = function(canvas_name) {

      const canvas = document.querySelector(canvas_name);

      if (!canvas.getContext) {
        return;
      }
    
      ctx = canvas.getContext('2d');
    
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

  }

  /*
    *  Add keyboard, button, and maze tap listeners
    */
  Game.prototype.addListeners = function() {
    
    this.keyboardListener();
    
    this.buttonListeners();
    
    // changing levels
    this.addMazeListener();
  }
  
  /*
   *  Initialization function called once
   */
  context.init = function () {

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

app.init();