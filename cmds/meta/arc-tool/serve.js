'use strict';

const path = require('path');
const fs = require('fs');
const util = require('util');

const Koa = require('koa');
const router = require('koa-router')();
const koaStatic = require('koa-static');

const rootPath = path.join(__dirname, '../arc');
const Parse = require('../../../lib/parser.js');
const i18n = require('../../../lib/i18n.js');

let lang = 'zh';

const Command = require('../../../lib/command');
const { loadContext } = require('../../../lib/context.js');

function getSubList(dirPath, nextDir) {
  if (nextDir) {
    dirPath = path.join(dirPath, nextDir);
  }
  const descPath = dirPath + '.js';

  const meta = require(descPath);
  const data = {};
  if (!meta.cmdObj.sub) {
    return '';
  }

  const subs = Object.keys(meta.cmdObj.sub);
  for (const sub of subs) {
    data[sub] = getSubList(dirPath, sub);
  }
  return data;
}

function getProductData(product) {
  const descPath = path.join(rootPath, product) + '.js';
  const meta = require(descPath);
  const syntax = [
    `arc ${product} [resources]`,
    `arc-${product} [resources]`
  ];
  const desc = meta.cmdObj.desc[lang];
  const resources = {};
  const subs = Object.keys(meta.cmdObj.sub);
  for (const resource of subs) {
    resources[resource] = meta.cmdObj.sub[resource][lang];
  }
  return { name: product, syntax, desc, resources };
}

function getResourceData(product, resource) {
  const descPath = path.join(rootPath, product, resource) + '.js';
  const meta = require(descPath);
  const syntax = [
    `arc ${product} ${resource} [action]`,
    `arc-${product} ${resource} [action]`
  ];
  const desc = meta.cmdObj.desc[lang];
  const actions = {};
  const subs = Object.keys(meta.cmdObj.sub);
  for (const action of subs) {
    actions[action] = meta.cmdObj.sub[action][lang];
  }
  return { name: resource, syntax, desc, actions };
}

function getOptionInfo(parse, option) {
  const info = {
    vtype: option.vtype || 'string',
    desc: option.desc[lang],
    remark: ''
  };
  if (option.required) {
    info.vtype = '*' + info.vtype;
  }
  if (option.attributes) {
    if (option.attributes.show) {
      info.remark = i18n.conditionNotMetPrompt[lang] + ':\n';
      for (let i = 0; i < option.attributes.show.length; i++) {
        const prompt = parse.getConditionPrompt(option.attributes.show[i]);
        info.remark =info.remark+ util.format(prompt.prompt[lang], ...prompt.values)+'\n';
        if (option.attributes.show[i + 1]) {
          info.remark = info.remark + i18n.orKeyWord[lang] + '\n';
        }
      }
    }
    if (option.attributes.required) {
      info.remark = info.remark + i18n.requiredConditionPrompt[lang] + ':\n';
      for (let i = 0; i < option.attributes.required.length; i++) {
        const prompt = parse.getConditionPrompt(option.attributes.required[i]);
        info.remark =info.remark+ util.format(prompt.prompt[lang], ...prompt.values)+'\n';
        if (option.attributes.required[i + 1]) {
          info.remark = info.remark + i18n.orKeyWord[lang] + '\n';
        }
      }
    }
  }
  console.log(info);
  return info;
}

function getActionData(product, resource, action) {
  const descPath = path.join(rootPath, product, resource, action) + '.js';
  const cmdObj = require(descPath).cmdObj;
  let syntax;
  let syntaxSuffix = '';
  if (cmdObj.usage) {
    syntax = cmdObj.usage;
  } else {
    if (cmdObj.args) {
      for (const value of cmdObj.args) {
        if (value.required) {
          syntaxSuffix += `<${value.name}> `;
        } else {
          syntaxSuffix += `[${value.name}] `;
        }
      }
      if (cmdObj.options) {
        syntaxSuffix += ` [options]`;
      }
    } else {
      if (cmdObj.options) {
        syntaxSuffix += `[options]`;
      }
    }
    syntax = [
      `arc ${product} ${resource} ${action} ${syntaxSuffix}`,
      `arc-${product} ${resource} ${action} ${syntaxSuffix}`
    ];
  }

  const desc = cmdObj.desc[lang];
  const options = {};

  if (!cmdObj.options) {
    return { name: action, syntax, desc };
  }
  const parse = new Parse({});
  const result = parse.transOpts(cmdObj);
  for (const optName of result.index) {
    if (Array.isArray(optName)) {
      for (const name of optName) {
        options[name] = getOptionInfo(parse, cmdObj.options[name]);
      }
    } else {
      options[optName] = getOptionInfo(parse, cmdObj.options[optName]);
    }
  }
  return { name: action, syntax, desc, options };
}

function getData(product, resource, action) {
  let data = {};
  let promt = 'arcList';
  if (product) {
    promt = 'product';
  }
  if (resource) {
    promt = 'resource';
  }
  if (action) {
    promt = 'action';
  }
  switch (promt) {
  case 'arcList':
    data = getSubList();
    break;
  case 'product':
    data = getProductData(product);
    break;
  case 'resource':
    data = getResourceData(product, resource);
    break;
  case 'action':
    data = getActionData(product, resource, action);
  }
  return data;
}

module.exports = class extends Command {
  constructor(name) {
    super(name, {
      desc: {
        zh: '启动帮助文档web服务器',
        en: `Start the help document web server`
      },
    });
  }

  async run(args) {
    const ctx = loadContext(args);
    lang = ctx.profile.language;
    const app = new Koa();
    app.use(async (ctx, next) => {
      console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
      return await next();
    });
    app.use(koaStatic(path.join(__dirname, '../../../front/build')));
    router.get('/product', async (ctx, next) => {
      const data = getSubList(rootPath);
      ctx.body = data;
    });
    router.get('/product/:product', async (ctx, next) => {
      const product = ctx.params.product;
      const data = getData(product);
      ctx.body = data;
    });
    router.get('/resource/:product/:resource', async (ctx, next) => {
      const product = ctx.params.product;
      const resource = ctx.params.resource;
      const data = getData(product, resource);
      ctx.body = data;
    });
    router.get('/action/:product/:resource/:action', async (ctx, next) => {
      const product = ctx.params.product;
      const resource = ctx.params.resource;
      const action = ctx.params.action;
      const data = getData(product, resource, action);
      ctx.body = data;
    });
    router.get('/', async (ctx, next) => {
      const data = fs.readFileSync(path.join(__dirname, '../../../front/build/index.html'));
      ctx.type = 'text/html;charset=utf-8';
      ctx.body = data;
    });
    app.use(router.routes());
    app.use((ctx, next) => {
      return next().catch((err) => {
        ctx.response.body = {
          status: 500,
          message: err.message
        };
      });
    });
    app.listen(8000, function () {
      const addr = this.address();
      console.log(`listening on ${addr.address}:${addr.port}, use http://localhost:${addr.port}/`);
    });
  }
};
