'use strict';
const assert = require('assert');
const path = require('path');
let parser = require('../parser.js');
let conf = require('../arc_config.js');

describe('parser.js', function () {
  conf.rootCmd = 'arc-tool';
  beforeEach(function () {
    parser.argv = { _: [], _args: [], _cmds: [], _next: true, _err: '', _descFilePath: __dirname, _help: false, _mappingValue: {}, _parsedValue: {}, _inputCmd: '' };
    parser.argv._descFilePath = path.join(parser.argv._descFilePath, '../cmds/meta/arc-tool/test');
  });
  it('function cmdParser()', function () {
    parser.parser(['parser']);
    assert.ok(!parser.argv._help);
    assert.deepStrictEqual(parser.argv._cmds, ['parser']);
    assert.strictEqual(parser.argv._descFilePath, path.join(__dirname, '../cmds/meta/arc-tool/test/parser.js'));
    assert.deepStrictEqual(parser.argv._args, []);
  });
  it('help command check', function () {
    parser.parser(['parser', 'help']);
    assert.ok(parser.argv._help);
    assert.deepStrictEqual(parser.argv._cmds, ['parser']);
    assert.strictEqual(parser.argv._descFilePath, path.join(__dirname, '../cmds/meta/arc-tool/test/parser.js'));
    assert.deepStrictEqual(parser.argv._args, ['help']);
  });
  it('function argsParse()', function () {
    parser.parser(['parser', 'args1', 'args2', '--flag']);
    assert.deepStrictEqual(parser.argv._cmds, ['parser']);
    assert.deepStrictEqual(parser.argv._, ['args1', 'args2']);
    assert.deepStrictEqual(parser.argv._args, ['--flag']);
  });
  it('function transOpts()', function () {
    let options = {
      requiredFlag: {
        required: true,
        desc: {
          zh: '必填选项'
        }
      },
      optionalFlag: {},
      conflictFlag1: {
        conflict: [
          'conflictFlag2'
        ]
      },
      conflictFlag2: {
        conflict: [
          'conflictFlag1'
        ]
      },
      mainFlag: {},
      dependentFlag: {
        dependency: true
      }
    };
    let opts = parser.transOpts(options);
    let expect = {
      _optional: [
        'optionalFlag',
        'conflictFlag1',
        'conflictFlag2',
        'mainFlag'
      ],
      _required: [
        'requiredFlag'
      ],
      _transed: [
        'requiredFlag',
        'optionalFlag',
        'conflictFlag1',
        'conflictFlag2',
        'mainFlag',
        'dependentFlag'
      ],
      _unchanged: [],
      requiredFlag: {
        name: 'requiredFlag',
        required: true,
        desc: {
          zh: '必填选项'
        }
      },
      optionalFlag: {
        name: 'optionalFlag'
      },
      conflictFlag1: {
        name: 'conflictFlag1',
        conflict: [
          'conflictFlag2'
        ]
      },
      conflictFlag2: {
        name: 'conflictFlag2',
        conflict: [
          'conflictFlag1'
        ]
      },
      mainFlag: {
        name: 'mainFlag',
      },
      dependentFlag: {
        name: 'dependentFlag',
        dependency: true
      }
    };
    assert.deepStrictEqual(opts, expect);
  });
  it('Mandatory check for options', function () {
    parser.parser(['parser', '--flag1', 'value1']);
    assert.strictEqual(parser.argv._err, '缺少必选参数：conflictFlag2|conflictFlag1');
  });
  it('Mandatory check for conflict options', function () {
    parser.parser(['parser']);
    assert.strictEqual(parser.argv._err, '缺少必选参数：flag1');
  });
  it('function flagsParser()', function () {
    parser.parser(['parser', '--flag1', 'value1', '--flag2', '3', '--flag3']);
    assert.deepStrictEqual(parser.argv._cmds, ['parser']);
    assert.deepStrictEqual(parser.argv._parsedValue, { 'flag1': 'value1', 'flag2': 3, 'flag3': true });
  });
  it('global option parse', function () {
    parser.parser(['parser', '--flag1', 'value1', '--flag2', '3', '--flag3', '--profile', 'test', '--region', 'cn-hangzhou']);
    assert.deepStrictEqual(parser.argv._cmds, ['parser']);
    assert.deepStrictEqual(parser.argv._parsedValue, { 'flag1': 'value1', 'flag2': 3, 'flag3': true, 'profile': 'test', 'region': 'cn-hangzhou' });
  });
  // TODO
  // 校验不完整，optionsValidate函数只能检查必选参数冲突。
  it('Option conflict check', function () {
    parser.parser(['parser', '--flag1', 'value1', '--conflictFlag1', 'value1', '--conflictFlag2', 'value2']);
    assert.strictEqual(parser.argv._err, '选项冲突，conflictFlag2,conflictFlag1 只能选择其中一个');
  });
});