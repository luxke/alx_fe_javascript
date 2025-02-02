const quotes = [
  { text: "The best way to predict the future is to create it.", category: "Inspiration" },
  { text: "Do what you can, with what you have, where you are.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Perseverance" }
];

// Function to load quotes from local storage (if any)
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
      return JSON.parse(storedQuotes);
  }
  return quotes; // Fallback to default quotes
}

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Load quotes when the page is initialized
const quotesArray = loadQuotes();
quotes.length = 0; // Clear the original array
quotes.push(...quotesArray); // Populate with loaded quotes

// Populate categories dynamically in the category filter dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map(quote => quote.category))];

  // Remove all existing options
  categoryFilter.innerHTML = "";

  // Create a default "All Categories" option
  categories.forEach(category => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
  });

  // Restore last selected category from local storage
  const lastSelectedCategory = localStorage.getItem("selectedCategory");
  if (lastSelectedCategory) {
      categoryFilter.value = lastSelectedCategory;
  }
}

// Filter quotes based on the selected category
function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter").value;
  const filteredQuotes = categoryFilter === "all" ? quotes : quotes.filter(quote => quote.category === categoryFilter);

  // Display the filtered quotes
  displayQuotes(filteredQuotes);

  // Save the selected category in local storage
  localStorage.setItem("selectedCategory", categoryFilter);
}

// Display quotes on the page
function displayQuotes(filteredQuotes) {
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = filteredQuotes.map(quote => `"${quote.text}" <br><strong>- (${quote.category})</strong>`).join("<br><br>");
}

// Show a random quote when clicking the button
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" <br><strong>- (${quote.category})</strong>`;
}

// Show the last viewed quote from session storage on page load
function showLastViewedQuote() {
  const lastViewedQuote = sessionStorage.getItem("lastViewedQuote");
  if (lastViewedQuote) {
      const quote = JSON.parse(lastViewedQuote);
      document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" <br><strong>- (${quote.category})</strong>`;
  }
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newQuoteText === "" || newQuoteCategory === "") {
      alert("Please enter both quote text and category.");
      return;
  }

  const newQuote = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(newQuote);
  saveQuotes(); // Save updated quotes to local storage
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("New quote added successfully!");
  populateCategories(); // Update category dropdown after adding a new category
  filterQuotes(); // Refresh the displayed quotes based on the selected filter
}

// Export quotes to a JSON file
function exportToJson() {
  const jsonString = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
      try {
          const importedQuotes = JSON.parse(event.target.result);
          if (Array.isArray(importedQuotes) && importedQuotes.every(quote => quote.text && quote.category)) {
              quotes.push(...importedQuotes);
              saveQuotes();
              populateCategories();
              filterQuotes();
              alert('Quotes imported successfully!');
          } else {
              alert('Invalid file format.');
          }
      } catch (e) {
          alert('Error reading file: ' + e.message);
      }
  };
  const file = event.target.files[0];
  if (file) {
      fileReader.readAsText(file);
  }
}

// Initial page load setup
document.addEventListener("DOMContentLoaded", () => {
  populateCategories(); // Populate categories when the page loads
  showLastViewedQuote(); // Show last viewed quote if available
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("exportquotes").addEventListener("click", exportToJson);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);
  filterQuotes(); // Display quotes based on the selected category filter
});
