chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'OFF',
  });
});

const azureDevOps = "https://dev.azure.com";

chrome.action.onClicked.addListener(async tab => {
  if (tab.url.startsWith(azureDevOps)) {
    // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Next state will always be the opposite
    const nextState = prevState === "ON" ? "OFF" : "ON";

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });

    // Get the Atalassian font
    var fontFile = chrome.runtime.getURL("fonts/AtlassianSans-latin.woff2");
    var fontCSS = '@font-face { font-family: "Atlassian Sans"; font-style: normal; font-weight: 100 900; font-display: swap; src: url("' + fontFile + '"); format("woff2"); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}';
    if (nextState === "ON") {
      // Inject the Atlassian Font
      await chrome.scripting.insertCSS({
        css: fontCSS,
        target: { tabId: tab.id },
      });
      // Insert the CSS file when the user turns the extension on
      await chrome.scripting.insertCSS({
        files: ["jira.css"],
        target: { tabId: tab.id },
      });
    } else if (nextState === "OFF") {
      // Remove the CSS file when the user turns the extension off
      await chrome.scripting.removeCSS({
        files: ["jira.css"],
        target: { tabId: tab.id },
      });
      // Inject the Atlassian Font
      await chrome.scripting.removeCSS({
        css: fontCSS,
        target: { tabId: tab.id },
      });
    }
  }
});