let levels = [];

levels[0] = {
  map:[
     [1,1,0,0,1],
     [1,0,0,0,0],
     [0,0,1,1,0],
     [0,0,0,1,0],
     [0,1,0,1,0]
  ],
  player: {
     x:0,
     y:4
  },
  goal:{
    x:4,
    y:1
  },
  theme:'default'
};

function Game(id, level) {
  
  this.el = document.getElementById(id);
  
  this.tileTypes = ['floor','wall'];
  
  this.tileDim = 32;
  
  // inherit the level's properties: map, player start, goal start.
  this.map = level.map;
  this.theme = level.theme
  this.player = {...level.player};
  this.goal = {...level.goal};
}

Game.prototype.populateMap = function() {
  
  this.el.className = 'game-container ' + this.theme;
  
  let tiles = document.getElementById('tiles');
  
  for (var y = 0; y < this.map.length; ++y) {
    
    for (var x = 0; x < this.map[y].length; ++x) {
              
           let tileCode = this.map[y][x];
       
           let tileType = this.tileTypes[tileCode];
       
           let tile = this.createEl(x, y, tileType);
       
           tiles.appendChild(tile); // add to tile layer
     }
  }
}

Game.prototype.createEl = function(x,y,type) {
   // create one tile.
  let el = document.createElement('div');
       
  // two class names: one for tile, one or the tile type.
  el.className = type;
  
  // set width and height of tile based on the passed-in dimensions.
  el.style.width = el.style.height = this.tileDim + 'px';
  
  // set left positions based on x coordinate.
  el.style.left = x*this.tileDim + 'px';
  
  // set top position based on y coordinate.
  el.style.top = y*this.tileDim + 'px';
      
  return el;
}

 Game.prototype.sizeUp = function() {
  
  // inner container so that text can be below it
  let map  = this.el.querySelector('.game-map');
  
  // inner container, height. Need this.map
  map.style.height = this.map.length * this.tileDim + 'px';
   
  map.style.width = this.map[0].length * this.tileDim + 'px';
}

function init() {
   let myGame = new Game('game-container-1',levels[0]);
    
   myGame.populateMap();
  
   myGame.sizeUp();
}

init();