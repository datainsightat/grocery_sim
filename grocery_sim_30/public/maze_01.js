const canvas = document.getElementById("maze");
const ctx = canvas.getContext("2d");
const tileSize = 20;

const maze = [
  [2, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 3],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
];

function drawMaze() {
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      const cell = maze[y][x];
      ctx.fillStyle = cell === 1 ? "black" : "white";
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }
}

const itemGroups = [
  "Fruits",
  "Vegetables",
  "Bakery",
  "Dairy",
  "Meat",
  "Frozen",
  "Beverages",
];

const items = [
  { name: "Apples", itemGroup: "Fruits", emoticon: "🍏", color: "green" },
  { name: "Bananas", itemGroup: "Fruits", emoticon: "🍌", color: "yellow" },
  { name: "Carrots", itemGroup: "Vegetables", emoticon: "🥕", color: "orange" },
  { name: "Potatoes", itemGroup: "Vegetables", emoticon: "🥔", color: "brown" },
  { name: "Bread", itemGroup: "Bakery", emoticon: "🍞", color: "wheat" },
  { name: "Croissant", itemGroup: "Bakery", emoticon: "🥐", color: "gold" },
  { name: "Milk", itemGroup: "Dairy", emoticon: "🥛", color: "white" },
  { name: "Cheese", itemGroup: "Dairy", emoticon: "🧀", color: "yellow" },
  { name: "Chicken", itemGroup: "Meat", emoticon: "🍗", color: "peru" },
  { name: "Beef", itemGroup: "Meat", emoticon: "🥩", color: "sienna" },
  { name: "Ice Cream", itemGroup: "Frozen", emoticon: "🍨", color: "peachpuff" },
  { name: "Frozen Pizza", itemGroup: "Frozen", emoticon: "🍕", color: "tomato" },
  { name: "Soda", itemGroup: "Beverages", emoticon: "🥤", color: "coral" },
  { name: "Water", itemGroup: "Beverages", emoticon: "🚰", color: "blue" },
];

function createItemMatrix() {
  return items.reduce((matrix, item) => {
    const groupIndex = itemGroups.indexOf(item.itemGroup);
    if (!matrix[groupIndex]) {
      matrix[groupIndex] = [];
    }
    matrix[groupIndex].push(item);
    return matrix;
  }, []);
}

const itemMatrix = createItemMatrix();

function normalRandom(min, max, mean, stdDev) {
  let rand;
  do {
    rand = mean + (Math.random() * 2 - 1) * 3 * stdDev;
  } while (rand < min || rand > max);
  return Math.floor(rand);
}

function fillShelves() {
  const regionHeight = Math.ceil(maze.length / itemGroups.length);

  // Keep track of the last placed item in each region
  const lastPlacedItems = new Array(itemGroups.length).fill(null);

  const result = maze.map((row, rowIndex) => {
    return row.map((cell, cellIndex) => {
      if (cell === 1) {
        const itemGroupIndex = Math.floor(rowIndex / regionHeight);

        // If an item was previously placed, place the same item
        if (lastPlacedItems[itemGroupIndex]) {
          return lastPlacedItems[itemGroupIndex];
        }

        // Otherwise, place a random item and update the last placed item
        const itemIndex = Math.floor(Math.random() * itemMatrix[itemGroupIndex].length);
        const item = itemMatrix[itemGroupIndex][itemIndex];
        lastPlacedItems[itemGroupIndex] = item;
        return item;
      } else {
        // Reset the last placed item for each region when a non-shelf cell is encountered
        lastPlacedItems.fill(null);
        return null;
      }
    });
  });

  return result;
}

const groceryItems = fillShelves();

function drawItems() {
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let y = 0; y < groceryItems.length; y++) {
    for (let x = 0; x < groceryItems[y].length; x++) {
      const item = groceryItems[y][x];
      if (item) {
        ctx.fillStyle = item.color;
        ctx.fillText(item.emoticon, x * tileSize + tileSize / 2, y * tileSize + tileSize / 2);
    }
  }
}
}

function generateShoppingList() {
    const shoppingListLength = normalRandom(1, 15, 8, 3);
  
    const shoppingList = [];
  
    for (let i = 0; i < shoppingListLength; i++) {
      const itemGroupIndex = normalRandom(0, itemGroups.length - 1, (itemGroups.length - 1) / 2, 1);
      const itemIndex = Math.floor(Math.random() * itemMatrix[itemGroupIndex].length);
  
      shoppingList.push(itemMatrix[itemGroupIndex][itemIndex]);
    }
  
    return shoppingList;
  }
  
  const shoppingList = generateShoppingList();
  
  function displayShoppingList(shoppingList) {
    const shoppingListBox = document.getElementById("shopping-list");
    shoppingListBox.innerHTML = "<strong>Shopping List:</strong><br>";
  
    shoppingList.forEach((item) => {
      shoppingListBox.innerHTML += `- ${item.name} (${item.itemGroup})<br>`;
    });
  }
  
  displayShoppingList(shoppingList);

  class Customer {
    constructor() {
      this.x = 0;
      this.y = 0;
      this.pickedItems = [];
    }
  
    hasPickedItem(item) {
        return this.pickedItems.some(pickedItem => pickedItem.name === item.name);
      }

    draw() {
      ctx.fillStyle = 'red';
      ctx.fillRect(this.x * tileSize, this.y * tileSize, tileSize, tileSize);
    }
  }
  
  const customer = new Customer();
  
  function showItemInfo(item) {
    const infoBox = document.getElementById("item-info");
    if (item) {
      infoBox.innerHTML = `<strong>Item Group:</strong> ${item.itemGroup}<br><strong>Name:</strong> ${item.name}`;
    } else {
      infoBox.innerHTML = "";
    }
  }
  
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / tileSize);
    const y = Math.floor((e.clientY - rect.top) / tileSize);
  
    const item = groceryItems[y] && groceryItems[y][x];
    if (item) {
      showItemInfo(item);
    } else {
      showItemInfo(null);
    }
  });
  
  canvas.addEventListener("mouseleave", () => {
    showItemInfo(null);
  });

