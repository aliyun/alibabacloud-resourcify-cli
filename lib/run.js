#!/usr/bin/env node
'use strict';

// AlibabaCloud Resourcify CLI

const util = require('util');

const Config = require('./config');
const completion = require('./completion.js');
const Parser = require('./parser.js');
const Context = require('./context');
const Interactive = require('./interactive.js');
const Helper = require('./helper.js');

async function handle(rootCmdName, cmdFilePath, argv) {
  const ctx = new Context(rootCmdName, cmdFilePath, argv);

  if (process.env.COMP_LINE) {
    const parser = new Parser(ctx);
    const args = process.env.COMP_LINE.split(' ').slice(1);
    ctx['args'] = args;
    parser.parse(ctx, args);
    const cmd = require(parser.cmdFilePath);
    completion.completion(cmd.cmdObj);
    return;
  }

  const config = new Config();
  const { name, profile } = config.getProfile();
  ctx['profileName'] = name;
  ctx['profile'] = profile;
  ctx['args'] = argv;
  const parser = new Parser(ctx);
  const err = parser.parse(ctx);
  if (err) {
    console.log(util.format(err.prompt[profile.language], ...err.values));
    process.exit(-1);
  }

  ctx.profileName = parser.profileName;
  ctx.profile = parser.profile;
  ctx['cmds'] = parser.cmds;

  if (parser.help) {
    const helper = new Helper(ctx);
    helper.helper();
    console.log(helper.ui.toString());
    process.exit(1);
  }

  const cmd = require(cmdFilePath);

  // 交互开启
  if (parser.parsedValue['interaction']) {
    const interactCtx = new Interactive(ctx);
    await interactCtx.startInteractive(ctx);
    console.log(interactCtx.cmdStr);
    if (!interactCtx.isRun) {
      return;
    }
    ctx['parsedValue'] = interactCtx.parser.parsedValue;
    ctx['mappingValue'] = interactCtx.parser.mappingValue;
    ctx['argv'] = interactCtx.argv;
  } else {
    ctx['parsedValue'] = parser.parsedValue;
    ctx['mappingValue'] = parser.mappingValue;
    ctx['argv'] = parser.argv;
  }
  await cmd.run(ctx);
}

exports.run = function (rootCmdName, cmdFilePath, argv) {
  handle(rootCmdName, cmdFilePath, argv).then(() => {
    console.log('done');
    process.exit(0);
  }).catch((err) => {
    console.log(err.stack);
    process.exit(-1);
  });
};
