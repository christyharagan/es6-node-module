'use strict';

var resolve = require('resolve').sync;
var Path = require('path');
var transpiler = require('es6-module-transpiler');

var NpmResolver = function (packageDir) {
  this.packageDir = packageDir;
};

NpmResolver.prototype.resolveModule = function (importedPath, fromModule, container) {
  var baseDir = fromModule ? Path.dirname(Path.join(this.packageDir, fromModule.name)) : this.packageDir;

  if (importedPath.slice(-3).toLowerCase() !== '.js') {
    importedPath += '.js';
  }
  var resolvedPath = resolve(importedPath, {basedir: baseDir});

  if (resolvedPath) {
    if (!Path.extname(importedPath)) {
      importedPath += Path.extname(resolvedPath);
    }
    var module = new transpiler.Module(resolvedPath, importedPath, container);
    if (importedPath.charAt(0) !== '.') {
      module.isNPMResolved = true;
    }
    return module;
  } else {
    return null;
  }
};

module.exports = NpmResolver;
