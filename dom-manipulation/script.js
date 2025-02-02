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
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
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
  fileReader.onload = function (event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes(); // Save updated quotes to local storage
      alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
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
