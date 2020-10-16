'use strict';

exports.cmdObj = {
  desc: {
    zh: '容器服务集群插件操作',
    en: `Action of container service cluster addon-on`
  },
  sub: {
    'list': {
      zh: '查询指定集群安装的所有Addons的信息',
      en: `query the details of all add-ons that are installed for a cluster.`
    },
    'get': {
      zh: '集群安装的Addons详情',
      en: `query details about the add-ons that are supported by a specified cluster type.`
    },
    'get-upgrade-status': {
      zh: '查询集群Addons升级状态',
      en: `query the upgrade status of a cluster add-on.`
    },
    'install': {
      zh: '安装集群插件',
      en: `install an add-on for a cluster.`
    },
    'uninstall': {
      zh: '卸载集群插件',
      en: `uninstall an add-on from a cluster.`
    }
  }
};