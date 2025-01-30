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
    displayQuote(JSON.parse(lastQuote));
  }
}

// Show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  displayQuote(randomQuote);
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
}

// Display quote using textContent
function displayQuote(quote) {
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = ''; // Clear previous content
  
  const quoteText = document.createElement('p');
  quoteText.textContent = `"${quote.text}"`;
  
  const quoteCategory = document.createElement('small');
  quoteCategory.textContent = `— ${quote.category}`;
  
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// Populate categories dropdown
function populateCategories() {
  const categorySelect = document.getElementById('categoryFilter');
  const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
  
  categorySelect.innerHTML = ''; // Clear previous options
  const allOption = document.createElement('option');
  allOption.value = "all";
  allOption.textContent = "All Categories";
  categorySelect.appendChild(allOption);
  
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

// Filter quotes by category
function filterQuotes(category) {
  const filteredQuotes = category === "all" ? quotes : quotes.filter(quote => quote.category === category);
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = ''; // Clear previous quotes
  
  filteredQuotes.forEach(quote => displayQuote(quote));
}

// Initialize
function initialize() {
  showRandomQuote();
  loadLastViewedQuote();
  populateCategories();

  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('categoryFilter').addEventListener('change', (e) => {
    filterQuotes(e.target.value);
  });
}

// Run initialization
initialize();
