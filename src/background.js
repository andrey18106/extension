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
  chrome.storage.sync.set({'settings': settings}, () => {
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
    } else {  
      console.log(result.settings);
    }
  });

});

chrome.storage.onChanged.addListener((changes, areaName) => {
  console.log(changes, areaName);
})