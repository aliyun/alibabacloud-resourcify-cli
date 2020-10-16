'use strict';

exports.cmdObj = {
  use: 'arc',
  desc: {
    zh: 'Alibaba Cloud CLI',
    en: `Alibaba Cloud CLI`
  },
  sub: {
    cs: {
      zh: '容器服务',
      en: `Container Service for Kubernetes`
    }
  },
  options: {
    profile: {
      desc: {
        zh: '指定要使用的配置文件',
        en: `Specify the profile name to be used`
      }
    },
    region: {
      desc: {
        zh: '指定阿里云区域',
        en: `Region ID`
      }
    },
    interaction: {
      vtype: 'boolean',
      alias: 'i',
      desc: {
        zh: '交互式填充参数',
        en: `Interactive fill parameter`
      }
    }
  }
};