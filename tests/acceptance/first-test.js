import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';

moduleForAcceptance('Acceptance');

test('select lookup value', (assert) => {
  visit('components-examples/flexberry-lookup/settings-example')
  .then(() =>
    triggerEvent('.ui.purple.button', 'click')
  )
  .then(() =>
    triggerEvent($('tbody').eq(1).children().eq(0).children().eq(1), 'click')
  );

  andThen(() =>
    assert.equal($('.lookup-field.ember-view.ember-text-field').val(), 'Type #71')
  );
});
