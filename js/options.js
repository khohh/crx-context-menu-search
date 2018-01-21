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

  var listOfFieldsets = document.getElementById('list-of-fieldsets');
  var fieldsetTemplate = document.getElementById('fieldset-template');
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
          listOfFieldsets.insertBefore(fieldset, fieldsetTemplate);
        }
    }
    if (document.querySelectorAll('.remove-fieldset-button').length === 1) {
      document.querySelector('.remove-fieldset-button').classList.add('hidden');
      document.querySelector('.up-down-arrow').classList.add('invisible');
    }
  });

  Sortable.create(listOfFieldsets);

  // Events

  addButton.addEventListener('click', function () {
    listOfFieldsets.insertBefore(
      fieldsetTemplate.content.cloneNode(true),
      fieldsetTemplate
    );
    document
      .querySelector('.remove-fieldset-button')
      .classList
      .remove('hidden');
    document
      .querySelector('.up-down-arrow')
      .classList
      .remove('invisible');
  });

  saveButton.addEventListener('click', function () {
    var data = {
      fieldsets: []
    };
    var fieldsets = listOfFieldsets.querySelectorAll('li');
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
        setContextMenuItems(data);
      });
    });
  });

  listOfFieldsets.addEventListener('click', function (eventObject) {
    var removeFieldSetButton = eventObject.target;
    if (removeFieldSetButton.classList.contains('remove-fieldset-button')) {
      removeFieldSetButton.parentElement.remove();
      var firstRemoveFieldsetButton =
        document.querySelector('.remove-fieldset-button');
      var firstUpDownArrow =
        document.querySelector('.up-down-arrow');
      if (document.querySelectorAll('.remove-fieldset-button').length === 1) {
        firstRemoveFieldsetButton.classList.add('hidden');
        firstUpDownArrow.classList.add('invisible');
      } else {
        firstRemoveFieldsetButton.classList.remove('hidden');
        firstUpDownArrow.classList.remove('invisible');
      }
    }
  });

  document
    .getElementById('close-button-wrapper')
    .querySelector('button')
    .addEventListener('click', function () {
      window.close();
    });

});
