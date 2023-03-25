// Write a JavaScript program that creates a maze with shelves containing grocery items.
// The maze should be drawn on an HTML canvas element and the items
// should be represented by their corresponding emoticons.
// Generate a random shopping list based on the items in the store and display
// it below the maze. Each item should show its emoticon, name, and item group.
// When the user hovers over an item with their mouse, display the item's emoticon, 
// name, and item group in a box below the maze

// Get the canvas element and 2D drawing context
const canvas = document.getElementById("maze");
const ctx = canvas.getContext("2d");

// Set the size of each tile in the maze
const tileSize = 20;

// Define the maze layout using 0 for empty, 1 for walls, 2 for start, and 3 for end
const maze = [
  [2, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 3],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
];


//This function uses a depth-first search algorithm to generate a maze with corridors that connect each row and column of shelves. The maze is represented as a 2D array of 0s and 1s, where 0 represents a corridor and 1 represents a shelf. The function takes two arguments, rows and cols, which specify the size of the maze in terms of the number of shelves. The resulting maze will have dimensions 2 * rows + 1 by 2 * cols + 1, where the extra 1s are added to allow for the extra corridors.
// function generateSupermarketLayout(rows, cols) {
//     const maze = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 1));
//     const cellSize = 3;
//     const shelfWidth = 3;
  
//     // Create aisles
//     for (let row = 0; row < rows; row += cellSize) {
//       for (let col = 0; col < cols; col++) {
//         maze[row][col] = 0;
//       }
//     }
  
//     for (let row = 0; row < rows; row++) {
//       for (let col = 0; col < cols; col += cellSize) {
//         maze[row][col] = 0;
//       }
//     }
  
//     // Create shelves
//     for (let row = cellSize; row < rows - cellSize; row += cellSize) {
//       for (let col = shelfWidth; col < cols - shelfWidth; col += shelfWidth * 2) {
//         // Create a shelf section
//         for (let i = 0; i < shelfWidth; i++) {
//           maze[row + i][col] = 0;
//           maze[row + i][col + 1] = 0;
//           maze[row + i][col + 2] = 0;
//         }
  
//         // Create a gap for shelf access
//         const gapRow = row + Math.floor(Math.random() * shelfWidth);
//         const gapCol = col + shelfWidth;
//         maze[gapRow][gapCol] = 1;
  
//         // Connect shelf to aisle
//         const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
//         let connected = false;
//         while (!connected) {
//           const dir = dirs[Math.floor(Math.random() * dirs.length)];
//           const dRow = dir[0];
//           const dCol = dir[1];
//           if (
//             maze[row + dRow * cellSize][col + dCol * cellSize] === 0 &&
//             maze[row + dRow * 2][col + dCol * 2] === 1
//           ) {
//             maze[row + dRow * 2][col + dCol * 2] = 0;
//             connected = true;
//           }
//         }
//       }
//     }
  
//     return maze;
//   }
  
//   const rows = 10;
//   const cols = 10;
//   const maze = generateSupermarketLayout(rows, cols);

// Function to draw the maze on the canvas
function drawMaze() {
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      const cell = maze[y][x];
      ctx.fillStyle = cell === 1 ? "black" : "white";
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }
}

// Define the item groups for the grocery store
const itemGroups = [
  "Fruits",
  "Vegetables",
  "Bakery",
  "Dairy",
  "Meat",
  "Frozen",
  "Beverages",
];

// Define the items in the grocery store with their names, item groups, emoticons, and colors
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

// Function to create a matrix of items grouped by their item group
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

// Create the item matrix
const itemMatrix = createItemMatrix();


// Function to generate a random number using a normal distribution
function normalRandom(min, max, mean, stdDev) {
  let rand;
  do {
    rand = mean + (Math.random() * 2 - 1) * 3 * stdDev;
  } while (rand < min || rand > max);
  return Math.floor(rand);
}

// Function to fill the shelves of the maze with items from the item matrix
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

// Fill the shelves of the maze and store the result in the groceryItems variable
const groceryItems = fillShelves();

// Function to draw the items on the shelves in the maze
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

// Function to display the shopping list in the HTML
function displayShoppingList(shoppingList) {

    const shoppingListBox = document.getElementById("shopping-list");
    shoppingListBox.innerHTML = "<strong>Shopping List:</strong><br>";
  
    shoppingList.forEach((item) => {
      shoppingListBox.innerHTML += `- ${item.emoticon} ${item.name} (${item.itemGroup})<br>`;
    });
  }
  
 // Function to generate a random shopping list 
  function generateRandomShoppingList() {
    const shoppingListLength = normalRandom(1, 15, 8, 3);
    const shoppingList = [];
  
    for (let i = 0; i < shoppingListLength; i++) {
      const itemIndex = Math.floor(Math.random() * items.length);
      shoppingList.push(items[itemIndex]);
    }
  
    return shoppingList;
  }
 
// Generate a random shopping list and display it in the HTML
const randomShoppingList = generateRandomShoppingList();
displayShoppingList(randomShoppingList);

// Function to show the item information when hovering over an item
function showItemInfo(item) {
    const infoBox = document.getElementById("item-info");
    if (item) {
      infoBox.innerHTML = `${item.emoticon}<br><strong>Item Group:</strong> ${item.itemGroup}<br><strong>Name:</strong> ${item.name}`;
    } else {
      infoBox.innerHTML = "";
    }
  }
  
// Add event listeners to handle mouse movements and display item information
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

// Function to draw the entire scene (maze and items)
function draw() {
    drawMaze();
    drawItems();
    }

// Draw the scene (maze and items)
draw();
  