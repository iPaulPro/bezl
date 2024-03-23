chrome.tabs.onUpdated.addListener(async function (_tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        await checkForFrame(tab);
    }
});
//
chrome.tabs.onActivated.addListener(function (activeInfo) {
    console.log('Tab activated...', activeInfo);
    chrome.tabs.get(activeInfo.tabId, async     function (tab) {
        if (tab) {
            await checkForFrame(tab);
        }
    });
});

chrome.windows.onFocusChanged.addListener(function () {
    console.log('Window focus changed...');
    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
        if (tabs.length > 0) {
            await checkForFrame(tabs[0]);
        }
    });
});

export const getDocument = () => document.documentElement.outerHTML;

async function checkForFrame(tab: chrome.tabs.Tab) {
    console.log('checkOpenGraphTags: tab=', tab);
    if (!tab.id) return;

    try {
        const injected = await chrome.scripting.executeScript({
            target: {tabId: tab.id},
            func: getDocument
        });
        const doc = injected[0]?.result ?? {};
        console.log('doc:', doc);
    } catch (error) {
        console.error('Error injecting script:', error);
    }
}

// function updateToolbarIcon(tabId?: number, hasOGTags: boolean) {
//     // Your code to update the toolbar icon based on hasOGTags
// }

console.log('Background script loaded...');