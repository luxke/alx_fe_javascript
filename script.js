const quotes = [
  { text: "Education is the key.", category: "inspiration" },
  { text: "Never listen to those who bring you down, and you will be successfull.", category: "facts" },
  { text: "Never lose hope,keep pushing.", category: "True" },
  { text: "Key to success is education.", category: "joy" },
];

function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <small>— ${randomQuote.category}</small>
  `;
}
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

  document.body.appendChild(formContainer);

 const form = document.getElementById('addQuoteForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const quoteText = document.getElementById('quoteText').value;
    const quoteCategory = document.getElementById('quoteCategory').value;

    quotes.push({ text: quoteText, category: quoteCategory });

    form.reset();

    alert("New quote added successfully!");

    showRandomQuote();
  });
}

document.getElementById('newQuote').addEventListener('click', showRandomQuote);

showRandomQuote();
createAddQuoteForm();
