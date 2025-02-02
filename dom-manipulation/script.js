const quotes = [
  { text: "The best way to predict the future is to create it.", category: "Inspiration" },
  { text: "Do what you can, with what you have, where you are.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Perseverance" }
];

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" <br><strong>- (${quote.category})</strong>`;
}

// Add event listener for "Show New Quote" button when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
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
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("New quote added successfully!");
  showRandomQuote();

  // Optionally highlight the newly added quote (could be optional or styled differently)
  const quoteContainer = document.getElementById("quoteDisplay");
  quoteContainer.style.backgroundColor = "#f0f8ff"; // Light blue background for a short time
  setTimeout(() => {
      quoteContainer.style.backgroundColor = "";
  }, 2000);
}

function createAddQuoteForm() {
  const formContainer = document.createElement("div");
  formContainer.innerHTML = `
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
      <button id="addQuoteBtn">Add Quote</button>
  `;

  // Add event listener for "Add Quote" button after form creation
  const addQuoteBtn = formContainer.querySelector("#addQuoteBtn");
  addQuoteBtn.addEventListener("click", addQuote);

  document.body.appendChild(formContainer);
}

// Create the form for adding new quotes when DOM is fully loaded
document.addEventListener("DOMContentLoaded", createAddQuoteForm);
