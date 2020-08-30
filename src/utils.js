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
    chrome.history.search({text: site_url}, results => {
        for (let result of results) {
            chrome.history.deleteUrl({url: result.url});
        }
    });
}

function siteExists(url, callback) {
    chrome.storage.sync.get('site_list', result => {
        if (result.site_list) {
            if (url in result.site_list) {
                callback(true);
            } else {
                callback(false);
            }
        }
    });
}

export { extractHostname, removeSiteHistory, siteExists };