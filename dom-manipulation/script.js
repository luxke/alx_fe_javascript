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

// Show notification to user
function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.display = "block";

  setTimeout(() => {
    notification.style.display = "none";
  }, 5000);
}

// Fetch new quotes from the server
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

    let updated = false;
    const localQuotesMap = new Map(quotes.map(q => [q.text, q]));

    fetchedQuotes.forEach(serverQuote => {
      if (!localQuotesMap.has(serverQuote.text)) {
        quotes.push(serverQuote);
        updated = true;
      }
    });

    if (updated) {
      saveQuotes();
      showNotification("New quotes were added from the server!");
      populateCategories();
      showRandomQuote();
    }
  } catch (error) {
    console.error("Error fetching quotes:", error);
  }
}

// Send new quote to the server using POST
async function sendQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });

    if (!response.ok) {
      throw new Error("Failed to send quote to the server");
    }

    const responseData = await response.json();
    console.log("Quote successfully sent to the server:", responseData);
    showNotification("Quote successfully synced to the server!");

  } catch (error) {
    console.error("Error sending quote:", error);
  }
}

// Sync function: Fetch new quotes and send new ones
async function syncQuotes() {
  await fetchQuotesFromServer();

  // Send new quotes to the server
  let synced = false;
  for (let quote of quotes) {
    if (!quote.synced) {
      await sendQuoteToServer(quote);
      quote.synced = true; // Mark quote as synced
      synced = true;
    }
  }

  if (synced) {
    saveQuotes();
    alert("Quotes synced with server!"); // Show alert after syncing
  }
}

// Load last viewed quote from sessionStorage
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
  quoteDisplay.innerHTML = "";

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

  categorySelect.innerHTML = "";
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

  categorySelect.value = selectedCategory;
}

// Filter quotes by category
function filterQuotes(category) {
  selectedCategory = category;
  localStorage.setItem("selectedCategory", selectedCategory);

  const filteredQuotes =
    category === "all" ? quotes : quotes.filter((quote) => quote.category === category);
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  filteredQuotes.forEach((quote) => displayQuote(quote));
}

// Manually trigger full sync
async function manualSync() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!response.ok) {
      throw new Error("Failed to fetch quotes");
    }
    const fetchedData = await response.json();

    quotes = fetchedData.map((post) => ({
      text: post.title,
      category: "Fetched",
      synced: true
    }));

    saveQuotes();
    showNotification("Local quotes have been replaced with fresh data from the server!");
    populateCategories();
    showRandomQuote();
  } catch (error) {
    console.error("Error during manual sync:", error);
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

  document.getElementById("manualSync").addEventListener("click", manualSync);
  document.getElementById("syncToServer").addEventListener("click", syncQuotes);

  // Periodic sync (every 60 seconds)
  setInterval(syncQuotes, 60000);

  // Fetch quotes from external API initially
  fetchQuotesFromServer();
}

// Run initialization
initialize();
