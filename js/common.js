;'use strict';

var app = {};

app.methods = {};

app.initialStorage = {
  fieldsets: [{
    name: 'Google',
    url: 'https://google.com/search?q="%s"'
  },{
    name: 'YouTube',
    url: 'https://youtube.com/results?search_query=%s'
  },{
    name: 'Facebook',
    url: 'https://facebook.com/search?q=%s'
  },{
    name: 'Wikipedia',
    url: 'https://wikipedia.org/wiki/%s'
  },{
    name: 'Google Maps',
    url: 'https://google.com/maps/search/%s'
  },{
    name: 'Yandex Maps',
    url: 'https://yandex.com/maps?text=%s'
  },{
    name: 'Google Images',
    url: 'https://google.com/search?q=%s&tbm=isch'
  }]
};

/**
 * @param {Object} storage
 * @param {Array}  storage.fieldsets
 */
app.methods.setContextMenuItems = function (storage) {
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
};
