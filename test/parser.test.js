'use strict';
const assert = require('assert');
const path = require('path');
const i18n = require('../lib/i18n.js');
let Parse = require('../lib/parser.js');
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

  it('argv parse correct', function () {
    ctx.args = ['argv', '--option', 'value'];
    let parser = new Parse(ctx);
    let argvCtx = parser.argvParse(ctx.args);
    assert.deepStrictEqual(argvCtx.argv, ['argv']);
    assert.deepStrictEqual(argvCtx.args, ['--option', 'value']);
  });

  it('empty argv parse', function () {
    ctx.args = ['--option', 'value'];
    let parser = new Parse(ctx);
    let argvCtx = parser.argvParse(ctx.args);
    assert.deepStrictEqual(argvCtx.argv, []);
    assert.deepStrictEqual(argvCtx.args, ['--option', 'value']);

    ctx.args = [];
    argvCtx = parser.argvParse(ctx.args);
    assert.deepStrictEqual(argvCtx.argv, []);
    assert.deepStrictEqual(argvCtx.args, []);

    ctx.args = ['argv1', 'argv2'];
    argvCtx = parser.argvParse(ctx.args);
    assert.deepStrictEqual(argvCtx.argv, ['argv1', 'argv2']);
    assert.deepStrictEqual(argvCtx.args, []);
  });

  it('addAlias()', function () {
    let options = {
      region: {
        vtype: 'map',
        alias: 'r',
        options: {
          key: {
            alias: 'k'
          },
          value: {}
        }
      },
      key: {
      }
    };
    let parser = new Parse(ctx);
    let opts = parser.addAlias(options);
    let expectOpts = {
      region: {
        vtype: 'map',
        alias: 'r',
        options: {
          key: {
            alias: 'k'
          },
          value: {},
          k: 'key'
        }
      },
      'r': 'region',
      key: {
      }
    };
    assert.deepStrictEqual(opts, expectOpts);
    opts = parser.addAlias({ key: { alias: 'k' } }, opts);
    expectOpts = {
      region: {
        vtype: 'map',
        alias: 'r',
        options: {
          key: {
            alias: 'k'
          },
          value: {},
          k: 'key'
        }
      },
      'r': 'region',
      key: {},
      k: 'key'
    };
    assert.deepStrictEqual(opts, expectOpts);
  });

  it('processString()', function () {
    let parser = new Parse(ctx);
    let result;
    result = parser.processString([]);
    assert.deepStrictEqual(result, { err: { prompt: i18n.vTypeMatchErr, values: [] } });

    result = parser.processString(['value1', 'value2']);
    assert.deepStrictEqual(result, { err: { prompt: i18n.vTypeMatchErr, values: [] } });

    result = parser.processString(['value1']);
    assert.deepStrictEqual(result, { value: 'value1' });
  });

  it('processBoolean()', function () {
    let parser = new Parse(ctx);
    let result;
    result = parser.processBoolean([]);
    assert.deepStrictEqual(result, { value: true });

    result = parser.processBoolean(['value1', 'value2']);
    assert.deepStrictEqual(result, { err: { prompt: i18n.vTypeMatchErr, values: [] } });

    result = parser.processBoolean(['value1']);
    assert.deepStrictEqual(result, { err: { prompt: i18n.vTypeMatchErr, values: [] } });

    result = parser.processBoolean(['true']);
    assert.deepStrictEqual(result, { value: true });

    result = parser.processBoolean(['false']);
    assert.deepStrictEqual(result, { value: false });
  });

  it('processNumber()', function () {
    let parser = new Parse(ctx);
    let result;
    result = parser.processNumber([]);
    assert.deepStrictEqual(result, { err: { prompt: i18n.vTypeMatchErr, values: [] } });

    result = parser.processNumber(['1', '2']);
    assert.deepStrictEqual(result, { err: { prompt: i18n.vTypeMatchErr, values: [] } });

    result = parser.processNumber(['string']);
    assert.deepStrictEqual(result, { err: { prompt: i18n.vTypeMatchErr, values: [] } });

    result = parser.processNumber(['1']);
    assert.deepStrictEqual(result, { value: 1 });
  });

  it('processMap()', function () {
    let parser = new Parse(ctx);
    let result;
    result = parser.processMap(['{"key":"1","value":"2"}', '{"key":"1","value":"2"}']);
    assert.deepStrictEqual(result, { err: { prompt: i18n.vTypeMatchErr, values: [] } });

    result = parser.processMap(['a=b,b=c']);
    assert.deepStrictEqual(result, { value: { a: 'b', b: 'c' } });

    result = parser.processMap(['{"key":"1","value":"2"}']);
    assert.deepStrictEqual(result, { value: { key: '1', value: '2' } });

    result = parser.processMap(['{"key":"1","value":"}']);
    assert.deepStrictEqual(result, { err: { prompt: i18n.resolveErr, values: [] } });

    result = parser.processMap(['a']);
    assert.deepStrictEqual(result, { err: { prompt: i18n.vTypeMatchErr, values: [] } });
  });

  it('processMapArray()', function () {
    let parser = new Parse(ctx);
    let result;
    result = parser.processMapArray(['key=key1,value']);
    assert.deepStrictEqual(result, { err: { prompt: i18n.vTypeMatchErr, values: [] } });

    result = parser.processMapArray(['key=key1,value=value1', 'key=key2,value=value2']);
    assert.deepStrictEqual(result, { value: [{ key: 'key1', value: 'value1' }, { key: 'key2', value: 'value2' }] });
  });

  it('processArray()', function () {
    let parser = new Parse(ctx);
    let result;
    result = parser.processArray({}, []);
    assert.deepStrictEqual(result, { err: { prompt: i18n.vTypeMatchErr, values: [] } });

    result = parser.processArray({}, ['["a","b"]', '["c","d"]']);
    assert.deepStrictEqual(result, { err: { prompt: i18n.mixInputErr, values: [] } });

    result = parser.processArray({}, ['["a","b"']);
    assert.deepStrictEqual(result, { err: { prompt: i18n.resolveErr, values: [] } });

    result = parser.processArray({ subType: 'string' }, ['["a","b"]']);
    assert.deepStrictEqual(result, { value: ['a', 'b'] });

    result = parser.processArray({ subType: 'number' }, ['["a","b"]']);
    assert.deepStrictEqual(result, { err: { prompt: i18n.vTypeMatchErr, values: [] } });

    result = parser.processArray({ subType: 'number' }, ['1', '2']);
    assert.deepStrictEqual(result, { value: [1, 2] });

    result = parser.processArray({ subType: 'number' }, ['["1","2"]']);
    assert.deepStrictEqual(result, { value: [1, 2] });

    result = parser.processArray({ subType: 'map' }, ['key=key1,value=value1', 'key=key2,value=value2']);
    assert.deepStrictEqual(result, { value: [{ key: 'key1', value: 'value1' }, { key: 'key2', value: 'value2' }] });

    result = parser.processArray({ subType: 'map' }, ['key=key1,value']);
    assert.deepStrictEqual(result, { err: { prompt: i18n.vTypeMatchErr, values: [] } });
  });

  it('processValue()', function () {
    let obj = {};
    let flagName = 'flag';
    let result;
    let parser = new Parse(ctx);

    result = parser.processValue(obj, {}, flagName, []);
    assert.deepStrictEqual(result, { prompt: i18n.vTypeMatchErr, values: [] });

    result = parser.processValue(obj, {}, flagName, ['a']);
    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(obj, { 'flag': 'a' });

    result = parser.processValue(obj, { vtype: 'number' }, flagName, ['1']);
    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(obj, { 'flag': 1 });

    result = parser.processValue(obj, { vtype: 'boolean' }, flagName, []);
    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(obj, { 'flag': true });

    result = parser.processValue(obj, { vtype: 'map' }, flagName, ['key=key1,value=value1']);
    assert.deepStrictEqual(obj, { 'flag': { key: 'key1', value: 'value1' } });

    result = parser.processValue(obj, { vtype: 'array', subType: 'string' }, flagName, ['value1', 'value2']);
    assert.deepStrictEqual(obj, { 'flag': ['value1', 'value2'] });
  });

  it('parseOne()', function () {
    let result;
    let parser = new Parse(ctx);

    parser.options = { flag1: { vtype: 'string' }, flag2: { vtype: 'number' } };
    result = parser.parseOne(['--flag1=value', '--flag2', '1']);
    assert.deepStrictEqual(parser.parsedValue, { flag1: 'value' });
    assert.deepStrictEqual(parser.args, ['--flag2', '1']);
    assert.strictEqual(result, undefined);

    parser.parsedValue = {};
    parser.options = { flag: { vtype: 'array', subType: 'string' } };
    result = parser.parseOne(['--flag=value', 'value2']);
    assert.deepStrictEqual(parser.parsedValue, { flag: ['value', 'value2'] });
    assert.deepStrictEqual(parser.args, []);
    assert.strictEqual(result, undefined);

    parser.parsedValue = {};
    parser.options = { flag: { vtype: 'array', subType: 'string' } };
    result = parser.parseOne(['--flag=value', 'value2']);
    assert.deepStrictEqual(parser.parsedValue, { flag: ['value', 'value2'] });
    assert.deepStrictEqual(parser.args, []);
    assert.strictEqual(result, undefined);

    parser.parsedValue = {};
    parser.options = { flag: { vtype: 'array', subType: 'string' } };
    result = parser.parseOne(['--flag.0=value', 'value2']);
    assert.deepStrictEqual(parser.parsedValue, { flag: [''] });
    assert.deepStrictEqual(parser.args, []);
    assert.deepStrictEqual(result, { prompt: i18n.vTypeMatchErr, values: ['--flag.0'] });

    parser.parsedValue = {};
    parser.options = { flag: { vtype: 'array', subType: 'string' } };
    result = parser.parseOne(['--flag.0=value']);
    assert.deepStrictEqual(parser.parsedValue, { flag: ['value'] });
    assert.deepStrictEqual(parser.args, []);
    assert.strictEqual(result, undefined);

    parser.parsedValue = {};
    parser.options = { flag: { vtype: 'array', subType: 'string' } };
    result = parser.parseOne(['--flag.a=value']);
    assert.deepStrictEqual(parser.parsedValue, { flag: [] });
    assert.deepStrictEqual(parser.args, []);
    assert.deepStrictEqual(result, { prompt: i18n.unknowFlag, values: ['--flag.a'] });

    parser.parsedValue = {};
    parser.options = { flag: { vtype: 'array', subType: 'string' } };
    result = parser.parseOne(['--flag1=value']);
    assert.deepStrictEqual(parser.parsedValue, {});
    assert.deepStrictEqual(parser.args, []);
    assert.deepStrictEqual(result, { prompt: i18n.unknowFlag, values: ['--flag1'] });
  });

  it('parseFlag(args)', function () {
    let parser = new Parse(ctx);

    parser.options = { flag: { vtype: 'array', subType: 'map', options: { key: {}, value: {} } } };
    parser.args = ['--flag.0.key=key1', '--flag.0.value=value1', '--flag.1.key=key2', '--flag.1.value=value2'];
    let err = parser.parseFlag();
    assert.strictEqual(err, undefined);
    assert.deepStrictEqual(parser.parsedValue, { flag: [{ key: 'key1', value: 'value1' }, { key: 'key2', value: 'value2' }] });
    assert.deepStrictEqual(parser.args, []);

    parser.options = { flag: { vtype: 'array', subType: 'map', options: { key: {}, value: {} } } };
    parser.args = ['--flag.0.key=key1', '--flag.0.value=value1', '--flag.1.key', '--flag.1.value=value2'];
    err = parser.parseFlag();
    assert.deepStrictEqual(err, { prompt: i18n.vTypeMatchErr, values: ['--flag.1.key'] });
  });

  it('command and help command check', function () {
    ctx.args = ['test', 'help'];
    let parser = new Parse(ctx);
    parser.parse();
    assert.ok(parser.help);
    assert.deepStrictEqual(parser.cmds, ['test']);
    assert.strictEqual(parser.cmdFilePath, path.join(__dirname, '../test/test_cmd/test/test.js'));
    assert.deepStrictEqual(parser.args, ['help']);
  });

  it('There is no run method, the help information is automatically displayed', function () {
    ctx.args = [];
    let parser = new Parse(ctx);
    parser.parse();
    assert.ok(parser.help);
    assert.deepStrictEqual(parser.cmds, []);
    assert.strictEqual(parser.cmdFilePath, path.join(__dirname, '../test/test_cmd/test.js'));
    assert.deepStrictEqual(parser.args, []);
  });

  it('getOptionByName(): array', function () {
    let parser = new Parse(ctx);
    parser.options = {
      'flag': {
        vtype: 'array',
        subType: 'map',
        options: {
          key: {},
          value: {}
        }
      }
    };
    parser.parsedValue = {
      'flag': [
        {
          key: 'key1',
          value: 'value1'
        },
        {
          key: 'key2',
          value: 'value2'
        }
      ]
    };
    let result = parser.getOptionByName('flag');
    assert.deepStrictEqual(result.option, parser.options.flag);
    assert.deepStrictEqual(result.value, parser.parsedValue.flag);

    result = parser.getOptionByName('flag[0]');
    assert.deepStrictEqual(result.option, { vtype: 'map', options: { key: {}, value: {} } });
    assert.deepStrictEqual(result.value, parser.parsedValue.flag[0]);

    result = parser.getOptionByName('flag[0].key');
    assert.deepStrictEqual(result.option, {});
    assert.deepStrictEqual(result.value, parser.parsedValue.flag[0].key);
  });

  it('getOptionByName(): map', function () {
    let parser = new Parse(ctx);
    parser.options = {
      'flag': {
        vType: 'map',
        options: {
          key: {},
          value: {}
        }
      }
    };
    parser.parsedValue = {
      'flag': {
        key: 'key1',
        value: 'value1'
      }
    };
    let result = parser.getOptionByName('flag');
    assert.deepStrictEqual(result.option, parser.options.flag);
    assert.deepStrictEqual(result.value, parser.parsedValue.flag);

    result = parser.getOptionByName('flag.key');
    assert.deepStrictEqual(result.option, {});
    assert.deepStrictEqual(result.value, parser.parsedValue.flag.key);
  });

  it('relation validate: required', function () {
    let err;
    let parser = new Parse(ctx);
    parser.options = {
      flag: {
        vtype: 'string',
        required: true
      },
      flag2: {
        vtype: 'number'
      }
    };
    parser.parsedValue = { flag: 'value' };
    err = parser.optionValidate('flag');
    assert.strictEqual(err, undefined);
    err = parser.optionValidate('flag2');
    assert.strictEqual(err, undefined);

    parser.parsedValue = { flag2: 'value' };
    err = parser.optionValidate('flag');
    assert.deepStrictEqual(err, { prompt: i18n.requireOptionErr, values: ['flag'] });
    err = parser.optionValidate('flag2');
    assert.strictEqual(err, undefined);
  });

  it('relation validate: maxindex', function () {
    let err;
    let parser = new Parse(ctx);
    parser.options = {
      flag: {
        vtype: 'array',
        subType: 'string',
        maxindex: 3
      },
    };
    parser.parsedValue = { flag: ['value1', 'value2', 'value3'] };
    err = parser.optionValidate('flag');
    assert.strictEqual(err, undefined);

    parser.parsedValue = { flag: ['value1', 'value2', 'value3', 'value4'] };
    err = parser.optionValidate('flag');
    assert.deepStrictEqual(err, { prompt: i18n.outOfIndex, values: ['flag', 3] });
  });

  it('relation validate: subOptions equal relation', function () {
    let err;
    let parser = new Parse(ctx);
    parser.options = {
      flag: {
        vtype: 'array',
        subType: 'map',
        options: {
          key: {
            vtype: 'string'
          },
          value: {
            vtype: 'string',
          }
        }
      },
      flag2: {
        vtype: 'number',
        attributes: {
          required: [
            {
              'flag[*].value': {
                type: 'include',
                value: 'need'
              }
            }
          ]
        }
      }
    };
    parser.parsedValue = { flag: [{ key: 'key', value: 'value' }] };
    err = parser.optionValidate('flag');
    assert.strictEqual(err, undefined);
    err = parser.optionValidate('flag2');
    assert.strictEqual(err, undefined);

    parser.parsedValue = { flag: [{ key: 'key', value: 'value' }, { key: 'key2', value: 'need' }] };
    err = parser.optionValidate('flag');
    assert.strictEqual(err, undefined);
    err = parser.optionValidate('flag2');
    assert.deepStrictEqual(err, {
      prompt: i18n.concatPromt(i18n.includeRelationErr, i18n.requireOptionErr),
      values: ['flag[*].value', 'need', 'flag2']
    });
  });

  it('valueToAPIStruct(): normal', function () {
    let options = {
      flag: {
        vtype: 'string',
        mapping: 'mappingFlag'
      },
      flag2: {
        vtype: 'number',
        mapping: 'mappingFlag2'
      }
    };
    let values = { flag: 'value', flag2: 2 };
    let parser = new Parse(ctx);
    let mappingValue = {};
    parser.valueToAPIStruct(options, values, mappingValue);
    assert.deepStrictEqual(mappingValue, { mappingFlag: 'value', mappingFlag2: 2 });
  });

  it('valueToAPIStruct(): map', function () {
    let options = {
      flag: {
        mapping: 'mappingFlag',
        vtype: 'map',
        options: {
          key: {
            vtype: 'string',
            mapping: 'mappingKey'
          },
          value: {
            vtype: 'string',
            mapping: 'mappingValue'
          }
        }
      },
      flag2: {
        mapping: 'mappingFlag2',
        vtype: 'string'
      }
    };
    let values = {
      flag: {
        key: 'key1',
        value: 'value1'
      },
      flag2: 'value2'
    };
    let parser = new Parse(ctx);
    let mappingValue = {};
    parser.valueToAPIStruct(options, values, mappingValue);
    assert.deepStrictEqual(mappingValue,
      {
        mappingFlag: { mappingKey: 'key1', mappingValue: 'value1' },
        mappingFlag2: 'value2'
      }
    );
  });

  it('valueToAPIStruct(): arrayMap', function () {
    let options = {
      flag: {
        mapping: 'mappingFlag',
        vtype: 'array',
        subType: 'map',
        options: {
          key: {
            vtype: 'string',
            mapping: 'mappingKey'
          },
          value: {
            vtype: 'string',
            mapping: 'mappingValue'
          }
        }
      },
      flag2: {
        mapping: 'mappingFlag2',
        vtype: 'string'
      }
    };
    let values = {
      flag: [
        {
          key: 'key1',
          value: 'value1'
        },
        {
          key: 'key2',
          value: 'value2'
        }
      ],
      flag2: 'value2'
    };
    let parser = new Parse(ctx);
    let mappingValue = {};
    parser.valueToAPIStruct(options, values, mappingValue);
    assert.deepStrictEqual(mappingValue,
      {
        mappingFlag: [
          { mappingKey: 'key1', mappingValue: 'value1' },
          { mappingKey: 'key2', mappingValue: 'value2' }
        ],
        mappingFlag2: 'value2'
      }
    );
  });

  it('valueToAPIStruct(): Multilevel', function () {
    let options = {
      flag: {
        mapping: 'root.mappingFlag',
        vtype: 'array',
        subType: 'map',
        options: {
          key: {
            vtype: 'string',
            mapping: 'mappingKey'
          },
          value: {
            vtype: 'string',
            mapping: 'mappingValue'
          }
        }
      },
      flag2: {
        mapping: 'mappingFlag2',
        vtype: 'string'
      }
    };
    let values = {
      flag:
        [
          {
            key: 'key1',
            value: 'value1'
          },
          {
            key: 'key2',
            value: 'value2'
          }
        ],
      flag2: 'value2'
    };
    let parser = new Parse(ctx);
    let mappingValue = {};
    parser.valueToAPIStruct(options, values, mappingValue);
    assert.deepStrictEqual(mappingValue,
      {
        root: {
          mappingFlag: [
            { mappingKey: 'key1', mappingValue: 'value1' },
            { mappingKey: 'key2', mappingValue: 'value2' }
          ],
        },
        mappingFlag2: 'value2'
      }
    );
  });

  it('valueToAPIStruct(): Multilevel2', function () {
    let options = {
      flag: {
        mapping: 'root.mappingFlag',
        vtype: 'string',
      },
      flag2: {
        mapping: 'root.mappingFlag2',
        vtype: 'string'
      }
    };
    let values = {
      flag: 'value1',
      flag2: 'value2'
    };
    let parser = new Parse(ctx);
    let mappingValue = {};
    parser.valueToAPIStruct(options, values, mappingValue);
    assert.deepStrictEqual(mappingValue,
      {
        root: {
          mappingFlag: 'value1',
          mappingFlag2: 'value2'
        }
      }
    );
  });

  it('parse()', function () {
    ctx.args = ['test', '--flag=string', '-n', '2','--profile','test'];
    let parser = new Parse(ctx);
    let err = parser.parse();
    assert.strictEqual(err, undefined);
    assert.deepStrictEqual(parser.parsedValue, { flag: 'string', 'number-flag': 2, 'unchanged-flag': 'unchanged', region: 'cn-hangzhou',profile:'test' });
  });

  it('parse: conflict', function () {
    let err;
    let parser = new Parse(ctx);
    parser.options = {
      'flag1': {
        vtype: 'string',
      },
      'flag2': {
        vtype: 'string',
      }
    };
    parser.parsedValue = {
      'flag2': 'value'
    };

    err = parser.conflictValidate([{ optNames: ['flag1', 'flag2'], required: true }]);
    assert.strictEqual(err, undefined);

    parser.parsedValue = {
      'flag1': 'value'
    };
    err = parser.conflictValidate([{ optNames: ['flag1', 'flag2'], required: true }]);
    assert.strictEqual(err, undefined);

    parser.parsedValue = {
      'flag1': 'value',
      'flag2': 'value'
    };
    err = parser.conflictValidate([{ optNames: ['flag1', 'flag2'], required: true }]);
    assert.deepStrictEqual(err, {
      prompt: i18n.conflictErr,
      values: ['flag1 | flag2']
    });
    err = parser.conflictValidate([{ optNames: ['flag1', 'flag2'], required: false }]);
    assert.deepStrictEqual(err, {
      prompt: i18n.conflictErr,
      values: ['flag1 | flag2']
    });

    parser.parsedValue = {};
    err = parser.conflictValidate([{ optNames: ['flag1', 'flag2'], required: true }]);
    assert.deepStrictEqual(err, {
      prompt: i18n.requireOptionErr,
      values: ['flag1 | flag2']
    });
    err = parser.conflictValidate([{ optNames: ['flag1', 'flag2'], required: false }]);
    assert.strictEqual(err, undefined);
  });

  it('Level dependency check: normal', function () {
    let err;
    let parser = new Parse(ctx);
    parser.options = {
      flag: {
        vtype: 'string',
      },
      flag2: {
        vtype: 'string'
      },
      'dep-flag': {
        vtype: 'string',
        attributes: {
          show: [
            {
              'flag': {
                type: 'any'
              }
            }
          ],
          required: [
            {
              flag2: {
                type: 'equal',
                value: 'requiredValue'
              }
            }
          ]
        }
      }
    };
    parser.parsedValue = { 'dep-flag': 'value' };
    err = parser.optionValidate('dep-flag');
    assert.strictEqual(err, undefined);
    err = parser.optionValidate('flag');
    assert.strictEqual(err, undefined);
    err = parser.optionValidate('flag2');
    assert.strictEqual(err, undefined);

    // show no error
    parser.parsedValue = { 'dep-flag': 'value', flag: 'value' };
    err = parser.optionValidate('dep-flag');
    assert.strictEqual(err, undefined);
    err = parser.optionValidate('flag');
    assert.strictEqual(err, undefined);
    err = parser.optionValidate('flag2');
    assert.strictEqual(err, undefined);

    // When the values are not equal, no need
    parser.parsedValue = { 'flag2': 'value', flag: 'value' };
    err = parser.optionValidate('flag');
    assert.strictEqual(err, undefined);
    err = parser.optionValidate('flag2');
    assert.strictEqual(err, undefined);
    err = parser.optionValidate('dep-flag');
    assert.strictEqual(err, undefined);

    // When the value is equal, required
    parser.parsedValue = { 'flag2': 'requiredValue', flag: 'value' };
    err = parser.optionValidate('flag');
    assert.strictEqual(err, undefined);
    err = parser.optionValidate('flag2');
    assert.strictEqual(err, undefined);
    err = parser.optionValidate('dep-flag');
    assert.deepStrictEqual(err, {
      prompt: i18n.concatPromt(i18n.equalRelationErr, i18n.requireOptionErr),
      values: ['flag2', 'requiredValue', 'dep-flag']
    });
  });

  it('tansOpts()', function () {
    let cmdObj = {
      options: {
        flag: {},
        'conflict-flag': {},
        flag2: {
          vtype: 'number',
        },
        flag3: {
          attributes: {
            required: [
              {
                flag2: {
                  type: 'equal',
                  value: 3
                }
              }
            ]
          }
        },
        flag4: {}
      },
      conflicts: [
        {
          optNames: ['flag', 'conflict-flag'],
          required: true
        },
        {
          optNames: ['flag3', 'flag4'],
        }
      ]
    };
    let parser = new Parse(ctx);
    let result = parser.transOpts(cmdObj);
    assert.deepStrictEqual(result, { index: [['flag', 'conflict-flag'], ['flag3', 'flag4'], 'flag2'], endRequiredIndex: 0 });

    cmdObj.conflicts.pop();
    result = parser.transOpts(cmdObj);
    assert.deepStrictEqual(result, { index: [['flag', 'conflict-flag'], 'flag2', 'flag3', 'flag4'], endRequiredIndex: 0 });

    cmdObj.options.flag4.index = 0;
    result = parser.transOpts(cmdObj);
    assert.deepStrictEqual(result, { index: [['flag', 'conflict-flag'], 'flag4', 'flag3', 'flag2'], endRequiredIndex: 0 });

    cmdObj.options.flag2.index = 1;
    result = parser.transOpts(cmdObj);
    assert.deepStrictEqual(result, { index: [['flag', 'conflict-flag'], 'flag4', 'flag2', 'flag3'], endRequiredIndex: 0 });

    cmdObj.options.flag5 = { required: true };
    cmdObj.options.flag6 = { index: 0, required: true };
    result = parser.transOpts(cmdObj);
    assert.deepStrictEqual(result, { index: ['flag6', 'flag5', ['flag', 'conflict-flag'], 'flag4', 'flag2', 'flag3'], endRequiredIndex: 2 });
  });
});