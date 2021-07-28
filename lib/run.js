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

async function handle(cmdName, cmdDef, argv) {
  const ctx = new Context(cmdName, cmdDef, argv);

  if (process.env.COMP_LINE) {
    // const args = process.env.COMP_LINE.split(' ').slice(1);
    completion.completion(cmdDef.cmdObj);
    return;
  }

  const config = new Config();
  const { name, profile } = config.getProfile();
  ctx['profileName'] = name;
  ctx['profile'] = profile;
  ctx['args'] = argv;
  const parser = new Parser(ctx);
  const err = parser.parse();
  if (err) {
    console.log(util.format(err.prompt[profile.language], ...err.values));
    process.exit(1);
  }

  ctx.profileName = parser.profileName;
  ctx.profile = parser.profile;
  ctx['cmds'] = parser.cmds;
  const cmd = require(parser.cmdFilePath);
  if (parser.help) {
    const helper = new Helper(ctx);
    helper.helper();
    console.log(helper.ui.toString());
    process.exit(1);
  }

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

exports.run = function (rootCmdName, cmdDef, argv) {
  handle(rootCmdName, cmdDef, argv).then(() => {
    process.exit(0);
  }).catch((err) => {
    console.log(err.stack);
    process.exit(-1);
  });
};
