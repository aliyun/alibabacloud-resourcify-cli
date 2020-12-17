'use strict';
const assert = require('assert');
const path = require('path');
let Helper = require('../lib/helper.js');
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

  it('getSyntax()', function () {
    let helper = new Helper(ctx);
    helper.cmds = ['test'];
    helper.getSyntax();
    assert.strictEqual('    arc-test test [子命令]', helper.ui.toString());

    helper.cmdObj.usage = [
      'arc-test test [命令] [选项]',
      'arc-test test [选项]'
    ];
    helper.ui.resetOutput();
    helper.getSyntax();
    assert.strictEqual('    arc-test test [命令] [选项]\n    arc-test test [选项]', helper.ui.toString());

    helper.ui.resetOutput();
    helper.cmdObj.usage = undefined;
    helper.cmdObj.options = { flag: {} };
    helper.getSyntax();
    assert.strictEqual('    arc-test test [子命令]\n    arc-test test [选项]', helper.ui.toString());

    helper.ui.resetOutput();
    helper.cmdObj.args = [
      {
        name: 'arg1',
        required: true
      },
      {
        name: 'arg2'
      }
    ];
    helper.getSyntax();
    assert.strictEqual('    arc-test test [子命令]\n    arc-test test <arg1> [arg2] [选项]', helper.ui.toString());
  });

  it('getSubList', function () {
    let helper = new Helper(ctx);
    helper.getSubList();
    assert.strictEqual('子命令:\n' +
      '    option-type                         测试各个类型的参数\n' +
      '    relation                            测试类型间关系逻辑\n' +
      '    parser                              单元测试辅助命令',
    helper.ui.toString());
  });

  it('getOptions()', function () {
    let helper = new Helper(ctx);
    helper.cmdObj.options = {
      'conflict-flag':{
        desc:{
          zh:'冲突选项1'
        }
      },
      'conflict-flag2':{
        desc:{
          zh:'冲突选项2'
        }
      },
      flag: {
        required: true,
        desc: {
          zh: '测试flag'
        },
        choices:[
          'value1',
          'value2'
        ]
      },
      flag2: {
        vtype: 'number',
        desc: {
          zh: '测试flag2'
        },
        alias:'f'
      }
    };
    helper.cmdObj.conflicts=[
      {
        optNames: ['conflict-flag', 'conflict-flag2'],
      }
    ];
    helper.getOptions();
    assert.strictEqual('选项:\n' +
      '  --flag                                *[string]           测试flag\n' +
      '                                        [可选值: value1\n' +
      '                                        , value2]\n' +
      '  --conflict-flag                       [string]            冲突选项1\n' +
      '  --conflict-flag2                      [string]            冲突选项2\n' +
      '  -f,--flag2                            [number]            测试flag2',
    helper.ui.toString());
  });

  it('helper()',function(){
    let helper = new Helper(ctx);
    helper.cmds = ['test'];
    helper.cmdObj.options = {
      'conflict-flag':{
        desc:{
          zh:'冲突选项1'
        }
      },
      'conflict-flag2':{
        desc:{
          zh:'冲突选项2'
        }
      },
      flag: {
        required: true,
        desc: {
          zh: '测试flag'
        },
        choices:[
          'value1',
          'value2'
        ]
      },
      flag2: {
        vtype: 'number',
        desc: {
          zh: '测试flag2'
        },
        alias:'f'
      }
    };
    helper.helper();
    assert.strictEqual('usage:\n' +
       '    arc-test test [子命令]\n' +
       '    arc-test test <arg1> [arg2] [选项]\n' +
       '子命令:\n' +
       '    option-type                         测试各个类型的参数\n' +
       '    relation                            测试类型间关系逻辑\n' +
       '    parser                              单元测试辅助命令\n' +
       '选项:\n' +
       '  --flag                                *[string]           测试flag\n' +
       '                                        [可选值: value1\n' +
       '                                        , value2]\n' +
       '  --conflict-flag                       [string]            冲突选项1\n' +
       '  --conflict-flag2                      [string]            冲突选项2\n' +
       '  -f,--flag2                            [number]            测试flag2',
    helper.ui.toString());
  });
  
});