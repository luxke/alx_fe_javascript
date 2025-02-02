const quotes = [
  { text: "Be youuuuu.", category: "love" },
  { text: "Trust the process .", category: "Motivation" },
  { text: "laugh out loud hahaaaaa.", category: "intentions" }
 
];

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerText = `"${quote.text}" - (${quote.category})`;
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

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
}
