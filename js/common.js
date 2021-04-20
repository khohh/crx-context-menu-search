;'use strict';

var app = {};

app.methods = {};

app.initialStorage = {
  fieldsets: [{
    name: 'Google - Exact match',
    url: 'https://google.com/search?q="%s"'
  }, {
    name: 'YouTube',
    url: 'https://youtube.com/results?search_query=%s'
  }, {
    name: 'Facebook',
    url: 'https://facebook.com/search?q=%s'
  }, {
    name: 'Wikipedia',
    url: 'https://wikipedia.org/wiki/%s'
  }, {
    name: 'Google Maps',
    url: 'https://google.com/maps/search/%s'
  }, {
    name: 'Yandex Maps',
    url: 'https://yandex.com/maps?text=%s'
  }, {
    name: 'Google Images',
    url: 'https://google.com/search?q=%s&tbm=isch'
  }]
};

/**
 * @param {Array} fieldsets
 */
app.methods.setContextMenuItems = function (fieldsets) {
  for (var index in fieldsets) {
    if (fieldsets[index].name === '_separator_') {
      chrome.contextMenus.create({
        id: index,
        contexts: ['selection'],
        type: 'separator'
      });
    } else {
      chrome.contextMenus.create({
        id: index,
        title: fieldsets[index].name,
        contexts: ['selection']
      });
    }
  }
};
