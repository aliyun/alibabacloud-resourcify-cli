'use strict';

exports.cmdObj = {
    use: 'arc cs cluster',
    desc: {
        zh: '容器服务k8s版集群相关操作'
    },
    sub: {
        'create': {
            zh: '创建专有版集群'
        },
        'delete': {
            zh: '删除集群'
        },
        'get': {
            zh: '根据集群ID获取集群信息'
        },
        'get-userquota': {
            zh: '获取用户配额',
            en: ''
        },
        'list': {
            zh: '根据模糊查询获取集群信息'
        },
        'update': {
            zh: '修改集群',
            en: ''
        },
        'get-agent': {
            zh: '获取agent YMAL文件'
        },
        'get-kubeconfig': {
            zh: '获取当前用户的kubeconfig'
        },
        'get-log': {
            zh: '查询指定集群日志'
        },
        'list-resource': {
            zh: '查询指定集群的所有资源'
        },
        'list-tags': {
            zh: '查询可见的资源标签关系'
        },
        'scaleout': {
            zh: '集群扩容'
        },
        'update-tag': {
            zh: '修改集群tag信息'
        },
        'get-update-status': {
            zh: '查询集群升级状态'
        },
        'upgrade': {
            zh: '升级用户集群版本'
        },
        'upgrade-cancle': {
            zh: '取消集群升级'
        },
        'upgrade-pause': {
            zh: '暂停集群升级'
        },
        'upgrade-restart': {
            zh: '重新开始集群升级'
        }
    }
};