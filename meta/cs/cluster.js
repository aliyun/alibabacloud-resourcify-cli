'use strict';

exports.cmdObj = {
    use: 'arc cs cluster',
    long: {
        zh: '容器服务k8s版集群相关操作'
    },
    sub: {
        'create': {
            zh: '创建专有版集群'
        },
        'create-edge': {
            zh: '创建边缘版集群'
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
        }
    }
};