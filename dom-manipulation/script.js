// Retrieve quotes from localStorage or use the default array
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "Education is the key.", category: "inspiration" },
  { text: "Never listen to those who bring you down, and you will be successful.", category: "facts" },
  { text: "Never lose hope, keep pushing.", category: "True" },
  { text: "Key to success is education.", category: "joy" },
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Load last viewed quote from sessionStorage (if available)
function loadLastViewedQuote() {
  const lastQuote = sessionStorage.getItem('lastViewedQuote');
  if (lastQuote) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `
      <p>"${JSON.parse(lastQuote).text}"</p>
      <small>— ${JSON.parse(lastQuote).category}</small>
    `;
  }
}

// Show a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <small>— ${randomQuote.category}</small>
  `;

  // Save the last viewed quote to sessionStorage
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
}

// Populate categories dropdown
function populateCategories() {
  const categorySelect = document.getElementById('categoryFilter');
  const uniqueCategories = [...new Set(quotes.map(quote => quote.category))]; // Extract unique categories
  categorySelect.innerHTML = `
    <option value="all">All Categories</option>
    ${uniqueCategories.map(category => `<option value="${category}">${category}</option>`).join('')}
  `;
}

// Filter quotes by category
function filterQuotes(category) {
  const filteredQuotes = category === "all" ? quotes : quotes.filter(quote => quote.category === category);
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = filteredQuotes.map(quote => `
    <p>"${quote.text}"</p>
    <small>— ${quote.category}</small>
  `).join('');
}

// Add a new quote
function addQuote(quoteText, quoteCategory) {
  if (!quoteText || !quoteCategory) {
    alert("Please fill in both fields!");
    return;
  }

  // Check for duplicate quotes
  const isDuplicate = quotes.some(
    (quote) => quote.text.toLowerCase() === quoteText.toLowerCase()
  );

  if (isDuplicate) {
    alert("This quote already exists!");
    return;
  }

  // Add new quote
  quotes.push({ text: quoteText, category: quoteCategory });

  // Save to localStorage
  saveQuotes();

  // Update categories dropdown
  populateCategories();

  alert("New quote added successfully!");
  showRandomQuote();
}

// Export quotes to JSON file
function exportToJsonFile() {
  const json = JSON.stringify(quotes, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();

  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories(); // Update categories dropdown
    alert('Quotes imported successfully!');
    showRandomQuote();
  };
  fileReader.readAsText(event.target.files[0]);
}

// Create the "Add Quote" form dynamically
function createAddQuoteForm() {
  const formContainer = document.createElement('div');
  formContainer.innerHTML = `
    <h2>Add a New Quote</h2>
    <form id="addQuoteForm">
      <label for="quoteText">Quote Text:</label><br>
      <textarea id="quoteText" required></textarea><br>
      <label for="quoteCategory">Category:</label><br>
      <input id="quoteCategory" type="text" required><br>
      <button type="submit">Add Quote</button>
    </form>
  `;
  document.body.appendChild(formContainer); // Use appendChild to add the form to the DOM
}

// Create the export/import buttons dynamically
function createExportImportButtons() {
  const buttonContainer = document.createElement('div');
  buttonContainer.innerHTML = `
    <h2>Export/Import Quotes</h2>
    <button id="exportQuotes">Export Quotes to JSON</button>
    <input type="file" id="importFile" accept=".json" />
  `;
  document.body.appendChild(buttonContainer); // Use appendChild to add the buttons to the DOM
}

// Initialize
function initialize() {
  showRandomQuote();
  loadLastViewedQuote();
  populateCategories();

  // Create the "Add Quote" form
  createAddQuoteForm();

  // Create the export/import buttons
  createExportImportButtons();

  // Add event listener for the "Add Quote" form
  document.getElementById('addQuoteForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const quoteText = document.getElementById('quoteText').value.trim();
    const quoteCategory = document.getElementById('quoteCategory').value.trim();

    addQuote(quoteText, quoteCategory);
    e.target.reset();
  });

  // Add event listener for the "Export Quotes" button
  document.getElementById('exportQuotes').addEventListener('click', exportToJsonFile);

  // Add event listener for the "Import Quotes" file input
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);

  // Add event listener for the "Show New Quote" button
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);

  // Add event listener for the category filter dropdown
  document.getElementById('categoryFilter').addEventListener('change', (e) => {
    filterQuotes(e.target.value);
  });
}

// Run initialization
initialize();