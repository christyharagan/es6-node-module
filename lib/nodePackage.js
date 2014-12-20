'use strict';

var transpiler = require('es6-module-transpiler');
var Container = transpiler.Container;
var NpmResolver = require('./npmResolver');
var Formatter = require('es6-module-transpiler/lib/formatters/commonjs_formatter');
var Module = require('./module');
var toPath = require('./pathUtils').toPath;
var Path = require('path');

function isString(value) {
  return Object.prototype.toString.call(value) === '[object String]';
}

function NodePackage(packageDir, resolver) {
  var resolvers = resolver ? [resolver] : [];
  //resolvers.push(new FileResolver([packageDir]));
  resolvers.push(new NpmResolver(packageDir));

  this._container = new Container({
    resolvers: resolvers,
    formatter: new Formatter()
  });
  this.packageDir = packageDir;
  this._modules = {};
}

NodePackage.prototype.getDependencies = function () {
  // TODO
};

NodePackage.prototype.getModule = function (moduleOrPath) {
  var module;
  var _module;
  var modulePath;
  if (isString(moduleOrPath)) {
    modulePath = moduleOrPath;
    module = this._modules[toPath(this.packageDir, modulePath)];
    if (module) {
      return module;
    }
    _module = this._container.getModule(modulePath);
    if (!_module) {
      return null;
    }
  } else {
    _module = moduleOrPath;
    modulePath = _module.name;
    module = this._modules[toPath(this.packageDir, modulePath)];
    if (module) {
      return module;
    }
  }

  var modulePackage;
  if (_module.isNPMResolved) {
    var resolvedPath = _module.path;
    if (resolvedPath.indexOf(this.packageDir) === 0) {
      var subPath = resolvedPath.substring(this.packageDir.length);
      var i = subPath.indexOf('node_modules');
      var subsubPath = subPath.substring(i + 13);
      var j = subsubPath.indexOf('/');
      var depPackageDir = resolvedPath.substring(0, this.packageDir.length + i + 13 + j + 1);
      modulePackage = new NodePackage(depPackageDir);

      modulePath = Path.relative(depPackageDir, resolvedPath);
    } else {
      // TODO: Support non-nested package dependencies
      throw 'Non-nested package dependencies not supported. PackageDir: ' + this.packageDir + '. Module path: ' + resolvedPath;
    }
  } else {
    modulePackage = this;
  }
  module = new Module(modulePackage, modulePath, _module);
  this._modules[module.fullPath] = module;

  return module;
};

module.exports = NodePackage;

