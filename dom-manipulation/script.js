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

// Fetch quotes from JSONPlaceholder (or a similar API)
async function fetchQuotesFromServer() {
  try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const serverQuotes = await response.json();

      // Simulating that the server provides quotes with a specific structure
      return serverQuotes.slice(0, 3).map(quote => ({
          text: quote.title,
          category: "Server"
      }));
  } catch (error) {
      console.error('Error fetching data from server:', error);
      return [];
  }
}

// Periodically fetch quotes from the server
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  console.log("Server quotes fetched:", serverQuotes);

  // Check for discrepancies and handle conflict resolution
  const conflicts = handleConflicts(serverQuotes);

  if (conflicts) {
      // Notify the user of the conflict
      alert("New quotes have been fetched from the server. Conflicts resolved by keeping server data.");
  } else {
      // If no conflicts, just update with new data
      alert("Quotes have been updated from the server.");
  }

  // Update local storage with the merged quotes
  saveQuotes();
  displayQuotes(quotes); // Refresh the displayed quotes
}

// Simple conflict resolution: Server data takes precedence
function handleConflicts(serverQuotes) {
  let conflictsDetected = false;

  // Simple conflict resolution: Replace local quotes with server quotes
  serverQuotes.forEach(serverQuote => {
      const existingQuoteIndex = quotes.findIndex(q => q.text === serverQuote.text);
      if (existingQuoteIndex === -1) {
          quotes.push(serverQuote); // If not found locally, add the server quote
      } else {
          quotes[existingQuoteIndex] = serverQuote; // Overwrite with server quote
          conflictsDetected = true;
      }
  });

  return conflictsDetected; // Return if any conflict was detected
}

// Function to simulate posting a new quote to the server
async function postQuoteToServer(newQuote) {
  try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST', // HTTP method POST
          headers: {
              'Content-Type': 'application/json', // Indicating that the body is in JSON format
          },
          body: JSON.stringify({
              title: newQuote.text, // Using "title" as the quote text
              body: newQuote.category, // Using "body" as the category
              userId: 1, // Mock userId for simulation
          }),
      });

      if (response.ok) {
          const serverResponse = await response.json();
          console.log("Server response:", serverResponse);
          return true;
      } else {
          console.error("Error posting data to server:", response.statusText);
          return false;
      }
  } catch (error) {
      console.error("Error sending data to server:", error);
      return false;
  }
}

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

// Function to add a new quote
async function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newQuoteText === "" || newQuoteCategory === "") {
      alert("Please enter both quote text and category.");
      return;
  }

  const newQuote = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(newQuote);
  saveQuotes(); // Save updated quotes to local storage

  // Try posting to the server
  const success = await postQuoteToServer(newQuote);
  if (success) {
      alert("New quote added successfully and synced with the server!");
  } else {
      alert("Failed to sync with the server. Quote added locally.");
  }

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

// Sync quotes every 30 seconds (simulate periodic updates)
setInterval(syncQuotes, 30000);

// Initial page setup
document.addEventListener("DOMContentLoaded", () => {
  // Load and display quotes from local storage
  const quotesArray = loadQuotes();
  quotes.length = 0;
  quotes.push(...quotesArray); // Populate with loaded quotes
  displayQuotes(quotes);

  // Populate categories and setup event listeners
  populateCategories();
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("addQuoteButton").addEventListener("click", addQuote);
  document.getElementById("exportquotes").addEventListener("click", exportToJson);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);

  // Initial sync
  syncQuotes();
});
