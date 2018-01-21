;'use strict';

/* global chrome */

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
      var initialStorage = {
        fieldsets: [{
          name: 'YouTube',
          url: 'https://youtube.com/results?search_query=%s'
        }]
      };
      chrome.storage.sync.set(initialStorage, function () {
        setContextMenuItems(initialStorage);
      });
    } else {
      setContextMenuItems(storage);
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
