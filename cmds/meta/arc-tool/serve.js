'use strict';
const Koa = require('koa');
const router = require('koa-router')();
const koaStatic = require('koa-static');
const path = require('path');
const fs = require('fs');
const rootPath = path.join(__dirname, '../arc');
const Parse = require('../../../lib/parser.js');
const i18n = require('../../../lib/i18n.js');
const util = require('util');

let lang = 'zh';


exports.cmdObj = {
  desc: {
    zh: '启动帮助文档web服务器',
    en: `Start the help document web server`
  },
};

function getSubList(dirPath, nextDir) {
  if (nextDir) {
    dirPath = path.join(dirPath, nextDir);
  }
  let descPath = dirPath + '.js';

  let meta = require(descPath);
  let data = {};
  if (!meta.cmdObj.sub) {
    return '';
  }

  let subs = Object.keys(meta.cmdObj.sub);
  for (let sub of subs) {
    data[sub] = getSubList(dirPath, sub);
  }
  return data;
}

function getProductData(product) {
  let descPath = path.join(rootPath, product) + '.js';
  let meta = require(descPath);
  let syntax = [
    `arc ${product} [resources]`,
    `arc-${product} [resources]`
  ];
  let desc = meta.cmdObj.desc[lang];
  let resources = {};
  let subs = Object.keys(meta.cmdObj.sub);
  for (let resource of subs) {
    resources[resource] = meta.cmdObj.sub[resource][lang];
  }
  return { name: product, syntax, desc, resources };
}

function getResourceData(product, resource) {
  let descPath = path.join(rootPath, product, resource) + '.js';
  let meta = require(descPath);
  let syntax = [
    `arc ${product} ${resource} [action]`,
    `arc-${product} ${resource} [action]`
  ];
  let desc = meta.cmdObj.desc[lang];
  let actions = {};
  let subs = Object.keys(meta.cmdObj.sub);
  for (let action of subs) {
    actions[action] = meta.cmdObj.sub[action][lang];
  }
  return { name: resource, syntax, desc, actions };
}

function getOptionInfo(parse, option) {
  let info = {
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
        let prompt = parse.getConditionPrompt(option.attributes.show[i]);
        info.remark =info.remark+ util.format(prompt.prompt[lang], ...prompt.values)+'\n';
        if (option.attributes.show[i + 1]) {
          info.remark = info.remark + i18n.orKeyWord[lang] + '\n';
        }
      }
    }
    if (option.attributes.required) {
      info.remark = info.remark + i18n.requiredConditionPrompt[lang] + ':\n';
      for (let i = 0; i < option.attributes.required.length; i++) {
        let prompt = parse.getConditionPrompt(option.attributes.required[i]);
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
  let descPath = path.join(rootPath, product, resource, action) + '.js';
  let cmdObj = require(descPath).cmdObj;
  let syntax;
  let syntaxSuffix = '';
  if (cmdObj.usage) {
    syntax = cmdObj.usage;
  } else {
    if (cmdObj.args) {
      for (let value of cmdObj.args) {
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

  let desc = cmdObj.desc[lang];
  let options = {};

  if (!cmdObj.options) {
    return { name: action, syntax, desc };
  }
  let parse = new Parse({});
  let result = parse.transOpts(cmdObj);
  for (let optName of result.index) {
    if (Array.isArray(optName)) {
      for (let name of optName) {
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

exports.run = function (rootCtx) {
  lang = rootCtx.profile.language;
  const app = new Koa();
  app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    return await next();
  });
  app.use(koaStatic(path.join(__dirname, '../../../front/build')));
  router.get('/product', async (ctx, next) => {
    let data = getSubList(rootPath);
    ctx.body = data;
  });
  router.get('/product/:product', async (ctx, next) => {
    let product = ctx.params.product;
    let data = getData(product);
    ctx.body = data;
  });
  router.get('/resource/:product/:resource', async (ctx, next) => {
    let product = ctx.params.product;
    let resource = ctx.params.resource;
    let data = getData(product, resource);
    ctx.body = data;
  });
  router.get('/action/:product/:resource/:action', async (ctx, next) => {
    let product = ctx.params.product;
    let resource = ctx.params.resource;
    let action = ctx.params.action;
    let data = getData(product, resource, action);
    ctx.body = data;
  });
  router.get('/', async (ctx, next) => {
    let data = fs.readFileSync(path.join(__dirname, '../../../front/build/index.html'));
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
};

