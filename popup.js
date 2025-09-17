// Send message to content script
async function sendToContentScript(action, data = {}) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return await chrome.tabs.sendMessage(tab.id, { action, ...data });
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
}

// Start movement
document.getElementById('startMovement').addEventListener('click', async () => {
  const result = await sendToContentScript('startMovement');
  if (result && result.success) {
    document.getElementById('stopMovement').disabled = false;
    document.getElementById('startMovement').disabled = true;
  }
});

// Stop movement
document.getElementById('stopMovement').addEventListener('click', async () => {
  const result = await sendToContentScript('stopMovement');
  if (result && result.success) {
    document.getElementById('stopMovement').disabled = true;
    document.getElementById('startMovement').disabled = false;
  }
});

// Initialize button states
document.getElementById('stopMovement').disabled = true;