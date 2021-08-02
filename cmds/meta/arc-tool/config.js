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

async function ask(options) {
  const {name, message, required, language} = options;
  const question = {
    type: 'input',
    name: name,
    message: message + '\n' + name,
    default: options.default,
    filter: options.filter
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
      short: {
        zh: '配置CLI',
        en: 'Configure the CLI'
      },
      desc: {
        zh: '交互式配置CLI，根据提示输入参数值，完成后自动将现有配置作为默认配置',
        en: `Configure the CLI interactively, enter parameter values according to the prompts, and automatically use the existing configuration as the default configuration after completion`
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

    if (ctx.parsed.has('interaction')) {
      console.log(profile);
      profile['access_key_id'] = await ask({
        name: 'access-key-id',
        message: this.def.options['access-key-id'].desc[language],
        required: true,
        default: profile.access_key_id,
        language
      });
      profile['access_key_secret'] = await ask({
        name: 'access-key-secret',
        message: this.def.options['access-key-secret'].desc[language],
        default: confusePwd(profile.access_key_secret),
        required: true,
        language,
        filter: function (val) {
          if (val === confusePwd(profile.access_key_secret)) {
            return profile.access_key_secret;
          }
          return val;
        }
      });
      profile['region'] = await ask({
        name: 'region',
        message: this.def.options['region'].desc[language],
        required: true,
        default: profile.region,
        language
      });
      profile['language'] = await ask({
        name: 'language',
        message: this.def.options['language'].desc[language],
        required: true,
        default: profile.language,
        language
      });
    } else {
      this.validateOptions(ctx.parsed);
      profile['access_key_id'] = ctx.parsed.get('access-key-id');
      profile['access_key_secret'] = ctx.parsed.get('access-key-secret');
      profile['region'] = ctx.parsed.get('region') || ctx.profile.region;
      profile['language'] = ctx.parsed.get('language') || ctx.profile.language;
    }

    const config = new Config();
    config.updateProfile(ctx.profileName, profile);
  }
};
