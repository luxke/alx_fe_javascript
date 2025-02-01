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

// Function to get a random quote
function getRandomQuote() {
  if (quotes.length === 0) return null;
  return quotes[Math.floor(Math.random() * quotes.length)];
}

// Function to create a form for adding new quotes
function createAddQuoteForm() {
  const formContainer = document.getElementById("addQuoteFormContainer");
  
  if (!formContainer) return; // Ensure the container exists

  formContainer.innerHTML = ""; // Clear previous form if any
  
  const form = document.createElement("form");
  form.id = "addQuoteForm";

  const textInputLabel = document.createElement("label");
  textInputLabel.textContent = "Quote Text:";
  const textInput = document.createElement("textarea");
  textInput.id = "quoteText";
  textInput.required = true;

  const categoryInputLabel = document.createElement("label");
  categoryInputLabel.textContent = "Category:";
  const categoryInput = document.createElement("select");
  categoryInput.id = "quoteCategory";
  categoryInput.required = true;

  const categories = ["inspiration", "facts", "true", "joy"];
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryInput.appendChild(option);
  });

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Add Quote";

  form.appendChild(textInputLabel);
  form.appendChild(textInput);
  form.appendChild(categoryInputLabel);
  form.appendChild(categoryInput);
  form.appendChild(submitButton);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const quoteText = textInput.value.trim();
    const quoteCategory = categoryInput.value;

    if (quoteText && quoteCategory) {
      const newQuote = { text: quoteText, category: quoteCategory };
      quotes.push(newQuote);
      saveQuotes();
      showNotification("New quote added successfully!");

      // Sync quote to the server
      await syncQuoteWithServer(newQuote);

      // Clear the form
      textInput.value = "";
      categoryInput.value = "inspiration";
      populateCategories();
      showRandomQuote();
    } else {
      showNotification("Please fill in both fields.");
    }
  });

  formContainer.appendChild(form);
}

// Function to sync a new quote with the server
async function syncQuoteWithServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quote),
    });

    if (response.ok) {
      showNotification("Quotes synced with server!");
    } else {
      throw new Error("Failed to sync with server.");
    }
  } catch (error) {
    console.error("Sync error:", error);
    showNotification("Failed to sync quotes.");
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

  // Fetch quotes from external API initially
  fetchQuotesFromServer();

  // Add the Add Quote Form
  createAddQuoteForm();
}

// Run initialization
initialize();
