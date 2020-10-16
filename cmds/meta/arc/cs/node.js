'use strict';

exports.cmdObj = {
  desc: {
    zh: '容器服务k8s版节点操作',
    en: `Action of container service node`
  },
  sub: {
    'list': {
      zh: '查询集群节点',
      en: `query nodes in a cluster`
    },
    'delete': {
      zh: '移除集群节点',
      en: `remove nodes from a cluster`
    },
    'attach': {
      zh: '添加已有ECS节点到Kubernetes集群',
      en: `existing Elastic Compute Service (ECS) instances to a cluster.`
    },
    'attach-edge': {
      zh: '添加已有ENS节点至边缘托管集群',
      en: `add existing Edge Node Service (ENS) instances to a managed edge cluster.`
    },
    'get-attach-script': {
      zh: '生成Kubernetes边缘托管版集群的节点接入脚本',
      en: `Generate node access script for Kubernetes cluster`
    }
  }
};