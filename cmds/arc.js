'use strict';

const Command = require('../lib/command');
const CSCommand = require('./arc/cs');

module.exports = class extends Command {
  constructor(name) {
    super(name, {
      desc: {
        zh: '阿里云资源化命令行工具，用于云服务资源操作',
        en: `Alibaba Cloud Resourcify CLI, used for operate resources of cloud service`
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
    });

    this.registerCommand(new CSCommand('cs'));
  }

  async run(args) {
    await this.help();
  }
};
