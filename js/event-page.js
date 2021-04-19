;'use strict';

/* global app, chrome */

/**
 * @property chrome.contextMenus
 * @property chrome.contextMenus.onClicked
 * @property chrome.runtime
 * @property chrome.runtime.onInstalled
 * @property chrome.storage
 * @property chrome.storage.onChanged
 * @property chrome.storage.sync
 */

chrome.runtime.onInstalled.addListener(function () {
  // console.log('Installed');
  chrome.storage.sync.get(null, function (storage) {
    // console.log('Storage:', storage);
    if (!storage.fieldsets) {
      chrome.storage.sync.set(app.initialStorage);
    } else { // When the page reloads
      app.methods.setContextMenuItems(storage.fieldsets);
    }
  });
});

/**
 * @param {Object} changes
 * @param {Object} changes.fieldsets
 * @param {Array} changes.fieldsets.newValue
 */
chrome.storage.onChanged.addListener(function (changes) {
  // console.log('Storage changed:', changes);
  chrome.contextMenus.removeAll(function () {
    app.methods.setContextMenuItems(changes.fieldsets.newValue);
  });
});

/**
 * @param {Object} info
 * @param {String} info.menuItemId
 * @param {String} info.selectionText
 */
chrome.contextMenus.onClicked.addListener(function (info) {
  chrome.storage.sync.get(null, function (storage) {
    let url = storage.fieldsets[info.menuItemId].url;
    url = url.replace('&', '%26');
    url = url.replace('%s', info.selectionText);
    window.open(url);
  });
});
