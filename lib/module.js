'use strict';

var Path = require('path');
var fromPath = require('./pathUtils').fromPath;
var recast = require('es6-module-transpiler/node_modules/recast');
var Rewriter = require('es6-module-transpiler/lib/rewriter');
var transpiler = require('es6-module-transpiler');
var Formatter = require('es6-module-transpiler/lib/formatters/commonjs_formatter');

function isString(value) {
  return Object.prototype.toString.call(value) === '[object String]';
}

function ModuleWithPath(nodePackage, modulePath, srcOrModule) {
  var dirAndName = fromPath(modulePath);
  this.moduleDir = dirAndName[0];
  this.moduleName = dirAndName[1];
  this.modulePath = modulePath.replace(/\.js$/, '');
  this.nodePackage = nodePackage;

  this.fullPath = Path.join(nodePackage.packageDir, this.modulePath) + '.js';

  if (isString(srcOrModule)) {
    this.src = srcOrModule;

    this._module = new transpiler.Module(this.fullPath, this.fullPath, nodePackage._container);
    this._module.name = this.modulePath;
    this._module.src = srcOrModule;
  } else {
    this.src = srcOrModule.src;
    this._module = srcOrModule;
  }
}

ModuleWithPath.prototype.toCJSString = function (sourceMapName) {
  var formatter = new Formatter();

  if (formatter.beforeConvert) {
    formatter.beforeConvert(this._module);
  }

  var modules = [this._module];

  var rewriter = new Rewriter(formatter);
  rewriter.rewrite(modules);

  var converted = formatter.build(modules)[0];

  return recast.print(converted, {
    sourceMapName: sourceMapName
  }).code;
};

ModuleWithPath.prototype.getDependencies = function () {
  if (!this._dependencies) {
    var self = this;
    this._dependencies = this._module.imports.modules.map(function(dependency){
      dependency.name = Path.relative(self.nodePackage.packageDir, dependency.path).replace(/\.js$/, '');
      return self.nodePackage.getModule(dependency);
    });
  }
  return this._dependencies;
};

module.exports = ModuleWithPath;
