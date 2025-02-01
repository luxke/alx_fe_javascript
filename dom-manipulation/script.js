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

// Function to show notification
function showNotification(message) {
  alert(message); // For now, we use an alert. You can replace it with a custom notification UI.
}

// Function to export quotes to a JSON file
function exportToJsonFile() {
  const quotesData = JSON.stringify(quotes, null, 2); // Convert quotes array to JSON string with indentation
  const blob = new Blob([quotesData], { type: "application/json" }); // Create a Blob for the JSON data
  const link = document.createElement("a"); // Create an anchor element

  link.href = URL.createObjectURL(blob); // Create a download URL for the blob
  link.download = "quotes.json"; // Set the file name for the downloaded file
  link.click(); // Trigger the download
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];

  if (!file) {
    showNotification("No file selected.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes = [...quotes, ...importedQuotes]; // Merge imported quotes with existing quotes
        saveQuotes();
        showNotification("Quotes imported successfully!");
        showRandomQuote(); // Optionally, show a random quote after import
      } else {
        showNotification("Invalid file format.");
      }
    } catch (error) {
      console.error("Error parsing JSON file:", error);
      showNotification("Failed to import quotes.");
    }
  };

  reader.readAsText(file);
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

  // Add event listener for the export button
  document.getElementById("exportQuotesButton").addEventListener("click", exportToJsonFile);

  // Add event listener for the import button
  document.getElementById("importQuotesInput").addEventListener("change", importFromJsonFile);
}

// Run initialization
initialize();
