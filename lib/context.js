'use strict';

const Config = require('./config');
const { parse } = require('./args');

function loadContext(args, options = {}) {
  const ctx = {};
  const config = new Config();

  const { parsed, argv } = parse(args, {
    ...options,
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
  });
  ctx['parsed'] = parsed;
  ctx['argv'] = argv;

  if (ctx.parsed.get('profile')) {
    const { name, profile } = config.getProfile(ctx.parsed.get('profile'));
    ctx['profileName'] = name;
    ctx['profile'] = profile;
  } else {
    const { name, profile } = config.getProfile();
    ctx['profileName'] = name;
    ctx['profile'] = profile;
  }

  ctx['mappingValue'] = {}; // parser.mappingValue;

  return ctx;
}

module.exports = {
  loadContext
};
