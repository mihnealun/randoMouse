// Background script for mouse simulator extension

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Mouse Random extension installed');
});

// Handle messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle any background processing if needed
  return true;
});

// Handle tab updates to ensure content script is injected
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Inject content script if not already injected
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    }).catch(() => {
      // Script already injected or injection failed
    });
  }
});