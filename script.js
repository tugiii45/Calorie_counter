// Calorie Counter App Script
// This script handles adding, editing, and removing food items.
// It fetches calorie data from an API and saves data locally.

// Get HTML elements
const foodName = document.getElementById("foodName");
const calories = document.getElementById("calories");
const addBtn = document.getElementById("addBtn");
const foodList = document.getElementById("foodList");
const totalDisplay = document.getElementById("total");
const resetBtn = document.getElementById("resetBtn");

// Function to get calorie data from API
// Function to get calorie data from API
async function getCaloriesFromAPI(foodName) {
  try {
    // WARNING: API key is exposed in client-side code. Consider using a backend proxy for security.
    const response = await fetch(
      `https://api.edamam.com/api/food-database/v2/parser?ingr=${foodName}&app_id=yeettugi&app_key=6dL3Dxikx5@riZN`
    );

    if (!response.ok) {
      throw new Error("Network response error");
    }

    // Parse the JSON response
    const data = await response.json();

    // Get calorie value from the data
    const calories =
      data.parsed?.[0]?.food?.nutrients?.ENERC_KCAL;

    // If no calories found, throw error
    if (!calories) {
      throw new Error("No calorie data found");
    }

    // Round to nearest whole number and return
    return Math.round(calories);

  } catch (error) {
    // Log error for debugging
    console.log("Error:", error.message);

    // Show user-friendly message
    alert("Could not fetch real data. Using default calories.");

    // Return default value
    return 100;
  }
}

// Load saved food data from localStorage or start empty
let foods = JSON.parse(localStorage.getItem("foods")) || [];

// Function to display foods and update total
function displayFoods() {
  // Clear the current list
  foodList.innerHTML = "";

  // Start total at 0
  let total = 0;

  // Loop through each food item
  foods.forEach((food, index) => {

    // Add calories to total
    total += food.calories;

    // Create a list item element
    const li = document.createElement("li");

    // Set the content with name, calories, and buttons
    li.innerHTML = `
      ${food.name} - ${food.calories} cal
      <button onclick="editFood(${index})">Edit</button>
      <button onclick="removeFood(${index})">X</button>
    `;

    // Add the item to the page
    foodList.appendChild(li);
  });

  // Show the total calories
  totalDisplay.textContent = total;

  // Save the data to localStorage
  localStorage.setItem("foods", JSON.stringify(foods));
}

// Event listener for adding food
addBtn.addEventListener("click", async () => {
  const name = foodName.value.trim();

  if (!name) {
    alert("Please enter a food name.");
    return;
  }

  // Fetch calories from API
  const cal = await getCaloriesFromAPI(name);

  // Add to foods array
  foods.push({ name, calories: cal });

  // Clear input fields
  foodName.value = "";
  calories.value = "";

  // Update display
  displayFoods();
});

// Function to remove a food item
function removeFood(index) {
  // Remove the item from the array
  foods.splice(index, 1);
  // Update display
  displayFoods();
}

// Function to edit a food item
async function editFood(index) {
  // Ask user for new food name
  const newName = prompt("Enter new food name:", foods[index].name);

  if (!newName || !newName.trim()) return;

  // Fetch new calories from API
  const newCal = await getCaloriesFromAPI(newName);

  // Update the food item
  foods[index] = { name: newName.trim(), calories: newCal };

  // Update display
  displayFoods();
}

// Event listener for resetting all foods
resetBtn.addEventListener("click", () => {
  // Clear the foods array
  foods = [];
  // Update display
  displayFoods();
});

// Load and display foods when page starts
displayFoods();
