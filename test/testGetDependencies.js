'use strict';

var chai = require('chai');
chai.use(chai.should);

var NodePackage = require('../lib/nodePackage');
var path = require('path');
var getDependencies = require('../lib/getDependencies');

var es6BDir = path.join(__dirname, '/projects/es6B');
var modulePath = './lib/main.js';

function buildModule() {
  var nodePackage = new NodePackage(es6BDir);
  return nodePackage.getModule(modulePath);
}

describe('module', function () {
  it('should fetch the immediate dependencies of the module', function () {
    var mod = buildModule();

    var deps = getDependencies(false, true, [mod]);

    deps.should.have.length(1);

    deps[0].src.should.equal('\'use strict\';\r\n\r\nimport foo from \'es6A/lib/foo\';\r\n\r\nfoo();\r\n');
  });
  it('should fetch the immediate dependencies of the module and include the module itself', function () {
    var mod = buildModule();

    var deps = getDependencies(true, true, [mod]);

    deps.should.have.length(2);

    deps[0].src.should.equal('\'use strict\';\r\n\r\nvar monkey = require(\'cjsB/lib/monkey\');\r\nimport \'./sub/util\';\r\n\r\nmonkey();\r\n');
    deps[1].src.should.equal('\'use strict\';\r\n\r\nimport foo from \'es6A/lib/foo\';\r\n\r\nfoo();\r\n');
  });
  it('should recursively fetch all the dependencies of the module', function () {
    var mod = buildModule();

    var deps = getDependencies(false, false, [mod]);

    deps.should.have.length(2);

    deps[0].src.should.equal('\'use strict\';\r\n\r\nimport foo from \'es6A/lib/foo\';\r\n\r\nfoo();\r\n');
    deps[1].src.should.equal('\'use strict\';\r\n\r\nexport default function() {\r\n  return \'hello\';\r\n};\r\n');
  });
  it('should recursively fetch all the dependencies of the module and include the module itself', function () {
    var mod = buildModule();

    var deps = getDependencies(true, false, [mod]);

    deps.should.have.length(3);

    deps[0].src.should.equal('\'use strict\';\r\n\r\nvar monkey = require(\'cjsB/lib/monkey\');\r\nimport \'./sub/util\';\r\n\r\nmonkey();\r\n');
    deps[1].src.should.equal('\'use strict\';\r\n\r\nimport foo from \'es6A/lib/foo\';\r\n\r\nfoo();\r\n');
    deps[2].src.should.equal('\'use strict\';\r\n\r\nexport default function() {\r\n  return \'hello\';\r\n};\r\n');
  });
});

