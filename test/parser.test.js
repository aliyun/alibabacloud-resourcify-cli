'use strict';
const assert = require('assert');
const path = require('path');
let parser = require('../lib/parser.js');
let { metaFilePath } = require('../lib/arc_config.js');

describe('parser.js', function () {
  let ctx = {
    rootCmdName: 'arc-test',
    profile: {
      access_key_id: process.env.ALIBABACLOUD_ACCESS_KEY_ID || process.env.ALICLOUD_ACCESS_KEY_ID,
      access_key_secret: process.env.ALIBABACLOUD_ACCESS_KEY_SECRET || process.env.ALICLOUD_ACCESS_KEY_SECRE,
      region: 'cn-hangzhou',
      language: 'zh'
    }
  };
  beforeEach(function () {
    ctx['cmdFilePath'] = path.join(metaFilePath, 'test/test_cmd/test');
    ctx.args = [];
  });

  it('command and help command check', function () {
    ctx.args = ['parser', 'help'];
    let parserCtx = parser.parser(ctx);
    assert.ok(parserCtx.help);
    assert.deepStrictEqual(parserCtx.cmds, ['parser']);
    assert.strictEqual(parserCtx.cmdFilePath, path.join(__dirname, '../test/test_cmd/test/parser.js'));
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
    assert.strictEqual(parserCtx.err.prompt[ctx.profile.language], `缺少必选参数：%s`);
    assert.deepStrictEqual(parserCtx.err.values, ['conflictFlag2|conflictFlag1']);
  });

  it('Mandatory check for conflict options', function () {
    ctx.args = ['parser'];
    let parserCtx = parser.parser(ctx);
    assert.strictEqual(parserCtx.err.prompt[ctx.profile.language], `缺少必选参数：%s`);
    assert.deepStrictEqual(parserCtx.err.values, ['flag1']);
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

  // function processMap
  it('Map type option analysis: vTypeMatchErr', function () {
    ctx.args = ['map', '--flag', '{"key":"key1","value":"value1"}', 'nishuode'];
    let parserCtx = parser.parser(ctx);
    assert.strictEqual(parserCtx.err.prompt[ctx.profile.language], `选项 '%s' 的输入值类型不符合`);
    assert.deepStrictEqual(parserCtx.err.values, ['flag']);
  });

  it('Map type option analysis: resolveErr', function () {
    ctx.args = ['map', '--flag', '{"ke,"value":"value1"}'];
    let parserCtx = parser.parser(ctx);
    assert.strictEqual(parserCtx.err.prompt[ctx.profile.language], `选项 '%s' 的值json解析失败: %s`);
    assert.deepStrictEqual(parserCtx.err.values, ['flag', 'Unexpected token v in JSON at position 6']);
  });

  it('Map type option analysis: shorthand grammar error', function () {
    ctx.args = ['map', '--flag', 'key=key1,value'];
    let parserCtx = parser.parser(ctx);
    assert.strictEqual(parserCtx.err.prompt[ctx.profile.language], `选项 '%s' 的输入值类型不符合`);
    assert.deepStrictEqual(parserCtx.err.values, ['flag']);
  });

  it('Map type option analysis: shorthand grammar', function () {
    ctx.args = ['map', '--flag', 'key=key1,value=value1'];
    let parserCtx = parser.parser(ctx);
    assert.deepStrictEqual(parserCtx.parsedValue, { 'flag': { 'key': 'key1', 'value': 'value1' } });
  });

  it('Map type option analysis: json', function () {
    ctx.args = ['map', '--flag', '{"key":"key1","value":"value1"}'];
    let parserCtx = parser.parser(ctx);
    assert.deepStrictEqual(parserCtx.parsedValue, { 'flag': { 'key': 'key1', 'value': 'value1' } });
  });

  // function processArray
  it('Array type option analysis: vTypeMatchErr: length==0', function () {
    ctx.args = ['array', '--flag'];
    let parserCtx = parser.parser(ctx);
    assert.strictEqual(parserCtx.err.prompt[ctx.profile.language], `选项 '%s' 的输入值类型不符合`);
    assert.deepStrictEqual(parserCtx.err.values, ['flag']);
  });

  it('Array type option analysis: mixInputErr', function () {
    ctx.args = ['array', '--flag', '[value1]', 'test'];
    let parserCtx = parser.parser(ctx);
    assert.strictEqual(parserCtx.err.prompt[ctx.profile.language], `选项 '%s' 混合输入无法被识别`);
    assert.deepStrictEqual(parserCtx.err.values, ['flag']);
  });

  it('Array type option analysis: json error', function () {
    ctx.args = ['array', '--flag', '[value1,value2]'];
    let parserCtx = parser.parser(ctx);
    assert.strictEqual(parserCtx.err.prompt[ctx.profile.language], `选项 '%s' 的值json解析失败: %s`);
    assert.deepStrictEqual(parserCtx.err.values, ['flag', 'Unexpected token v in JSON at position 1']);
  });

  it('string array type option analysis: shorthand grammar', function () {
    ctx.args = ['array', '--flag', 'value1', 'value2'];
    let parserCtx = parser.parser(ctx);
    assert.deepStrictEqual(parserCtx.parsedValue, { 'flag': ['value1', 'value2'] });
  });

  it('string array type option analysis: json', function () {
    ctx.args = ['array', '--flag', '["value1","value2"]'];
    let parserCtx = parser.parser(ctx);
    assert.deepStrictEqual(parserCtx.parsedValue, { 'flag': ['value1', 'value2'] });
  });

  it('number array type option analysis: vTypeMatchErr', function () {
    ctx.args = ['array', '--number-flag', '["asdf"]'];
    let parserCtx = parser.parser(ctx);
    assert.strictEqual(parserCtx.err.prompt[ctx.profile.language], `选项 '%s' 的输入值类型不符合`);
    assert.deepStrictEqual(parserCtx.err.values, ['number-flag']);
  });

  it('number array type option analysis: json', function () {
    ctx.args = ['array', '--number-flag', '[1,2]'];
    let parserCtx = parser.parser(ctx);
    assert.deepStrictEqual(parserCtx.parsedValue, { 'number-flag': [1, 2] });
  });

  it('number array type option analysis: maxIndex error', function () {
    ctx.args = ['array', '--number-flag', '[1,2,3,4]'];
    let parserCtx = parser.parser(ctx);
    assert.strictEqual(parserCtx.err.prompt[ctx.profile.language], `选项 '%s' 的输入值元素过多，最长支持元素数量：%d`);
    assert.deepStrictEqual(parserCtx.err.values, ['number-flag', 3]);
  });

  it('map array type option analysis: shorthand grammar', function () {
    ctx.args = ['array', '--map-flag', 'key=key1,value=value1', 'key=key2,value=value2'];
    let parserCtx = parser.parser(ctx);
    assert.deepStrictEqual(parserCtx.parsedValue, { 'map-flag': [{ 'key': 'key1', 'value': 'value1' }, { 'key': 'key2', 'value': 'value2' }] });
  });

  it('map array type option analysis: shorthand grammar', function () {
    ctx.args = ['array', '--map-flag', 'keyvaluevalue1'];
    let parserCtx = parser.parser(ctx);
    assert.strictEqual(parserCtx.err.prompt[ctx.profile.language], `选项 '%s' 的输入值类型不符合`);
    assert.deepStrictEqual(parserCtx.err.values, ['map-flag']);
  });

  // function processNumber
  it('number type option analysis: vTypeMatchErr: Multi-parameter', function () {
    ctx.args = ['normal', '--number-flag', '1', '2'];
    let parserCtx = parser.parser(ctx);
    assert.strictEqual(parserCtx.err.prompt[ctx.profile.language], `选项 '%s' 的输入值类型不符合`);
    assert.deepStrictEqual(parserCtx.err.values, ['number-flag']);
  });

  it('number type option analysis: vTypeMatchErr: isNaN', function () {
    ctx.args = ['normal', '--number-flag', 'sdf'];
    let parserCtx = parser.parser(ctx);
    assert.strictEqual(parserCtx.err.prompt[ctx.profile.language], `选项 '%s' 的输入值类型不符合`);
    assert.deepStrictEqual(parserCtx.err.values, ['number-flag']);
  });

  it('number type option analysis', function () {
    ctx.args = ['normal', '--number-flag', '1'];
    let parserCtx = parser.parser(ctx);
    assert.deepStrictEqual(parserCtx.parsedValue, { 'number-flag': 1 });
  });

  // function processBoolean
  it('boolean type option analysis: No input', function () {
    ctx.args = ['normal', '--boolean-flag'];
    let parserCtx = parser.parser(ctx);
    assert.deepStrictEqual(parserCtx.parsedValue, { 'boolean-flag': true });
  });

  it('boolean type option analysis: input true', function () {
    ctx.args = ['normal', '--boolean-flag=true'];
    let parserCtx = parser.parser(ctx);
    assert.deepStrictEqual(parserCtx.parsedValue, { 'boolean-flag': true });
  });

  it('boolean type option analysis: input false', function () {
    ctx.args = ['normal', '--boolean-flag', 'false'];
    let parserCtx = parser.parser(ctx);
    assert.deepStrictEqual(parserCtx.parsedValue, { 'boolean-flag': false });
  });

  it('boolean type option analysis: input other', function () {
    ctx.args = ['normal', '--boolean-flag', 'sdf'];
    let parserCtx = parser.parser(ctx);
    assert.strictEqual(parserCtx.err.prompt[ctx.profile.language], `选项 '%s' 的输入值类型不符合`);
    assert.deepStrictEqual(parserCtx.err.values, ['boolean-flag']);
  });

  // function processString
  it('string type option analysis: vTypeMatchErr', function () {
    ctx.args = ['normal', '--flag'];
    let parserCtx = parser.parser(ctx);
    assert.strictEqual(parserCtx.err.prompt[ctx.profile.language], `选项 '%s' 的输入值类型不符合`);
    assert.deepStrictEqual(parserCtx.err.values, ['flag']);
  });

  // function processValue
  it('unrecognized flag value type: unrecognizedVType', function () {
    ctx.args = ['normal', '--unrecognized-flag'];
    let parserCtx = parser.parser(ctx);
    assert.strictEqual(parserCtx.err.prompt[ctx.profile.language], `未识别的参数值类型`);
    assert.deepStrictEqual(parserCtx.err.values, []);
  });

  // special flag parse
  it('unchanged flag parse', function () {
    ctx.args = ['special'];
    let parserCtx = parser.parser(ctx);
    assert.deepStrictEqual(parserCtx.parsedValue, { 'unchange-flag': 'default', });
    assert.deepStrictEqual(parserCtx.mappingValue, { 'unchangedMappingFlag': 'unchange', 'RegionId': 'cn-hangzhou' });
  });

  it('mapping flag parse', function () {
    ctx.args = ['special', '--mapping-flag', 'value'];
    let parserCtx = parser.parser(ctx);
    assert.deepStrictEqual(parserCtx.parsedValue, { 'unchange-flag': 'default', 'mapping-flag': 'value' });
    assert.deepStrictEqual(parserCtx.mappingValue, { 'unchangedMappingFlag': 'unchange', 'mappingFlag': 'value', 'RegionId': 'cn-hangzhou' });
  });

  it('global flag parse', function () {
    ctx.args = ['special', '--region', 'cn-beijing'];
    let parserCtx = parser.parser(ctx);
    assert.deepStrictEqual(parserCtx.parsedValue, { 'unchange-flag': 'default', 'region': 'cn-beijing' });
    assert.deepStrictEqual(parserCtx.mappingValue, { 'unchangedMappingFlag': 'unchange', 'RegionId': 'cn-beijing' });
  });

  // function parseOne
  it('unknowSyntax error', function () {
    let result = parser.parseOne(['a']);
    assert.strictEqual(result.err.prompt[ctx.profile.language], `'%s' 是未知选项格式`);
    assert.deepStrictEqual(result.err.values, ['a']);
  });

  // TODO
  // 校验不完整，optionsValidate函数只能检查必选参数冲突。
  it('Option conflict check', function () {
    ctx.args = ['parser', '--flag1', 'value1', '--conflictFlag1', 'value1', '--conflictFlag2', 'value2'];
    let parserCtx = parser.parser(ctx);
    assert.strictEqual(parserCtx.err.prompt[ctx.profile.language], `选项冲突，%s 只能选择其中一个`);
    assert.deepStrictEqual(parserCtx.err.values, [['conflictFlag2', 'conflictFlag1']]);
  });

  it('required boolean flag check', function () {
    ctx.args = ['required', '--boolean-flag', 'false'];
    let parserCtx = parser.parser(ctx);
    assert.deepStrictEqual(parserCtx.parsedValue, { 'boolean-flag': false });
  });

  it('required boolean flag check', function () {
    ctx.args = ['required', '--boolean-flag', 'true'];
    let parserCtx = parser.parser(ctx);
    assert.deepStrictEqual(parserCtx.parsedValue, { 'boolean-flag': true });
  });
});