'use strict';
const Koa = require('koa');
const router = require('koa-router')();
const koaStatic = require('koa-static');
const path = require('path');
const fs = require('fs');
const rootPath = path.join(__dirname, '../arc');
const { transOpts } = require('../../../lib/parser.js');
exports.cmdObj = {
  desc: {
    zh: '启动帮助文档web服务器',
    en: `Start the help document web server`
  },
};

exports.run = function (ctx) {
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
  for (let sub in meta.cmdObj.sub) {
    if (!sub) {
      continue;
    }
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
  let desc = meta.cmdObj.desc.zh;
  let resources = {};
  for (let resource in meta.cmdObj.sub) {
    if (!resource) {
      continue;
    }
    resources[resource] = meta.cmdObj.sub[resource].zh;
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
  let desc = meta.cmdObj.desc.zh;
  let actions = {};
  for (let action in meta.cmdObj.sub) {
    if (!resource) {
      continue;
    }
    actions[action] = meta.cmdObj.sub[action].zh;
  }
  return { name: resource, syntax, desc, actions };
}

function getActionData(product, resource, action) {
  let descPath = path.join(rootPath, product, resource, action) + '.js';
  let meta = require(descPath);
  let syntax;
  let syntaxSuffix = '';
  if (meta.cmdObj.usage) {
    syntax = meta.cmdObj.usage;
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
 
  let desc = meta.cmdObj.desc.zh;
  let options = {};

  if (!meta.cmdObj.options) {
    return { name: action, syntax, desc };
  }
  let opts = transOpts(meta.cmdObj.options);
  if (opts._required) {
    for (let option of opts._required) {
      if (Array.isArray(option)) {
        continue;
      }
      options[option] = {
        vtype: `*${opts[option].vtype || 'string'}`,
        desc: opts[option].desc.zh
      };
    }
  }
  for (let option of opts._transed) {
    if (opts._required.indexOf(option) !== -1) {
      continue;
    }
    options[option] = {
      vtype: meta.cmdObj.options[option].vtype || 'string',
      desc: meta.cmdObj.options[option].desc.zh
    };
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

