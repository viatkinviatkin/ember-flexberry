import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../../helpers/start-app';

export function executeTest(testName, callback) {
  let app;
  let store;
  let latestReceivedRecords;

  module('Acceptance | flexberry-objectlistview | ' + testName, {
    beforeEach() {
      // Start application.
      app = startApp();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      let applicationController = app.__container__.lookup('controller:application');
      applicationController.set('isInAcceptanceTestMode', true);
      store = app.__container__.lookup('service:store');
      // let originalQueryMethod = store.query;
      // store.query = function(...args) {
      //
      //   // Call original method & remember returned records.
      //   return originalQueryMethod.apply(this, args).then((records) => {
      //     latestReceivedRecords = records.toArray();
      //     return records;
      //   });
      // };
    },

    afterEach() {
      Ember.run(app, 'destroy');
    }
  });

  test(testName, (assert) => callback(store, assert, app));
};

export function openEditForm($ctrlForClick, path) {
  return new Ember.RSVP.Promise((resolve, reject) => {
    let checkIntervalId;
    let checkIntervalSucceed = false;
    let checkInterval = 500;
    let timeout = 10000;

    Ember.run(() => {
      $ctrlForClick.click();
    });

    Ember.run(() => {
      checkIntervalId = window.setInterval(() => {
        let $editForm = Ember.$('form');
        let $fields = Ember.$('.field', $editForm);
        if ($fields.length === 0) {
          // Data isn't loaded yet.
          return;
        }
        // Data is loaded.
        // Stop interval & resolve promise.
        window.clearInterval(checkIntervalId);
        checkIntervalSucceed = true;
        resolve($editForm);
      }, checkInterval);
    });

    // Set wait timeout.
    Ember.run(() => {
      window.setTimeout(() => {
        if (checkIntervalSucceed) {
          return;
        }
        // Time is out.
        // Stop intervals & reject promise.
        window.clearInterval(checkIntervalId);
        reject('editForm load operation is timed out');
      }, timeout);
    });
  });
};
