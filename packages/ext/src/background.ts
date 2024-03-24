import { getFrame } from "frames.js"

chrome.tabs.onUpdated.addListener(async function (_tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        await checkForFrame(tab);
    }
});
//
chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, async     function (tab) {
        if (tab) {
            await checkForFrame(tab);
        }
    });
});

chrome.windows.onFocusChanged.addListener(function () {
    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
        if (tabs.length > 0) {
            await checkForFrame(tabs[0]);
        }
    });
});

export const getDocument = () => document.head.outerHTML;

const setBadge = async () => {
    await chrome.action.setBadgeBackgroundColor({ color: '#2dec00' });
    await chrome.action.setBadgeText({ text: ' ' });
    await chrome.action.setTitle({ title: 'Frame detected!' });
}

const clearBadge = async () => {
    await chrome.action.setBadgeText({ text: '' });
    await chrome.action.setTitle({ title: 'Focalize' });
};

async function checkForFrame(tab: chrome.tabs.Tab) {
    if (!tab.id) return;

    try {
        const injected = await chrome.scripting.executeScript({
            target: {tabId: tab.id},
            func: getDocument
        });
        const doc = injected[0]?.result;
        if (!doc || !tab.url) {
            return;
        }
        const { frame } = getFrame({
            htmlString: doc,
            url: tab.url
        });
        if (frame.version) {
            console.log('checkForFrame: Found a frame for', tab.url)
            await setBadge();
        } else {
            await clearBadge();
        }

    } catch (error) {
        // console.error('checkForFrame: Error injecting script:', error);
    }
}

// function updateToolbarIcon(tabId?: number, hasOGTags: boolean) {
//     // Your code to update the toolbar icon based on hasOGTags
// }

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Message received:', message, sender);
    sendResponse('Message received');
});