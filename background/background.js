// Initialize extension
chrome.runtime.onInstalled.addListener(async () => {
  console.log('Trade Call Widget installed/updated');
  await chrome.sidePanel.setOptions({
    enabled: true,
    path: 'popup.html'
  });
});

// Listen for extension icon clicks
chrome.action.onClicked.addListener(async (tab) => {
  console.log('Extension icon clicked'); // Log when the icon is clicked
  try {
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    console.log('Side panel behavior set successfully');
  } catch (error) {
    console.error('Error setting side panel behavior:', error);
  }
});



// Optional: Debug logging in development
if (process.env.NODE_ENV === 'development') {
  chrome.storage.local.onChanged.addListener((changes, namespace) => {
    console.log('Storage changes:', changes);
  });
}