;'use strict';

/* global app, chrome */

/**
 * @property chrome.contextMenus
 * @property chrome.contextMenus.onClicked
 * @property chrome.runtime
 * @property chrome.runtime.onInstalled
 * @property chrome.storage
 * @property chrome.storage.sync
 */

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.get(null, function (storage) {
    if (!storage.fieldsets) {
      chrome.storage.sync.set(app.initialStorage, function () {
        app.methods.setContextMenuItems(app.initialStorage);
      });
    } else {
      app.methods.setContextMenuItems(storage);
    }
  });
});

/**
 * @param {Object} info
 * @param {String} info.menuItemId
 * @param {String} info.selectionText
 */
function onClickHandler(info) {
  chrome.storage.sync.get(null, function (storage) {
    var url = storage.fieldsets[info.menuItemId].url;
    window.open(url.replace('%s', info.selectionText));
  });
}

chrome.contextMenus.onClicked.addListener(onClickHandler);
