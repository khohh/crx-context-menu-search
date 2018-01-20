;'use strict';

/* global chrome */

/**
 * @property chrome.contextMenus
 * @property chrome.contextMenus.removeAll
 * @property chrome.extension
 * @property chrome.extension.getBackgroundPage
 * @property chrome.storage
 * @property chrome.storage.sync
 */

window.addEventListener('DOMContentLoaded', function () {

  // Elements

  var form = document.getElementById('form');
  var fieldsetTemplate = document.getElementById('fieldset-template');
  var buttonsWrapper = document.getElementById('buttons-wrapper');
  var addButton = document.getElementById('add-button');
  var saveButton = document.getElementById('save-button');
  var savedNotification = document.getElementById('saved-notification');

  // Initialization

  chrome.storage.sync.get(null, function (storage) {
    if (storage.fieldsets) {
        for (var index in storage.fieldsets) {
          var fieldset = fieldsetTemplate.content.cloneNode(true);
          if (storage.fieldsets.hasOwnProperty(index)) {
            fieldset.querySelector('.name').value =
              storage.fieldsets[index].name;
            fieldset.querySelector('.url').value =
              storage.fieldsets[index].url;
          }
          form.insertBefore(fieldset, buttonsWrapper);
        }
    }
    if (document.querySelectorAll('.remove-fieldset-button').length === 1) {
      document.querySelector('.remove-fieldset-button').classList.add('hidden');
    }
  });

  // Events

  addButton.addEventListener('click', function (eventObject) {
    eventObject.preventDefault();
    form.insertBefore(fieldsetTemplate.content.cloneNode(true), buttonsWrapper);
    document
      .querySelector('.remove-fieldset-button')
      .classList
      .remove('hidden');
  });

  saveButton.addEventListener('click', function (eventObject) {
    eventObject.preventDefault();
    var data = {
      fieldsets: []
    };
    var fieldsets = document.querySelectorAll('.fieldset');
    for (var i = 0; i < fieldsets.length; i++) {
      data.fieldsets.push({
        name: fieldsets[i].querySelector('.name').value,
        url: fieldsets[i].querySelector('.url').value
      });
    }
    chrome.storage.sync.set(data, function () {
      savedNotification.classList.remove('hidden');
      setTimeout(function () {
        savedNotification.classList.add('hidden');
      }, 1000);
      chrome.contextMenus.removeAll(function () {
        // noinspection JSUnresolvedFunction
        chrome.extension.getBackgroundPage().setContextMenuItems(data);
      });
    });
  });

  form.addEventListener('click', function (eventObject) {
    var removeFieldSetButton = eventObject.target;
    if (removeFieldSetButton.classList.contains('remove-fieldset-button')) {
      removeFieldSetButton.parentElement.remove();
      var firstRemoveFieldsetButton =
        document.querySelector('.remove-fieldset-button');
      if (document.querySelectorAll('.remove-fieldset-button').length === 1) {
        firstRemoveFieldsetButton.classList.add('hidden');
      } else {
        firstRemoveFieldsetButton.classList.remove('hidden');
      }
    }
  });

});
