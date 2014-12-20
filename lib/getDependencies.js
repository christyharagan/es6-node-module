'use strict';

module.exports = function (includeSeed, shallow, modules) {
  var seenModules = {};
  var dependencies = [];

  function getDependencies(module) {
    var depsForModule = module.getDependencies();
    depsForModule.forEach(function (dependency) {
      if (!seenModules[dependency.fullPath]) {
        dependencies.push(dependency);
        seenModules[dependency.fullPath] = true;

        if (!shallow) {
          getDependencies(dependency);
        }
      }
    });
  }

  if (!Array.isArray(modules)) {
    modules = [modules];
  }

  modules.forEach(function (module) {
    if (!seenModules[module.fullPath]) {
      if (includeSeed) {
        dependencies.push(module);
        seenModules[module.fullPath] = true;
      }

      getDependencies(module);
    }
  });

  return dependencies;
};
