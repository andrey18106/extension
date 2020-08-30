"use strict";

import { extractHostname, siteExists, removeSiteHistory } from '../utils.js';

function setupDefaultSettings() {
    let settings = {
        "tab-settings": {
            "adult_content": {
                "id": "adult_content_checkbox",
                "value": true
            },
            "delete_after_hiding": {
                "id": "delete_after_hiding_checkbox",
                "value": true
            },
            "hidy_by_keywords": {
                "id": "hidy_by_keywords_checkbox",
                "value": null
            }
        }
    };
    chrome.storage.sync.set({ 'settings': settings }, () => {
        console.log('Default settings successfully installed');
    });
}

chrome.runtime.onInstalled.addListener(() => {

    chrome.storage.sync.getBytesInUse(result => {
        console.log(result);
    });

    chrome.storage.sync.get('settings', result => {
        if (!('settings' in result)) {
            console.log('Settings are not installed');
            setupDefaultSettings();
        }
    });

});

chrome.storage.onChanged.addListener((changes, areaName) => {
    console.log(changes, areaName);
});

function updateBadge(tabId) {
    chrome.tabs.get(tabId, (tab) => {
        chrome.history.search({ text: extractHostname(tab.url) }, results => {
            chrome.browserAction.setBadgeText({ text: String(results.length), tabId: tab.id });
        });
    });
}

chrome.tabs.onHighlighted.addListener((highLightInfo) => {
    updateBadge(highLightInfo.tabIds[0]);
    chrome.tabs.get(highLightInfo.tabIds[0], tab => {
        siteExists(extractHostname(tab.url), result => {
            if (result) {
                removeSiteHistory(extractHostname(tab.url));
                updateBadge(highLightInfo.tabIds[0]);
            }
        });
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    updateBadge(tabId);
    siteExists(extractHostname(tab.url), result => {
        if (result) {
            removeSiteHistory(extractHostname(tab.url));
            updateBadge(tabId);
            console.log('History successfully re-cleared');
        }
    });
});