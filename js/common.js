;'use strict';

/**
 * @param {Object} storage
 * @param {Array}  storage.fieldsets
 */
function setContextMenuItems(storage) {
  for (var index in storage.fieldsets) {
    if (
      storage.fieldsets.hasOwnProperty(index) &&
      storage.fieldsets[index].name &&
      storage.fieldsets[index].url
    ) {
      chrome.contextMenus.create({
        id: index,
        title: storage.fieldsets[index].name,
        contexts:['selection']
      });
    }
  }
}
