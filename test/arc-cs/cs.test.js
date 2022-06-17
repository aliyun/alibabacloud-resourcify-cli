'use strict';

const assert = require('assert');
const path = require('path');

const spawn = require('../spawn');


describe('arc cs', () => {

  it('arc cs', async () => {
    const {code, stdout, stderr} = await spawn(path.join(__dirname, '../../bin/arc.js'), ['cs']);
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
});