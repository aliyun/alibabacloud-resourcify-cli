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
    assert.strictEqual(stderr, '');
    assert.strictEqual(stdout, `用法:
    arc [子命令]
    arc [选项]

  阿里云资源化命令行工具，用于云服务资源操作

子命令:
    cs                                  容器服务K8S版

选项:
  --profile                             [string]            指定要使用的配置文件
  --region                              [string]            指定阿里云区域
  -i,--interaction                      [boolean]           交互式填充参数
`);
    assert.strictEqual(code, 0);
  });

  it('arc help', async () => {
    const {code, stdout, stderr} = await spawn(path.join(__dirname, '../bin/arc.js'), ['help']);
    assert.strictEqual(stderr, '');
    assert.strictEqual(stdout, `用法:
    arc [子命令]
    arc [选项]

  阿里云资源化命令行工具，用于云服务资源操作

子命令:
    cs                                  容器服务K8S版

选项:
  --profile                             [string]            指定要使用的配置文件
  --region                              [string]            指定阿里云区域
  -i,--interaction                      [boolean]           交互式填充参数
`);
    assert.strictEqual(code, 0);
  });

  it('arc cs', async () => {
    const {code, stdout, stderr} = await spawn(path.join(__dirname, '../bin/arc.js'), ['cs']);
    assert.strictEqual(stdout, `用法:
    arc cs [子命令]

  容器服务K8S版

子命令:
    cluster                             集群相关操作
    node                                集群节点操作
    addon                               集群插件操作
    nodepool                            集群节点池操作
`);
    assert.strictEqual(stderr, '');
    assert.strictEqual(code, 0);
  });

  it('arc cs cluster', async () => {
    const {code, stdout, stderr} = await spawn(path.join(__dirname, '../bin/arc.js'), ['cs', 'cluster']);
    assert.strictEqual(stdout, `用法:
    arc cs cluster [子命令]

  集群相关操作

子命令:
    create-kubernetes                   创建专有版集群
    create-managed                      创建托管版集群
    create-ask                          创建 ASK 集群
    create-edge                         创建边缘版集群
    delete                              删除集群
    get                                 根据集群ID获取集群信息
    get-userquota                       获取用户配额
    list                                根据模糊查询获取集群信息
    update                              修改集群
    get-agent                           获取注册集群的代理配置以访问API Server
    get-kubeconfig                      获取当前用户的kubeconfig
    get-log                             查询指定集群日志
    list-resource                       查询指定集群的所有资源
    list-tags                           查询可见的资源标签关系
    scaleout                            集群扩容
    update-tag                          修改集群tag信息
    get-update-status                   查询集群升级状态
    upgrade                             升级用户集群版本
    cancel-upgrade                      取消集群升级
    pause-upgrade                       暂停集群升级
    restart-upgrade                     重新开始集群升级
`);
    assert.strictEqual(stderr, '');
    assert.strictEqual(code, 0);
  });

  it('arc cs node', async () => {
    const {code, stdout, stderr} = await spawn(path.join(__dirname, '../bin/arc.js'), ['cs', 'node']);
    assert.strictEqual(stdout, `用法:
    arc cs node [子命令]

  集群节点操作

子命令:
    list                                查询集群节点
    delete                              移除集群节点
    attach                              添加已有ECS节点到Kubernetes集群
    attach-edge                         添加已有ENS节点至边缘托管集群
    get-attach-script                   生成Kubernetes边缘托管版集群的节点接入脚本
`);
    assert.strictEqual(stderr, '');
    assert.strictEqual(code, 0);
  });

  it('arc cs addon', async () => {
    const {code, stdout, stderr} = await spawn(path.join(__dirname, '../bin/arc.js'), ['cs', 'addon']);
    assert.strictEqual(stdout, `用法:
    arc cs addon [子命令]

  集群插件操作

子命令:
    list                                查询指定集群安装的所有Addons的信息
    get                                 集群安装的Addons详情
    get-upgrade-status                  查询集群Addons升级状态
    install                             安装集群插件
    uninstall                           卸载集群插件
`);
    assert.strictEqual(stderr, '');
    assert.strictEqual(code, 0);
  });

  it('arc cs nodepool', async () => {
    const {code, stdout, stderr} = await spawn(path.join(__dirname, '../bin/arc.js'), ['cs', 'nodepool']);
    assert.strictEqual(stdout, `用法:
    arc cs nodepool [子命令]

  集群节点池操作

子命令:
    create                              为集群创建节点池
    delete                              删除节点池
    get                                 查询集群指定节点池详情
    list                                查询集群内所有节点池详情
    scaleout                            扩容节点池节点
    update                              更新节点配置
`);
    assert.strictEqual(stderr, '');
    assert.strictEqual(code, 0);
  });

  it('arc cs help', async () => {
    const {code, stdout, stderr} = await spawn(path.join(__dirname, '../bin/arc.js'), ['cs', 'help']);
    assert.strictEqual(stdout, `用法:
    arc cs [子命令]

  容器服务K8S版

子命令:
    cluster                             集群相关操作
    node                                集群节点操作
    addon                               集群插件操作
    nodepool                            集群节点池操作
`);
    assert.strictEqual(stderr, '');
    assert.strictEqual(code, 0);
  });

  it('arc cs invalidcommand', async () => {
    const {code, stderr} = await spawn(path.join(__dirname, '../bin/arc.js'), ['cs', 'invalidcommand']);
    assert.strictEqual(stderr, `'invalidcommand' is not a sub-command. See 'arc cs help'\n`);
    assert.strictEqual(code, 1);
  });

  it('arc-tool', async () => {
    const {code, stdout, stderr} = await spawn(path.join(__dirname, '../bin/arc-tool.js'));
    assert.strictEqual(stdout, `用法:
    arc-tool [子命令]

  阿里云资源化命令行工具，用于配置、自动补全等辅助设置

子命令:
    config                              配置CLI
    completion                          自动补全
    serve                               启动帮助文档web服务器
    version                             获取当前程序版本
`);
    assert.strictEqual(stderr, '');
    assert.strictEqual(code, 0);
  });

  it('arc-tool help', async () => {
    const {code, stdout, stderr} = await spawn(path.join(__dirname, '../bin/arc-tool.js'), ['help']);
    assert.strictEqual(stdout, `用法:
    arc-tool [子命令]

  阿里云资源化命令行工具，用于配置、自动补全等辅助设置

子命令:
    config                              配置CLI
    completion                          自动补全
    serve                               启动帮助文档web服务器
    version                             获取当前程序版本
`);
    assert.strictEqual(stderr, '');
    assert.strictEqual(code, 0);
  });

  it('arc-tool config list', async () => {
    const {code, stdout, stderr} = await spawn(path.join(__dirname, '../bin/arc-tool.js'), ['config', 'list'], {
      env: {
        ...process.env,
        'ARC_CONFIG_PATH': path.join(__dirname, 'fixtures/arc.json')
      }
    });
    assert.strictEqual(stdout, `{
  "profiles": {
    "default": {
      "region": "cn-hangzhou",
      "language": "zh",
      "access_key_id": "id",
      "access_key_secret": "secret"
    }
  },
  "default": "default"
}\n`);
    assert.strictEqual(stderr, '');
    assert.strictEqual(code, 0);
  });

  it('arc-tool config get', async () => {
    const {code, stdout, stderr} = await spawn(path.join(__dirname, '../bin/arc-tool.js'), ['config', 'get'], {
      env: {
        ...process.env,
        'ARC_CONFIG_PATH': path.join(__dirname, 'fixtures/arc.json')
      }
    });
    assert.strictEqual(stdout, `{
  "region": "cn-hangzhou",
  "language": "zh",
  "access_key_id": "id",
  "access_key_secret": "secret"
}
`);
    assert.strictEqual(stderr, '');
    assert.strictEqual(code, 0);
  });
});
