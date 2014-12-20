ES6 Node Module
=======

Overview
------

A meta library for describing node modules using ES6 module notation, with es6-es5 transpiler.

Resolves both local imports (modules from the same package), and npm imports (modules from node module dependencies, as
specified by the package.json).

Usage
------

Install:

```
npm install es6-node-module
```

Basic usage:

```javascript
  var NodePackage = require('es6-node-module').nodePackage;

  var nodePackage = new NodePackage('/some/node/path');
  var utilModule = nodePackage.getModule('./lib/util');
  
  // Prints the full path: /some/node/path/lib/util.js
  console.log(utilModule.fullPath);
  
  // The ES6 import/export code
  console.log(utilModule.src);
  
  // The ES5 equivalent code with commonjs require() and module.exports
  console.log(utilModule.toCJSString());
  
  utilModule.getDependencies().forEach(function(dependency){
    console.log(dependency.toCJSString());
  });
```

The retrieve recursive dependencies, use the getDependencies function:

```javascript
  var getDependencies = require('es6-node-module').getDependencies;
  
  // ... get some module a-la the example above
  var someModule;
  
  // Equivalent to someModule.getDependencies()
  var deps = getDependencies(false, true, someModule);
  
  // Equivalent to someModule.getDependencies().push(someModule)
  deps = getDependencies(true, true, someModule);
  
  // Retrieves dependencies recursively and includes the seed module(s)
  deps = getDependencies(true, false, someModule);
```
getDependencies also accepts an array of modules and includes the union of all dependencies (note: getDependencies returns
a unique list, i.e.: it never repeats modules, and handles circular dependencies).
