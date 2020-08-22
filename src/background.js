chrome.runtime.onInstalled.addListener(() => {

  console.log('My browser extension successfully loaded!');
  chrome.storage.sync.getBytesInUse((result) => {
    console.log(result);
  });

});

chrome.storage.onChanged.addListener((changes, areaName) => {
  console.log(changes, areaName);
})