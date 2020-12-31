'use strict';

exports.cmdObj = {
  desc: {
    zh: '容器服务k8s版集群相关操作',
    en: `Action of container service cluster`
  },
  sub: {
    'create-kubernetes': {
      zh: '创建专有版集群',
      en: `Create a dedicated cluster`
    },
    'create-managed': {
      zh: '创建托管版集群',
      en: `Create a hosting cluster`
    },
    'create-ask': {
      zh: '创建 ASK 集群',
      en: `Create a ASK cluster`
    },
    'create-edge': {
      zh: '创建边缘版集群',
      en: `Create a ACK edge cluster`
    },
    'delete': {
      zh: '删除集群',
      en: `delete the cluster `
    },
    'get': {
      zh: '根据集群ID获取集群信息',
      en: `Get cluster information based on cluster ID`
    },
    'get-userquota': {
      zh: '获取用户配额',
      en: 'query resource quotas'
    },
    'list': {
      zh: '根据模糊查询获取集群信息',
      en: `Obtain cluster information based on fuzzy query`
    },
    'update': {
      zh: '修改集群',
      en: 'modify the configurations of a cluster'
    },
    'get-agent': {
      zh: '获取注册集群的代理配置以访问API Server',
      en: `obtain an agent to access the API server.`
    },
    'get-kubeconfig': {
      zh: '获取当前用户的kubeconfig',
      en: `Get the kubeconfig of the current user`
    },
    'get-log': {
      zh: '查询指定集群日志',
      en: `query the logs of a cluster.`
    },
    'list-resource': {
      zh: '查询指定集群的所有资源',
      en: `query all resources in a cluster.`
    },
    'list-tags': {
      zh: '查询可见的资源标签关系',
      en: `query tags that are attached to resources`
    },
    'scaleout': {
      zh: '集群扩容',
      en: `cluster scaleout`
    },
    'update-tag': {
      zh: '修改集群tag信息',
      en: `modify the tags of a cluster`
    },
    'get-update-status': {
      zh: '查询集群升级状态',
      en: `Query cluster upgrade status`
    },
    'upgrade': {
      zh: '升级用户集群版本',
      en: `upgrade a cluster`
    },
    'cancel-upgrade': {
      zh: '取消集群升级',
      en: `cancel the upgrade of a cluster`
    },
    'pause-upgrade': {
      zh: '暂停集群升级',
      en: `suspend the upgrade of a cluster`
    },
    'restart-upgrade': {
      zh: '重新开始集群升级',
      en: `resume the upgrade of a cluster`
    }
  }
};