import ListFormRoute from 'ember-flexberry/routes/list-form';

export default ListFormRoute.extend({
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'ApplicationUserL'
   */
  modelProjection: 'TestPolyList',

  /**
    Name of model to be used as list's records types.

    @property modelName
    @type String
    @default 'integration-examples/polymorphic-example/ember-flexberry-dummy-test-poly'
   */
  modelName: 'integration-examples/polymorphic-example/ember-flexberry-dummy-test-poly'
});
