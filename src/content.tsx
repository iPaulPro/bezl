// interface MetaTag {
//     [key: string]: string;
// }
//
// function extractMetaTags(): MetaTag {
//     const metaTags: MetaTag = {};
//
//     const metaElements = Array.from(document.getElementsByTagName('meta'));
//     metaElements.forEach((meta) => {
//         const name = meta.getAttribute('name') || meta.getAttribute('property');
//         const content = meta.getAttribute('content');
//         if (name && content) {
//             metaTags[name] = content;
//         }
//     });
//
//     return metaTags;
// }
//
// async function checkOpenGraphTags(metaTags: MetaTag) {
//     // Your code to check for Open Graph tags and perform the desired action
//     console.log('Meta Tags:', metaTags);
//     // ...
//     await chrome.action.setBadgeBackgroundColor({ color: '#00d3da' });
//     await chrome.action.setBadgeText({ text: ' ' });
//     await chrome.action.setTitle({ title: 'Frame available!' });
// }
//
// export const clearBadge = async () => {
//     await chrome.action.setBadgeText({ text: '' });
//     await chrome.action.setTitle({ title: 'Focalize' });
// }
//
// // Initial check for Open Graph tags
// const initialMetaTags = extractMetaTags();
// checkOpenGraphTags(initialMetaTags).catch(console.error);

console.log('Content script loaded...');