function draw() {
drawMaze();
drawItems();
customer.draw();
}

// function dfs(x, y, visited, remainingItems) {
//   if (
//     x < 0 || x >= maze[0]?.length ||
//     y < 0 || y >= maze?.length ||
//     visited[y][x] || maze[y][x] === 1
//   ) {
//     return null;
//   }

//   visited[y][x] = true;
//   const currentItem = groceryItems[y]?.[x];

//   if (currentItem && !customer.hasPickedItem(currentItem)) {
//     const remainingItemsIndex = remainingItems.findIndex(item => item.name === currentItem.name);
//     if (remainingItemsIndex > -1) {
//       remainingItems.splice(remainingItemsIndex, 1);
//     }
//   }

//   if (remainingItems.length === 0) {
//     return [[x, y]];
//   }

//   const directions = [
//     [-1, 0], // left
//     [1, 0], // right
//     [0, -1], // up
//     [0, 1], // down
//   ];

//   for (const [dx, dy] of directions) {
//     const newPath = dfs(x + dx, y + dy, visited, remainingItems);
//     if (newPath) {
//       newPath.unshift([x, y]);
//       return newPath;
//     }
//   }

//   visited[y][x] = false;
//   return null;
//   }

function bfs(x, y, visited, remainingItems) {
    const queue = [[x,y, []]];

  while (queue.length > 0) {
    const [x, y, path] = queue.shift();

    if (
      x < 0 || x >= maze[0]?.length ||
      y < 0 || y >= maze?.length ||
      visited[y][x] || maze[y][x] === 1
    ) {
      continue;
    }

    visited[y][x] = true;
    const currentItem = groceryItems[y]?.[x];

    if (currentItem && !customer.hasPickedItem(currentItem)) {
      const remainingItemsIndex = remainingItems.findIndex(item => item.name === currentItem.name);
      if (remainingItemsIndex > -1) {
        remainingItems.splice(remainingItemsIndex, 1);
      }
    }

    if (remainingItems.length === 0) {
      return path.concat([[x, y]]);
    }

    const directions = [
      [-1, 0], // left
      [1, 0], // right
      [0, -1], // up
      [0, 1], // down
    ];

    for (const [dx, dy] of directions) {
      queue.push([x + dx, y + dy, path.concat([[x, y]])]);
    }
  }

  return null;
}

function findPath() {
    const visited = maze.map(row => row.map(() => false));
    const remainingItems = [...shoppingList];
  
    // return dfs(customer.x, customer.y, visited, remainingItems);
    return bfs(customer.x, customer.y, visited, remainingItems);
  }
  
  function getNextPosition(path) {
    if (path && path.length > 1) {
      return { x: path[1][0], y: path[1][1] };
    }
    return null;
  }
  
  function updateCustomerPosition() {
    const path = findPath();
    const nextPosition = getNextPosition(path);
  
    if (nextPosition) {
      customer.x = nextPosition.x;
      customer.y = nextPosition.y;
  
      const currentItem = groceryItems[customer.y][customer.x];
      if (currentItem && !customer.hasPickedItem(currentItem)) {
        customer.pickedItems.push(currentItem);
        console.log(`Picked up ${currentItem.name} (${currentItem.itemGroup})`);
  
        if (customer.pickedItems.length === shoppingList.length) {
          console.log('Shopping completed!');
          return true;
        }
      }
  
      draw();
      return false;
    }
    return true;
  }
  
  function getClosestPosition(item) {
    let closestPosition = null;
    let minDistance = Infinity;
  
    for (let y = 0; y < groceryItems.length; y++) {
      for (let x = 0; x < groceryItems[y].length; x++) {
        if (groceryItems[y][x] && groceryItems[y][x].name === item.name) {
          const distance = Math.abs(customer.x - x) + Math.abs(customer.y - y);
          if (distance < minDistance) {
            closestPosition = { x: x, y: y };
            minDistance = distance;
          }
        }
      }
    }
  
    return closestPosition;
  }

  function startSimulation() {
    if (!updateCustomerPosition()) {
      setTimeout(startSimulation, 300);
    }
  }

  document.getElementById("start-simulation").addEventListener("click", startSimulation);

draw();
updateCustomerPosition();