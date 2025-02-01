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

// Function to create a form for adding new quotes
function createAddQuoteForm() {
  const formContainer = document.getElementById("addQuoteFormContainer");
  
  if (!formContainer) return; // Ensure container exists
  
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

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const quoteText = textInput.value.trim();
    const quoteCategory = categoryInput.value;

    if (quoteText && quoteCategory) {
      const newQuote = { text: quoteText, category: quoteCategory };
      quotes.push(newQuote);
      saveQuotes();
      alert("New quote added successfully!");

      // Clear the form
      textInput.value = "";
      categoryInput.value = "inspiration";
      populateCategories();
      showRandomQuote();
    } else {
      alert("Please fill in both fields.");
    }
  });

  formContainer.appendChild(form);
}

// Initialize
function initialize() {
  createAddQuoteForm();
}

// Run initialization
initialize();
