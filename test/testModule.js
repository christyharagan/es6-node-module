'use strict';

var chai = require('chai');
chai.use(chai.should);

var NodePackage = require('../lib/nodePackage');
var path = require('path');

var es6BDir = path.join(__dirname, '/projects/es6B');
var modulePath = './lib/main.js';

function buildModule() {
  var nodePackage = new NodePackage(es6BDir);
  return nodePackage.getModule(modulePath);
}

describe('module', function () {
  it('should compile the module to es5 code', function () {
    var mod = buildModule();

    var cjsString = mod.toCJSString();
    cjsString.should.equal(
      '"use strict";\n' +
      'var $$sub$util$$ = require("./sub/util");\n' +
      '\'use strict\';\n' +
      '\n' +
      'var monkey = require(\'cjsB/lib/monkey\');\n' +
      '\n' +
      'monkey();');
  });
  it('should fetch the dependencies of the module and compile those to es5 code', function () {
    var mod = buildModule();

    var dependencies = mod.getDependencies();
    dependencies.should.have.length(1);

    var cjsString = dependencies[0].toCJSString();
    cjsString.should.equal(
      '"use strict";\n' +
      'var es6A$lib$foo$$ = require("es6A/lib/foo");\n' +
      '\'use strict\';\n' +
      '\n' +
      'es6A$lib$foo$$.default();'
    );
  });
});
