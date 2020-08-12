'use strict';

exports.cmdObj = {
    use: 'arc cs node',
    desc: {
        zh: '容器服务k8s版节点操作'
    },
    sub: {
        'list':{
            zh:'查询集群节点'
        },
        'delete':{
            zh:'移除集群节点'
        },
        'attach':{
            zh:'添加已有ECS节点到Kubernetes集群'
        }
    }
};