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

// function generateMaze(numRegions, itemMatrix) {
//   const regionSizes = itemMatrix.map((group) => group.length);
//   const totalItems = regionSizes.reduce((sum, size) => sum + size, 0);

//   const numRows = Math.ceil(Math.sqrt(totalItems));
//   const numColumns = numRows;

//   const shelfSize = 1;
//   const aisleSize = 1;

//   const regionSizeY = Math.ceil(numRows / numRegions);
//   const regionSizeX = numColumns;

//   const maze = [];

//   for (let i = 0; i < numRows; i++) {
//     const row = [];
//     for (let j = 0; j < numColumns; j++) {
//       const regionIndex = Math.floor(i / regionSizeY);
//       const shelfIndex = i % regionSizeY;

//       if (shelfIndex % (shelfSize + aisleSize) === 0) {
//         row.push(1);
//       } else {
//         row.push(0);
//       }
//     }
//     maze.push(row);
//   }

//   return maze;
// }

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
  const itemMatrix = items.reduce((matrix, item) => {
    const groupIndex = itemGroups.indexOf(item.itemGroup);
    if (!matrix[groupIndex]) {
      matrix[groupIndex] = [];
    }
    matrix[groupIndex].push(item);
    return matrix;
  }, []);

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

function generateShoppingList(itemMatrix) {
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

drawMaze();
drawItems();