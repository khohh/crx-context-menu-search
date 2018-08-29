;'use strict';

/* global app, chrome */

/**
 * @property chrome.contextMenus
 * @property chrome.contextMenus.removeAll
 * @property chrome.downloads
 * @property chrome.downloads.download
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
  var sortAlphabeticallyButton = document.getElementById('sort-alphabetically-button');
  var listOfExamples = document.getElementById('list-of-examples');

  // Initialization

  chrome.storage.sync.get(null, function (storage) {

    setFieldsets(storage.fieldsets);

    if (document.querySelectorAll('.remove-fieldset-button').length === 1) {
      document.querySelector('.remove-fieldset-button').classList.add('hidden');
      document.querySelector('.up-down-arrow').classList.add('invisible');
    }

  });

  function setFieldsets(fieldsets) {

    if (!fieldsets) {
      return;
    }

    // Remove old fieldsets

    var oldFieldsets = listOfFieldsets.querySelectorAll('li');
    for (var i = 0; i < oldFieldsets.length; i++) {
      oldFieldsets[i].remove();
    }

    // Add new fieldsets

    for (var index in fieldsets) {
      var fieldset = fieldsetTemplate.content.cloneNode(true);
      if (fieldsets.hasOwnProperty(index)) {
        fieldset.querySelector('.name').value = fieldsets[index].name;
        fieldset.querySelector('.url').value = fieldsets[index].url;
      }
      listOfFieldsets.appendChild(fieldset);
    }

  }

  Sortable.create(listOfFieldsets, {
    filter: '.name, .url, .remove-fieldset-button',
    preventOnFilter: false
  });

  // Initialization - Examples

  (function () {
    for (var index in app.initialStorage.fieldsets) {

      var nameInput = document.createElement('input');
      nameInput.disabled = true;
      nameInput.className = 'name';
      nameInput.value = app.initialStorage.fieldsets[index].name;

      var urlInput = document.createElement('input');
      urlInput.disabled = true;
      urlInput.className = 'url';
      urlInput.value = app.initialStorage.fieldsets[index].url;

      var li = document.createElement('li');
      li.appendChild(nameInput);
      li.appendChild(urlInput);

      listOfExamples.appendChild(li);

    }
  })();

  // Events

  // Events - Add fieldset

  addButton.addEventListener('click', function () {

    listOfFieldsets.appendChild(fieldsetTemplate.content.cloneNode(true));

    document
      .querySelector('.remove-fieldset-button')
      .classList
      .remove('hidden');
    document
      .querySelector('.up-down-arrow')
      .classList
      .remove('invisible');

  });

  // Events - Save fieldsets

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
    });

  });

  // Events - Remove fieldset

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

  // Events - Sort alphabetically

  sortAlphabeticallyButton.addEventListener('click', function () {

    var fieldsets = listOfFieldsets.querySelectorAll('li');

    var unorderedFieldsets = {};

    for (var i = 0; i < fieldsets.length; i++) {
      unorderedFieldsets[
        fieldsets[i].querySelector('.name').value
      ] = fieldsets[i];
    }

    var orderedFieldsets = {};

    Object.keys(unorderedFieldsets).sort().forEach(function(key) {
      orderedFieldsets[key] = unorderedFieldsets[key];
    });

    listOfFieldsets.innerHTML = '';

    for (var name in orderedFieldsets) {
      listOfFieldsets.appendChild(orderedFieldsets[name]);
    }

  });

  // Events - Export

  /**
   * @see https://stackoverflow.com/a/23167789/4223982
   */
  document
    .getElementById('export-button')
    .addEventListener('click', function () {
      chrome.storage.sync.get(null, function (storage) {
        var result = JSON.stringify(storage);
        var url = 'data:application/json;base64,' + btoa(result);
        chrome.downloads.download({
          url: url,
          filename: 'context-menu-search.json'
        });
      });
    });

  // Events - Import

  /**
   * @see https://stackoverflow.com/a/36930012/4223982
   */
  document
    .getElementById('import-button')
    .addEventListener('click', function () {

      var fileChooser = document.createElement('input');
      fileChooser.type = 'file';

      fileChooser.addEventListener('change', function () {
        var file = fileChooser.files[0];
        var reader = new FileReader();
        reader.onload = function () {
          var storage = JSON.parse(reader.result);
          setFieldsets(storage.fieldsets);
          saveButton.click();
        };
        reader.readAsText(file);
        // Resets the input so we do get a `change` event,
        // even if the user chooses the same file
        form.reset();
      });

      var form = document.createElement('form');
      form.appendChild(fileChooser);

      fileChooser.click();

    });

  // Events - Close option window

  document
    .getElementById('close-button-wrapper')
    .querySelector('button')
    .addEventListener('click', function () {
      window.close();
    });

});
