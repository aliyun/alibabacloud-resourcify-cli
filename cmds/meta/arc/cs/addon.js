'use strict';

exports.cmdObj = {
    use: 'arc cs addon',
    desc: {
        zh: '容器服务集群插件操作'
    },
    sub: {
        'list':{
            zh:'查询指定集群安装的所有Addons的信息'
        },
        'get':{
            zh:'集群安装的Addons详情'
        },
        'get-upgrade-status':{
            zh:'查询集群Addons升级状态'
        },
        'install':{
            zh:'安装集群插件'
        },
        'uninstall':{
            zh:'卸载集群插件'
        }
    }
};