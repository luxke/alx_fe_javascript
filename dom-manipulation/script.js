let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "Education is the key.", category: "inspiration" },
  { text: "Never listen to those who bring you down, and you will be successful.", category: "facts" },
  { text: "Never lose hope, keep pushing.", category: "True" },
  { text: "Key to success is education.", category: "joy" },
];

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

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

function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <small>— ${randomQuote.category}</small>
  `;

  sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
}

function addQuote(quoteText, quoteCategory) {
  if (!quoteText || !quoteCategory) {
    alert("Please fill in both fields!");
    return;
  }

  const isDuplicate = quotes.some(
    (quote) => quote.text.toLowerCase() === quoteText.toLowerCase()
  );

  if (isDuplicate) {
    alert("This quote already exists!");
    return;
  }

  quotes.push({ text: quoteText, category: quoteCategory });

  saveQuotes();

  alert("New quote added successfully!");
  showRandomQuote();
}

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
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert('Quotes imported successfully!');
    showRandomQuote();
  };
  fileReader.readAsText(event.target.files[0]);
}

function initialize() {
  showRandomQuote();
  loadLastViewedQuote();

 document.getElementById('addQuoteForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const quoteText = document.getElementById('quoteText').value.trim();
    const quoteCategory = document.getElementById('quoteCategory').value.trim();

    addQuote(quoteText, quoteCategory);
    e.target.reset();
  });

  document.getElementById('exportQuotes').addEventListener('click', exportToJsonFile);

  document.getElementById('importFile').addEventListener('change', importFromJsonFile);

  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
}

initialize();