// Function to extract domain from URL
function extractDomain(urlString) {
  try {
    const url = new URL(urlString);

    // Handle different cases
    let domain = url.hostname;
    if (domain.startsWith('www.')) {
      domain = domain.substring(4);
    }

    return domain;
  } catch (error) {
    console.error('Invalid URL:', urlString, error);
    return null;
  }
}

// Function to show messages
function showMessage(message, type = 'success') {
  const messageElement = document.getElementById('message');
  messageElement.textContent = message;
  messageElement.className = `message ${type}`;
  messageElement.style.display = 'block';

  // Auto-hide after 3 seconds
  setTimeout(() => {
    messageElement.style.display = 'none';
  }, 3000);
}

// Function to save domain to Vercel
async function saveDomain(domain) {
  const saveButton = document.getElementById('save-button');
  const originalText = saveButton.textContent;

  // Update UI to show loading
  saveButton.disabled = true;
  saveButton.textContent = 'Saving...';

  try {
    const response = await fetch('https://quick-listicle.vercel.app/api/sites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ domain }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      showMessage(`✅ Saved ${domain} (${data.totalSites} total sites)`, 'success');
      // Could update button text or disable it to prevent duplicates
    } else {
      showMessage(`❌ Failed to save: ${data.error || 'Unknown error'}`, 'error');
      saveButton.disabled = false;
      saveButton.textContent = originalText;
    }
  } catch (error) {
    console.error('Error saving domain:', error);
    showMessage('❌ Network error - Check your connection', 'error');
    saveButton.disabled = false;
    saveButton.textContent = originalText;
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  const domainElement = document.getElementById('current-domain');
  const saveButton = document.getElementById('save-button');

  try {
    // Get the current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.url) {
      domainElement.textContent = 'No URL found';
      showMessage('❌ Cannot save - no URL detected', 'error');
      return;
    }

    // Extract domain from URL
    const domain = extractDomain(tab.url);

    if (!domain) {
      domainElement.textContent = 'Invalid URL';
      showMessage('❌ Cannot parse this URL', 'error');
      return;
    }

    // Display the domain
    domainElement.textContent = domain;

    // Enable the save button
    saveButton.disabled = false;

    // Add click handler
    saveButton.addEventListener('click', () => {
      saveDomain(domain);
    });

  } catch (error) {
    console.error('Error initializing popup:', error);
    domainElement.textContent = 'Error loading';
    showMessage('❌ Extension error', 'error');
  }
});
