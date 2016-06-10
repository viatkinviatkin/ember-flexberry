/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';
const { getOwner } = Ember;

export default FlexberryBaseComponent.extend({
  modelController: null,

  /**
   * Route for edit form by click row
   *
   * @property editFormRoute
   * @type String
   * @default undefined
   */
  editFormRoute: undefined,

  /**
   * Service that triggers objectlistview events.
   *
   * @property objectlistviewEventsService
   * @type ObjectlistviewEvents
   */
  objectlistviewEventsService: Ember.inject.service('objectlistview-events'),

  /**
   * Flag to use creation button at toolbar.
   *
   * @property createNewButton
   * @type Boolean
   * @default false
   */
  createNewButton: false,

  /**
   * The flag to specify whether the create button is enabled.
   *
   * @property createNewButton
   * @type Boolean
   * @default true
   */
  enableCreateNewButton: true,

  /**
   * Flag to use refresh button at toolbar.
   *
   * @property refreshButton
   * @type Boolean
   * @default false
   */
  refreshButton: false,

  /**
   * Flag to use delete button at toolbar.
   *
   * @property deleteButton
   * @type Boolean
   * @default false
   */
  deleteButton: false,

  /**
   * Flag to use colsConfigButton button at toolbar.
   *
   * @property colsConfigButton
   * @type Boolean
   * @default false
   */
  colsConfigButton: true,

  /**
   * Flag to use filter button at toolbar.
   *
   * @property filterButton
   * @type Boolean
   * @default false
   */
  filterButton: false,

  /**
   * Used to specify default 'filter by any match' field text.
   *
   * @property filterText
   * @type String
   * @default null
   */
  filterText: null,

  /**
   * The flag to specify whether the delete button is enabled.
   *
   * @property deleteButton
   * @type Boolean
   * @default true
   */
  enableDeleteButton: true,

  /**
   * Name of action to send out, action triggered by click on user button.
   *
   * @property customButtonAction
   * @type String
   * @default 'customButtonAction'
   */
  customButtonAction: 'customButtonAction',

  /**
   * Handler to get custom buttons from controller.
   * It has to be closure event and return array of special structures [{ buttonName: ..., buttonAction: ..., buttonClasses: ... }, {...}, ...].
   *
   * @property customButtonsClosureEvent
   * @type Function
   * @default undefined
   */
  customButtonsClosureEvent: undefined,

  /**
   * Array of custom buttons.
   *
   * @property customButtonsArray
   * @type Array
   * @default undefined
   */
  customButtonsArray: undefined,

  listUserSettings: undefined,

  colsSettingsItems: [],

  init: function() {
    this._super(...arguments);

    var componentName = this.get('componentName');
    if (this.get('deleteButton') === true && !componentName) {
      throw new Error('Name of flexberry-objectlictview component was not defined.');
    }

    this.get('objectlistviewEventsService').on('olvRowSelected', this, this._rowSelected);
    this.get('objectlistviewEventsService').on('olvRowsDeleted', this, this._rowsDeleted);

    let customButton = this.get('customButtonsClosureEvent');
    if (customButton && typeof (customButton) === 'function') {
      let customButtonsResult = customButton();
      this.set('customButtonsArray', customButtonsResult);
    }

    this.listUserSettings = this.modelController.model.listUserSettings;
    if (this.listUserSettings && 'DEFAULT' in this.listUserSettings) {
      delete this.listUserSettings.DEFAULT;
    }

    let listNamedSettings = [];
    if (this.listUserSettings) {
      for (let nameSetting in this.listUserSettings) {
        listNamedSettings[listNamedSettings.length] = nameSetting;
      }
    }

    this.colsSettingsItems = [{
      icon: 'dropdown icon',
      iconAlignment: 'right',
      title: '',
      items: [{
        icon: 'table icon',
        iconAlignment: 'left',
        title: 'Создать настройку'
      }]
    }];
    let items = this.colsSettingsItems[0].items;
    if (listNamedSettings.length > 0) {
      let menus = [
        { name: 'use', title: 'Применить', icon: 'checkmark box' },
        { name: 'edit', title: 'Редактировать', icon: 'setting' },
        { name: 'remove', title: 'Удалить', icon: 'remove' }
      ];
      for (let menu in menus) {
        let submenu = { icon: 'angle right icon', iconAlignment: 'right', title: menus[menu].title, items: [] };
        let icon = menus[menu].icon + ' icon';
        for (let i = 0; i < listNamedSettings.length; i++) {
          let subSubmenu = { title: listNamedSettings[i], icon: icon, iconAlignment: 'left' };
          submenu.items[submenu.items.length] = subSubmenu;
        }

        items[items.length] = submenu;
      }
    }

    items[items.length] = {
        icon: 'remove circle icon',
        iconAlignment: 'left',
        title: 'Сбросить настройку'
      };
  },

  /**
   * Implementation of component's teardown.
   *
   * @method willDestroy
   */
  willDestroy() {
    this.get('objectlistviewEventsService').off('olvRowSelected', this, this._rowSelected);
    this.get('objectlistviewEventsService').off('olvRowsDeleted', this, this._rowsDeleted);
    this._super(...arguments);
  },

  actions: {
    refresh: function() {
      this.get('modelController').send('refreshList');
    },
    createNew: function() {
      let editFormRoute = this.get('editFormRoute');
      let modelController = this.get('modelController');
      modelController.transitionToRoute(editFormRoute + '.new');
    },

    /**
     * Delete selected rows.
     *
     * @method delete
     */
    delete: function() {
      var componentName = this.get('componentName');
      this.get('objectlistviewEventsService').deleteRowsTrigger(componentName, true);
    },

    /**
     * Filters the content by "Filter by any match" field value.
     *
     * @method filterByAnyMatch
     */
    filterByAnyMatch: function() {
      var componentName = this.get('componentName');
      this.get('objectlistviewEventsService').filterByAnyMatchTrigger(componentName, this.get('filterByAnyMatchText'));
    },

    /**
     * Remove filter from url.
     *
     * @method removeFilter
     * @public
     */
    removeFilter: function() {
      this.set('filterText', null);
    },

    customButtonAction: function(actionName) {
      this.sendAction('customButtonAction', actionName);
    },

    showConfigDialog: function(namedSeting) {
      this.get('modelController').send('showConfigDialog', namedSeting);
    },

    onMenuItemClick: function (e) {
      let iTags = Ember.$(e.currentTarget).find('I');
      let namedSetingSpans = Ember.$(e.currentTarget).find('SPAN');
      if (iTags.length <= 0 || namedSetingSpans.length <= 0) {
        return;
      }

      this._router = getOwner(this).lookup('router:main');
      let className = iTags.get(0).className;
      let namedSeting = namedSetingSpans.get(0).innerText;
      let moduleName  =   this._router.currentRouteName;
      switch (className) {
        case 'table icon':
          this.send('showConfigDialog');
          break;
        case 'checkmark box icon':

          //TODO move this code and  _getSavePromise@addon/components/colsconfig-dialog-content.js to addon/components/colsconfig-dialog-content.js
          let colsConfig = this.listUserSettings[namedSeting];
          let savePromise = this.currentController.get('_userSettingsService').
            saveUserSetting({ moduleName: moduleName, settingName: 'DEFAULT', userSetting: colsConfig }); //save as DEFAULT
          savePromise.then(
            record => {
              if (this._router.location.location.href.indexOf('sort=') >= 0) { // sort parameter exist in URL (ugly - TODO find sort in query parameters)
                this._router.router.transitionTo(this._router.currentRouteName, { queryParams: { sort: null } }); // Show page without sort parameters
              } else {
                this._router.router.refresh();  //Reload current page and records (model) list
              }
            }
          );
          break;
        case 'setting icon':
          this.send('showConfigDialog', namedSeting);
          break;
        case 'remove icon':
          this.currentController.get('_userSettingsService').
          deleteUserSetting({ moduleName: moduleName, settingName: namedSeting }).then(
            result => {
              alert('Настройка ' + namedSeting + ' удалена');
            }
          );
          break;
        case 'remove circle icon':
          this.currentController.get('_userSettingsService').
          deleteUserSetting({ moduleName: moduleName, settingName: 'DEFAULT' }).then(
            record => {
              if (this._router.location.location.href.indexOf('sort=') >= 0) { // sort parameter exist in URL (ugly - TODO find sort in query parameters)
                this._router.router.transitionTo(this._router.currentRouteName, { queryParams: { sort: null } }); // Show page without sort parameters
              } else {
                this._router.router.refresh();  //Reload current page and records (model) list
              }
            }
          );
          break;
      }
    }

  },

  _addNamedSetting: function(name) {
    let items = this.colsSettingsItems[0].items;
    for (let i = 0; i <= items.length; i++) {
      if ('items' in items[i] &&  Ember.isArray(items[i].items)) {
        alert(items[i].title);
      }
    }
  },

  /**
   * Flag shows enable-state of delete button.
   * If there are selected rows button is enabled. Otherwise - not.
   *
   * @property isDeleteButtonEnabled
   * @type Boolean
   * @default false
   */
  isDeleteButtonEnabled: false,

  /**
   * Stores the text from "Filter by any match" input field.
   *
   * @property filterByAnyMatchText
   * @type String
   * @default null
   */
  filterByAnyMatchText: Ember.computed.oneWay('filterText'),

  /**
   * Event handler for "row has been selected" event in objectlistview.
   *
   * @method _rowSelected
   * @private
   *
   * @param {String} componentName The name of objectlistview component.
   * @param {Model} record The model corresponding to selected row in objectlistview.
   * @param {Integer} count Count of selected rows in objectlistview.
   */
  _rowSelected: function(componentName, record, count) {
    if (componentName === this.get('componentName')) {
      this.set('isDeleteButtonEnabled', count > 0 && this.get('enableDeleteButton'));
    }
  }
});
