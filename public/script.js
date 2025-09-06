// public/script.js

// Select all the elements we need from the DOM
const form = document.getElementById('shorten-form');
const longUrlInput = document.getElementById('long-url');
const resultSection = document.getElementById('result-section');
const shortUrlLink = document.getElementById('short-url');
const copyBtn = document.getElementById('copy-btn');

// Listen for the form submission
form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from reloading the page
    const longUrl = longUrlInput.value;

    try {
        const response = await fetch('/api/shorten', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ longUrl })
        });

        if (!response.ok) {
            throw new Error('Failed to shorten URL');
        }

        const data = await response.json();
        
        // Display the result
        displayResult(data.shortUrl);

    } catch (error) {
        console.error(error);
        alert('Error: Could not shorten URL. Please try again.');
    }
});

// Function to show the result section and populate it
function displayResult(url) {
    shortUrlLink.href = url;
    shortUrlLink.textContent = url;
    resultSection.classList.remove('hidden');
}

// "Copy to Clipboard" functionality
copyBtn.addEventListener('click', () => {
    const urlToCopy = shortUrlLink.href;

    navigator.clipboard.writeText(urlToCopy).then(() => {
        // Give the user visual feedback
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
        }, 2000); // Reset the icon after 2 seconds
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy link.');
    });
});