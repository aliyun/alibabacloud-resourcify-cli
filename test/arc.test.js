'use strict';

const path = require('path');
const assert = require('assert');
const cp = require('child_process');

function spawn(modulePath, args, options) {
  return new Promise((resolve, reject) => {
    const p = cp.spawn(modulePath, args, options);
    const stdout = [];
    p.stdout.on('data', (chunk) => {
      stdout.push(chunk);
    });

    const stderr = [];
    p.stderr.on('data', (chunk) => {
      stderr.push(chunk);
    });

    p.on('exit', (code) => {
      resolve({
        stdout: Buffer.concat(stdout).toString('utf-8'),
        stderr: Buffer.concat(stderr).toString('utf-8'),
        code: code
      });
    });

    p.on('error', (err) => {
      reject(err);
    });
  });
}

describe('arc', function () {
  it('arc', async () => {
    const {code, stdout, stderr} = await spawn(path.join(__dirname, '../bin/arc.js'));
    assert.strictEqual(code, 1);
    assert.strictEqual(stdout, `usage:
    arc  [子命令]
    arc  [选项]

  阿里云资源化命令行工具，用于云服务资源操作

子命令:
    cs                                  容器服务
选项:
  --profile                             [string]            指定要使用的配置文件
  --region                              [string]            指定阿里云区域
  -i,--interaction                      [boolean]           交互式填充参数
`);
    assert.strictEqual(stderr, '');
  });

  it('arc cs', async () => {
    const {code, stdout, stderr} = await spawn(path.join(__dirname, '../bin/arc.js'), ['cs']);
    assert.strictEqual(code, 1);
    assert.strictEqual(stdout, `usage:
    arc cs [子命令]
    arc cs [选项]

  阿里云资源化命令行工具，用于云服务资源操作

子命令:
    cs                                  容器服务
选项:
  --profile                             [string]            指定要使用的配置文件
  --region                              [string]            指定阿里云区域
  -i,--interaction                      [boolean]           交互式填充参数
`);
    assert.strictEqual(stderr, '');
  });

  it('arc-tool', async () => {
    const {code, stdout, stderr} = await spawn(path.join(__dirname, '../bin/arc-tool.js'));
    assert.strictEqual(code, 1);
    assert.strictEqual(stdout, `usage:
    arc-tool  [子命令]

  阿里云资源化命令行工具，用于配置、自动补全等辅助设置

子命令:
    config                              配置CLI
    completion                          自动补全
    serve                               启动帮助文档web服务器
`);
    assert.strictEqual(stderr, '');
  });
});
