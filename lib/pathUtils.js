'use strict';

var path = require('path');

exports.toPath = function (packageDir, moduleDir, moduleName) {
  if (arguments.length === 2) {
    moduleName = moduleDir;
    moduleDir = '.';
  }
  if (moduleName.substring(moduleName.length - 3) !== '.js') {
    moduleName += '.js';
  }

  return path.join(packageDir, moduleDir, moduleName);
};

exports.fromPath = function (packageDir, fullPath) {
  if (arguments.length === 2 && fullPath.indexOf(packageDir) !== 0) {
    return;
  } else {
    var modulePath;
    if (arguments.length === 1) {
      modulePath = packageDir;
    } else {
      modulePath = fullPath.substring(packageDir.length);
    }
    var l = modulePath.length;
    if (modulePath.substring(l - 3) === '.js') {
      modulePath = modulePath.substring(0, l - 3);
    }

    var i = modulePath.lastIndexOf('/');
    if (i === -1) {
      return ['', modulePath];
    } else {
      return [modulePath.substring(0, i), modulePath.substring(i + 1)];
    }
  }
};
