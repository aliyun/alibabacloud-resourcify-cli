'use strict';
const assert = require('assert');
const path = require('path');
let parser = require('../lib/parser.js');
const util = require('util');
let { metaFilePath } = require('../lib/arc_config.js');

describe('parser.js', function () {
  let ctx = {
    rootCmdName: 'arc-tool',
    profile: {
      access_key_id: process.env.ALIBABACLOUD_ACCESS_KEY_ID || process.env.ALICLOUD_ACCESS_KEY_ID,
      access_key_secret: process.env.ALIBABACLOUD_ACCESS_KEY_SECRET || process.env.ALICLOUD_ACCESS_KEY_SECRE,
      region: 'cn-hangzhou',
      language: 'zh'
    }
  };
  beforeEach(function () {
    ctx['cmdFilePath'] = path.join(metaFilePath, 'cmds/meta/arc-tool/test');
    ctx.args = [];
  });

  it('command and help command check', function () {
    ctx.args = ['parser', 'help'];
    let parserCtx = parser.parser(ctx);
    assert.ok(parserCtx.help);
    assert.deepStrictEqual(parserCtx.cmds, ['parser']);
    assert.strictEqual(parserCtx.cmdFilePath, path.join(__dirname, '../cmds/meta/arc-tool/test/parser.js'));
    assert.deepStrictEqual(parserCtx.args, ['help']);
  });
  it('function argsParse() correct', function () {
    ctx.args = ['parser', 'args1', '--flag1', 'value1', '--conflictFlag1', 'value1'];
    let parserCtx = parser.parser(ctx);
    assert.deepStrictEqual(parserCtx.argv, ['args1']);
  });
  it('function argsParse() Error', function () {
    ctx.args = ['parser', 'args1', 'args2'];
    let parserCtx = parser.parser(ctx);
    assert.strictEqual(parserCtx.err.prompt[ctx.profile.language], `未知位置参数 '%s'，位置参数数量应为 %d`);
    assert.deepStrictEqual(parserCtx.err.values, [['args2'], 1]);
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
    ctx.args = ['parser', '--flag1', 'value1'];
    let parserCtx = parser.parser(ctx);
    assert.strictEqual(util.format(parserCtx.err.prompt[ctx.profile.language], ...parserCtx.err.values), '缺少必选参数：conflictFlag2|conflictFlag1');
  });
  it('Mandatory check for conflict options', function () {
    ctx.args = ['parser'];
    let parserCtx = parser.parser(ctx);
    assert.strictEqual(util.format(parserCtx.err.prompt[ctx.profile.language], ...parserCtx.err.values), '缺少必选参数：flag1');
  });
  it('function flagsParser()', function () {
    ctx.args = ['parser', '--flag1', 'value1', '--flag2', '3', '--flag3', '--conflictFlag1', 'value'];
    let parserCtx = parser.parser(ctx);
    assert.deepStrictEqual(parserCtx.cmds, ['parser']);
    assert.deepStrictEqual(parserCtx.parsedValue, { 'flag1': 'value1', 'flag2': 3, 'flag3': true, 'conflictFlag1': 'value' });
  });
  it('global option parse', function () {
    ctx.args = ['parser', '--flag1', 'value1', '--flag2', '3', '--flag3', '--profile', 'test', '--region', 'cn-hangzhou', '--conflictFlag1', 'value'];
    let parserCtx = parser.parser(ctx);
    assert.deepStrictEqual(parserCtx.cmds, ['parser']);
    assert.deepStrictEqual(parserCtx.parsedValue, { 'flag1': 'value1', 'flag2': 3, 'flag3': true, 'profile': 'test', 'region': 'cn-hangzhou', 'conflictFlag1': 'value' });
  });
  // TODO
  // 校验不完整，optionsValidate函数只能检查必选参数冲突。
  it('Option conflict check', function () {
    ctx.args = ['parser', '--flag1', 'value1', '--conflictFlag1', 'value1', '--conflictFlag2', 'value2'];
    let parserCtx = parser.parser(ctx);
    assert.strictEqual(parserCtx.err.prompt[ctx.profile.language], `选项冲突，%s 只能选择其中一个`);
    assert.deepStrictEqual(parserCtx.err.values, [['conflictFlag2', 'conflictFlag1']]);
  });
});