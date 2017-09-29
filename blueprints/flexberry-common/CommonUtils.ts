﻿/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/lodash/index.d.ts' />

import lodash = require('lodash');
const Blueprint = require('ember-cli/lib/models/blueprint');

export default class CommonUtils {
  static installFlexberryAddon(options, middlePaths: string[]) {
    let groupOptions = lodash.merge({}, options, { entity: { name: options.entity.name } });
    for (let middlePath of middlePaths) {
      let addonBlueprintOptions = lodash.merge({}, groupOptions, { installingAddon: true, middlePath: middlePath, originBlueprintName: middlePath });
      let flexberryAddon = Blueprint.lookup("flexberry-addon", {
        ui: undefined,
        analytics: undefined,
        project: undefined,
        paths: ["node_modules/ember-flexberry/blueprints"]
      });
      flexberryAddon["install"](addonBlueprintOptions)
    }
  }

  static getFilesForGeneration(blueprint, exclusiveFunction: Function = null) {
    blueprint._super._files = null;
    blueprint._super.path = blueprint.path;
    let files = blueprint._super.files();
    blueprint._super._files = null;
    if (exclusiveFunction!=null) {
      lodash.remove(files, exclusiveFunction);
    }
    return files;
  }
}
