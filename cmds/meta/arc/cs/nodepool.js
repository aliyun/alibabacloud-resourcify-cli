'use strict';

exports.cmdObj = {
  desc: {
    zh: '容器服务k8s版节点池操作',
    en: ``
  },
  sub: {
    'create': {
      zh: '为集群创建节点池',
      en: 'Create a cluster node pools'
    },
    'delete': {
      zh: '删除节点池',
      en: 'Delete the cluster node pool'
    },
    'get': {
      zh: '查询集群指定节点池详情',
      en: 'Describe the cluster node pool'
    },
    'list': {
      en: 'Describe a cluster node pools',
      zh: '查询集群内所有节点池详情'
    },
    'scaleout': {
      en: 'Scaleout node pools',
      zh: '扩容节点池节点'
    },
    'update': {
      en: 'Modify node pools',
      zh: '更新节点配置'
    }
  }
};