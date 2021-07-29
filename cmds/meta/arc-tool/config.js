'use strict';

const Config = require('../../../lib/config.js');
const i18n = require('../../../lib/i18n.js');

const Command = require('../../../lib/command');

const ListCommand = require('./config/list');
const GetCommand = require('./config/get');
const DeleteCommand = require('./config/delete');
const SetCommand = require('./config/set');

const { loadContext } = require('../../../lib/context');
const inquirer = require('inquirer');

function confusePwd(pwd) {
  if (!pwd) {
    return;
  }

  return pwd.substr(0, 3) + '****' + pwd.substr(-4);
}

async function ask(name, message, required, language) {
  const question = {
    type: 'input',
    name: name,
    message: message + '\n' + name
  };

  if (required) {
    question['validate'] = function (val) {
      if (val === '') {
        return i18n.emptyValueErr[language];
      }
      return true;
    };
  }

  const answers = await inquirer.prompt([question]);
  return answers[name];
}

module.exports = class extends Command {
  constructor(name) {
    super(name, {
      desc: {
        zh: '交互式配置CLI，根据提示输入参数值，完成后自动将现有配置作为默认配置',
        en: `Configure the CLI interactively, enter parameter values according to the prompts, and automatically use the existing configuration as the default configuration after completion`
      },
      sub: {
        delete: {
          zh: '删除配置',
          en: `remove profile`
        },
        get: {
          zh: '获取配置指定字段值',
          en: `Get profile specified field value`
        },
        list: {
          zh: '获取指定配置所有信息',
          en: `Get all information of the specified configuration`
        },
        set: {
          zh: '设置配置字段值',
          en: `Set profile field value`
        }
      },
      options: {
        'access-key-id': {
          required: true,
          desc: {
            zh: '凭证ID',
            en: `Access Key ID`
          }
        },
        'access-key-secret': {
          required: true,
          desc: {
            zh: '凭证密钥',
            en: `Access Key Secret`
          }
        },
        'region': {
          desc: {
            zh: '阿里云区域',
            en: `the ID of the region`
          }
        },
        'language': {
          desc: {
            zh: 'CLI语言',
            en: `the language of CLI`
          },
          choices: [
            'zh',
            'en'
          ]
        }
      }
    });
    this.registerCommand(new ListCommand('list'));
    this.registerCommand(new GetCommand('get'));
    this.registerCommand(new DeleteCommand('delete'));
    this.registerCommand(new SetCommand('set'));
  }

  async run(args) {
    const ctx = loadContext(args);
    const profile = ctx.profile;
    const language = profile.language || 'zh';

    const [ help ] = ctx.argv;
    if (help) {
      await this.help(language);
      return;
    }

    if (ctx.parsed.interaction) {
      profile['access_key_id'] = await ask('access-key-id', this.def.options['access-key-id'].desc[language], true, language);
      profile['access_key_secret'] = await ask('access-key-secret', this.def.options['access-key-secret'].desc[language], true, language);
      profile['region'] = await ask('access-key-secret', this.def.options['access-key-secret'].desc[language], true, language);
      profile['language'] = await ask('language', this.def.options['language'].desc[language], true, language);
    } else {
      this.validateOptions(ctx.parsed);
      profile['access_key_id'] = ctx.parsed['access-key-id'];
      profile['access_key_secret'] = ctx.parsed['access-key-secret'];
      profile['region'] = ctx.parsed['region'] || ctx.profile.region;
      profile['language'] = ctx.parsed['language'] || ctx.profile.language;
    }

    const config = new Config();
    config.updateProfile(ctx.profileName, profile);
  }
};

// exports.preInteractive = function (ctx) {
//   exports.cmdObj.options['access-key-id'].default = ctx.profile.access_key_id;
//   exports.cmdObj.options['access-key-secret'].default = confusePwd(ctx.profile.access_key_secret);
//   exports.cmdObj.options['access-key-secret'].filter = function (val) {
//     if (val === confusePwd(ctx.profile.access_key_secret)) {
//       return ctx.profile.access_key_secret;
//     }
//     return val;
//   };
//   exports.cmdObj.options.language.default = ctx.profile.language;
//   exports.cmdObj.options.region.default = ctx.profile.region;
// };
