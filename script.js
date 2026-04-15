// We start by first getting the Elements

const foodName = document.getElementById("foodName");
const calories = document.getElementById("calories");
const addBtn = document.getElementById("addBtn");
const foodList = document.getElementById("foodList");
const totalDisplay = document.getElementById("total");
const resetBtn = document.getElementById("resetBtn");



async function getCalories(foodName) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Math.floor(Math.random() * 500));
    }, 500);
  });
}


// Convert the item back to an object

let foods = JSON.parse(localStorage.getItem("foods")) || [];


function displayFoods() {
  foodList.innerHTML = "";
  let total = 0;

  foods.forEach((food, index) => {
    total += food.calories;

    const li = document.createElement("li");

    li.innerHTML = `
      ${food.name} - ${food.calories} cal
      <button onclick="removeFood(${index})">X</button>
    `;

    foodList.appendChild(li);
  });

  totalDisplay.textContent = total;

  // Save data
  localStorage.setItem("foods", JSON.stringify(foods));
}

// Add food
addBtn.addEventListener("click", () => {
  const name = foodName.value.trim();
  const cal = parseInt(calories.value);

  if (!name || isNaN(cal)) return;

  foods.push({ name, calories: cal });

  foodName.value = "";
  calories.value = "";

  displayFoods();
});

// Remove food
function removeFood(index) {
  foods.splice(index, 1);
  displayFoods();
}

// Reset all
resetBtn.addEventListener("click", () => {
  foods = [];
  displayFoods();
});

// Load on start
displayFoods();
