// Retrieve quotes from localStorage or use the default array
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Education is the key.", category: "inspiration" },
  { text: "Never listen to those who bring you down, and you will be successful.", category: "facts" },
  { text: "Never lose hope, keep pushing.", category: "true" },
  { text: "Key to success is education.", category: "joy" },
];

let selectedCategory = localStorage.getItem("selectedCategory") || "all";

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Fetch quotes from a remote server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!response.ok) {
      throw new Error("Failed to fetch quotes");
    }
    const fetchedData = await response.json();

    // Transform API data to match the required format
    const fetchedQuotes = fetchedData.map((post) => ({
      text: post.title,
      category: "Fetched",
    }));

    quotes = fetchedQuotes;
    saveQuotes();
    populateCategories();
    showRandomQuote();
  } catch (error) {
    console.error("Error fetching quotes:", error);
  }
}

// Load last viewed quote from sessionStorage (if available)
function loadLastViewedQuote() {
  const lastQuote = sessionStorage.getItem("lastViewedQuote");
  if (lastQuote) {
    displayQuote(JSON.parse(lastQuote));
  }
}

// Show a random quote
function showRandomQuote() {
  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((quote) => quote.category === selectedCategory);
  if (filteredQuotes.length === 0) return;

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
  displayQuote(randomQuote);
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
}

// Display quote
function displayQuote(quote) {
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = ""; // Clear previous content

  const quoteText = document.createElement("p");
  quoteText.textContent = `"${quote.text}"`;

  const quoteCategory = document.createElement("small");
  quoteCategory.textContent = `— ${quote.category}`;

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// Populate categories dropdown
function populateCategories() {
  const categorySelect = document.getElementById("categoryFilter");
  const uniqueCategories = [...new Set(quotes.map((quote) => quote.category))];

  categorySelect.innerHTML = ""; // Clear previous options
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Categories";
  categorySelect.appendChild(allOption);

  uniqueCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });

  categorySelect.value = selectedCategory; // Set previously selected category
}

// Filter quotes by category
function filterQuotes(category) {
  selectedCategory = category;
  localStorage.setItem("selectedCategory", selectedCategory);

  const filteredQuotes =
    category === "all" ? quotes : quotes.filter((quote) => quote.category === category);
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = ""; // Clear previous quotes

  filteredQuotes.forEach((quote) => displayQuote(quote));
}

// **NEW: Add a Quote and Send it via POST**
async function addQuote(text, category) {
  const newQuote = { text, category };
  
  // Save to localStorage
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  showRandomQuote();

  // Send to external server (optional)
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuote),
    });

    if (!response.ok) {
      throw new Error("Failed to send quote");
    }

    const responseData = await response.json();
    console.log("Quote successfully posted:", responseData);
  } catch (error) {
    console.error("Error posting quote:", error);
  }
}

// Initialize
function initialize() {
  showRandomQuote();
  loadLastViewedQuote();
  populateCategories();

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("categoryFilter").addEventListener("change", (e) => {
    filterQuotes(e.target.value);
  });

  // Handle form submission for adding new quotes
  document.getElementById("addQuoteForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const text = document.getElementById("quoteText").value.trim();
    const category = document.getElementById("quoteCategory").value.trim();

    if (text && category) {
      addQuote(text, category);
      document.getElementById("quoteText").value = ""; // Clear input
      document.getElementById("quoteCategory").value = ""; // Clear input
    } else {
      alert("Please enter both a quote and a category.");
    }
  });

  // Fetch quotes from external API
  fetchQuotesFromServer();
}

// Run initialization
initialize();
