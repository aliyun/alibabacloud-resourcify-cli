'use strict';

const assert = require('assert');
const path = require('path');

const spawn = require('../spawn');

describe('arc cs cluster', () => {

  it('arc cs cluster', async () => {
    const {code, stdout, stderr} = await spawn(path.join(__dirname, '../../bin/arc.js'), ['cs', 'cluster']);
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

  it('arc cs cluster list', async () => {
    const {code, stdout, stderr} = await spawn(path.join(__dirname, '../../bin/arc.js'), ['cs', 'cluster', 'list']);
    assert.strictEqual(stdout, `{
  "clusters": [],
  "pageInfo": {
    "pageNumber": 1,
    "pageSize": 50,
    "totalCount": 0
  }
}
`);
    assert.strictEqual(stderr, '');
    assert.strictEqual(code, 0);
  });
});