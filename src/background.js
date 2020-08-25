function extractHostname(url) {
    let hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname
    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }
    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];
    return hostname;
}

function removeSiteHistory(site_url) {
    // Searches the history for the last visit time
    // TODO: Change for searching the history for all the visit time
    chrome.history.search({text: site_url}, (results) => {
        for (let result of results) {
            chrome.history.deleteUrl({url: result.url});
        }
    });
}

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

    chrome.storage.sync.getBytesInUse((result) => {
        console.log(result);
    });

    chrome.storage.sync.get('settings', (result) => {
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
        chrome.history.search({ text: extractHostname(tab.url) }, (results) => {
            chrome.browserAction.setBadgeText({ text: String(results.length), tabId: tab.id });
        });
    });
}

chrome.tabs.onHighlighted.addListener((highLightInfo) => {
    updateBadge(highLightInfo.tabIds[0]);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    updateBadge(tabId);
    chrome.storage.sync.get('site_list', (result) => {
        if (extractHostname(tab.url) in result.site_list) {
            removeSiteHistory(extractHostname(tab.url));
            updateBadge(tabId);
            console.log('History successfully re-cleared');
        }
    })
});