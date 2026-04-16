// We start by first getting the Elements

const foodName = document.getElementById("foodName");
const calories = document.getElementById("calories");
const addBtn = document.getElementById("addBtn");
const foodList = document.getElementById("foodList");
const totalDisplay = document.getElementById("total");
const resetBtn = document.getElementById("resetBtn");


async function getCaloriesFromAPI(foodName) {
  try {
    const response = await fetch(
      `https://api.edamam.com/api/food-database/v2/parser?ingr=${foodName}&app_id=YOUR_ID&app_key=YOUR_KEY`
    );

    if (!response.ok) {
      throw new Error("Network response error");
    }


    // Convert response to usable data

    const data = await response.json();

    // Extract calories safely
    const calories =
      data.parsed?.[0]?.food?.nutrients?.ENERC_KCAL;

      // Handle missing calorie data
    if (!calories) {
      throw new Error("No calorie data found");
    }

    // Return clean value as in Rounds off the number to the nearest integer and returns it.
    return Math.round(calories);


  // Catch block (error handling)
  // Logs error in console for debugging
  } catch (error) {
    console.log("Error:", error.message);

    // User-friendly message
    alert("Could not fetch real data. Using default calories.");

    return 100; // fallback value
  }
}

// Convert the item back to an object

let foods = JSON.parse(localStorage.getItem("foods")) || [];

// Display function
function displayFoods() {
  
// Clear old list
  foodList.innerHTML = "";

  // Temporary variable to calculate total
  let total = 0;

  // Loop through foods
  foods.forEach((food, index) => {

    // Keeps adding each food’s calories
    total += food.calories;

    // Create list item
    const li = document.createElement("li");

    // Add content + buttons to list item


  function editFood(index) {
  const newName = prompt("Enter new food name:", foods[index].name);

  if (!newName) return;

 async function editFood(index) {
  const newName = prompt("Enter new food name:", foods[index].name);

  if (!newName || !newName.trim()) return;

  const newCal = await getCaloriesFromAPI(newName);

  foods[index] = { name: newName.trim(), calories: newCal };

  displayFoods();
}
}

    li.innerHTML = `
      ${food.name} - ${food.calories} cal
      <button onclick="editFood(${index})">Edit</button>
      <button onclick="removeFood(${index})">X</button>
    `;

    // Add to page
    foodList.appendChild(li);
  });

  // Update total display
  totalDisplay.textContent = total;

  // Save data
  localStorage.setItem("foods", JSON.stringify(foods));
}

// Add food (with API)
addBtn.addEventListener("click", async () => {
  const name = foodName.value.trim();

  if (!name) return;

  // Get calories from API
  const cal = await getCaloriesFromAPI(name);

  foods.push({ name, calories: cal });

  // Clear inputs
  foodName.value = "";
  calories.value = "";

  displayFoods();
});

// Removes 1 item at that index
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
