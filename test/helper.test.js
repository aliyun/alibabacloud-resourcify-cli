'use strict';
const assert = require('assert');
const helper = require('../lib/helper.js');
let conf = require('../lib/arc_config.js');
let parser = require('../lib/parser.js');

describe('config.js', function () {
  let ui = require('cliui')();
  beforeEach(function () {
    conf.rootCmd = 'arc-test';
    parser.argv._cmds = ['test'];
    ui.resetOutput();
  });
  it('printSyntaxWithSubCommand', function () {
    let cmdobj = {
      desc: {
        zh: '测试命令'
      },
      sub: {
        'option-type': {
          zh: '测试各个类型的参数'
        },
        'relation': {
          zh: '测试类型间关系逻辑'
        }
      }
    };
    ui = helper.printSyntaxToUi(cmdobj);
    let actual = ui.toString();
    assert.deepStrictEqual(actual, '    arc-test test [子命令]');
  });
  it('printSyntaxWithOptions', function () {
    let cmdobj = {
      desc: {
        zh: '测试命令'
      },
      options: {
        'test-flag': {}
      },
      args: [
        {
          name: 'arg1',
          required: true
        },
        {
          name: 'arg2',
        }
      ]
    };
    ui = helper.printSyntaxToUi(cmdobj);
    let actual = ui.toString();
    assert.deepStrictEqual(actual, '    arc-test test <arg1> [arg2] [选项]');
  });
  it('printSubCmd', function () {
    let sub = {
      'option-type': {
        zh: '测试各个类型的参数'
      },
      'relation': {
        zh: '测试类型间关系逻辑'
      }
    };
    ui = helper.printSubcmdToUi(sub);
    let actual = ui.toString();
    assert.strictEqual(actual, '子命令:\n' +
      '    option-type                         测试各个类型的参数\n' +
      '    relation                            测试类型间关系逻辑');
  });
  it('printDescToUi', function () {
    ui = helper.printDescToUi();
    assert.strictEqual(ui, undefined);

    ui = helper.printDescToUi({ zh: '测试信息输出' });
    let actual = ui.toString();
    assert.strictEqual(actual, `\n    测试信息输出\n`);
  });

  it('printFlags', function () {
    ui = helper.printFlagsToUi({ _transed: [] });
    assert.strictEqual(ui, undefined);

    let opts = {
      _required: [
        ['conflictFlag1', 'conflictFlag2'],
        'requiredFlag'
      ],
      _optional: [
        'optionFlag'
      ],
      _transed: [
        'optionFlag',
        'transedFlag',
      ],
      conflictFlag1: {
        vtype: 'string',
        desc: {
          zh: '冲突选项1'
        }
      },
      conflictFlag2: {
        vtype: 'number',
        desc: {
          zh: '冲突选项2'
        }
      },
      requiredFlag: {
        vtype: 'boolean',
        desc: {
          zh: '必选选项'
        }
      },
      optionFlag: {
        vtype: 'string',
        desc: {
          zh: '可选选项'
        }
      },
      transedFlag: {
        vtype: 'string',
        desc: {
          zh: '依赖选项'
        }
      }
    };
    ui = helper.printFlagsToUi(opts);
    let actual = ui.toString();
    let expect = '选项:\n' +
      '  --conflictFlag1                       [string]            冲突选项1\n' +
      '  --conflictFlag2                       [number]            冲突选项2\n' +
      '  --requiredFlag                        *[boolean]          必选选项\n' +
      '  --optionFlag                          [string]            可选选项\n' +
      '  --transedFlag                         [string]            依赖选项';
    assert.strictEqual(actual, expect);
  });
});