const canvas = document.getElementById("maze");
const ctx = canvas.getContext("2d");
const tileSize = 20;

const maze = [
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 3],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
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

function fillShelves() {
  const itemMatrix = items.reduce((matrix, item) => {
    const groupIndex = itemGroups.indexOf(item.itemGroup);
    if (!matrix[groupIndex]) {
      matrix[groupIndex] = [];
    }
    matrix[groupIndex].push(item);
    return matrix;
  }, []);

  const result = maze.map((row, rowIndex) => {
    return row.map((cell, cellIndex) => {
      if (cell === 1) {
        const itemGroupIndex = Math.floor(Math.random() * itemMatrix.length);
        const itemIndex = Math.floor(Math.random() * itemMatrix[itemGroupIndex].length);
        return itemMatrix[itemGroupIndex][itemIndex];
      } else {
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