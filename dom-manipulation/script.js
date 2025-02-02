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

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" <br><strong>- (${quote.category})</strong>`;

  // Store the last viewed quote in session storage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

// Show the last viewed quote from session storage on page load
function showLastViewedQuote() {
  const lastViewedQuote = sessionStorage.getItem("lastViewedQuote");
  if (lastViewedQuote) {
      const quote = JSON.parse(lastViewedQuote);
      document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" <br><strong>- (${quote.category})</strong>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Show the last viewed quote if available
  showLastViewedQuote();

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
});

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
  showRandomQuote();
}

// Export quotes to a JSON file
function exportToJson() {
  // Convert the quotes array into a JSON string with indentation for readability
  const jsonString = JSON.stringify(quotes, null, 2);

  // Create a Blob object containing the JSON string
  const blob = new Blob([jsonString], { type: 'application/json' });

  // Create an Object URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create an anchor element to trigger the download
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json"; // You can customize this filename if needed
  a.click();

  // Revoke the Object URL after the download is triggered to clean up
  URL.revokeObjectURL(url);
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function(event) {
      try {
          // Parse the content of the JSON file
          const importedQuotes = JSON.parse(event.target.result);

          // Validate that the imported data is an array of quotes
          if (Array.isArray(importedQuotes) && importedQuotes.every(quote => quote.text && quote.category)) {
              // Merge the imported quotes with the existing ones
              quotes.push(...importedQuotes);
              saveQuotes(); // Save updated quotes to local storage
              alert('Quotes imported successfully!');
          } else {
              alert('Invalid file format. Please ensure the file contains an array of quotes with the correct format.');
          }
      } catch (e) {
          alert('Error reading file: ' + e.message);
      }
  };

  // Check if a file was selected
  const file = event.target.files[0];
  if (file) {
      // Read the selected file as text
      fileReader.readAsText(file);
  } else {
      alert('Please select a valid JSON file.');
  }
}

function createAddQuoteForm() {
  const formContainer = document.createElement("div");
  formContainer.innerHTML = `
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
      <button id="addQuoteBtn">Add Quote</button>
  `;

  // Add event listener for "Add Quote" button
  const addQuoteBtn = formContainer.querySelector("#addQuoteBtn");
  addQuoteBtn.addEventListener("click", addQuote);

  document.body.appendChild(formContainer);
}

function createExportImportButtons() {
  const exportButton = document.createElement("button");
  exportButton.innerText = "Export Quotes to JSON";
  exportButton.addEventListener("click", exportToJson);

  const importButton = document.createElement("button");
  importButton.innerText = "Import Quotes from JSON";

  const importFileInput = document.createElement("input");
  importFileInput.type = "file";
  importFileInput.accept = ".json";
  importFileInput.id = "importFile";
  importFileInput.addEventListener("change", importFromJsonFile);

  document.body.appendChild(exportButton);
  document.body.appendChild(importButton);
  document.body.appendChild(importFileInput);
}

// Create the quote form and export/import buttons
document.addEventListener("DOMContentLoaded", () => {
  createAddQuoteForm();
  createExportImportButtons();
});
