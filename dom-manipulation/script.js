// Initialize the quotes array
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to create it.", category: "Inspiration" },
  { text: "Do what you can, with what you have, where you are.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Perseverance" }
];

// Sync quotes every 30 seconds (simulate periodic updates)
setInterval(syncQuotes, 30000);

// Initial page setup
document.addEventListener("DOMContentLoaded", () => {
  // Display the quotes initially
  displayQuotes(quotes);
  syncQuotes(); // Fetch quotes from the server when the page loads
});

// Sync quotes from server and update local storage
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  console.log("Server quotes fetched:", serverQuotes);

  // Check for discrepancies and handle conflict resolution
  const conflicts = handleConflicts(serverQuotes);

  // Notify the user of the conflict resolution or data update
  if (conflicts) {
      showStatusMessage("Conflicts resolved. Server data is now up-to-date.", "success");
  } else {
      showStatusMessage("New quotes have been fetched from the server.", "info");
  }

  // Save the updated quotes to local storage
  saveQuotes();
  displayQuotes(quotes); // Refresh the displayed quotes with the merged list
}

// Simple conflict resolution: Server data takes precedence
function handleConflicts(serverQuotes) {
  let conflictsDetected = false;

  // Loop through the server quotes and update local quotes if there's a conflict
  serverQuotes.forEach(serverQuote => {
      const existingQuoteIndex = quotes.findIndex(q => q.text === serverQuote.text);
      if (existingQuoteIndex === -1) {
          // If the quote is not already in the local storage, add it
          quotes.push(serverQuote);
      } else {
          // If the quote exists, update it with the server's version (conflict resolution)
          conflictsDetected = true;
          quotes[existingQuoteIndex] = serverQuote;
      }
  });

  return conflictsDetected; // Return true if any conflict was detected
}

// Function to save the updated quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Simulate fetching quotes from the server (mock API call)
async function fetchQuotesFromServer() {
  try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const serverQuotes = await response.json();

      // Simulate server response structure for quotes
      return serverQuotes.slice(0, 3).map(quote => ({
          text: quote.title, // Use the 'title' field from the server response as the quote text
          category: "Server"  // Simulate all server quotes as belonging to the "Server" category
      }));
  } catch (error) {
      console.error('Error fetching data from server:', error);
      return [];
  }
}

// Function to display the quotes on the webpage
function displayQuotes(filteredQuotes) {
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = filteredQuotes.map(quote => `"${quote.text}" <br><strong>- (${quote.category})</strong>`).join("<br><br>");
}

// Function to show status message at the top of the page
function showStatusMessage(message, type) {
  const statusBar = document.getElementById("statusBar");
  statusBar.textContent = message;
  
  // Set the status bar color based on the type of message
  if (type === "success") {
      statusBar.style.backgroundColor = "#28a745"; // Green for success
  } else if (type === "info") {
      statusBar.style.backgroundColor = "#007bff"; // Blue for information
  } else {
      statusBar.style.backgroundColor = "#ffc107"; // Yellow for warnings
  }

  statusBar.style.display = "block";

  // Hide the status bar after 5 seconds
  setTimeout(() => {
      statusBar.style.display = "none";
  }, 5000);
}

// Export quotes to a JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 4); // Pretty print JSON
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
      displayQuotes(quotes);
  };
  fileReader.readAsText(event.target.files[0]);
}

// Add event listeners for the export button
document.getElementById("exportquotes").addEventListener("click", exportToJsonFile);

// Optional: Add event listener for category filter if you have categories
document.getElementById("categoryFilter").addEventListener("change", filterQuotes);

// Function to filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(quote => quote.category === selectedCategory);
  displayQuotes(filteredQuotes);
}

// Function to populate categories in the filter (based on existing quotes)
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(quote => quote.category))];
  categories.forEach(category => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
  });
}

// Call populateCategories after quotes are loaded to populate filter
document.addEventListener("DOMContentLoaded", populateCategories);
