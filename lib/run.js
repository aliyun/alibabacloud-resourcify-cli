#!/usr/bin/env node

// AlibabaCloud Resourcify CLI

'use strict';
const path = require('path');
let config = require('./config.js');
let output = require('./output.js');
let completion = require('./completion.js');
const cliParser = require('./parser.js');
let Interactive = require('./interactive.js');
const Helper = require('./helper.js');
let { metaFilePath } = require('./arc_config.js');
const util = require('util');

exports.run = async function (rootCmdName, cmdFilePath) {
  let ctx = { rootCmdName };
  ctx['cmdFilePath'] = path.join(metaFilePath, cmdFilePath);
  let parser = new cliParser(ctx);
  if (process.env.COMP_LINE) {
    let args = process.env.COMP_LINE.split(' ').slice(1);
    ctx['args'] = args;
    parser.parse(ctx, args);
    const cmd = require(parser.cmdFilePath);
    completion.completion(cmd.cmdObj);
    return;
  }

  let { name, profile } = config.getProfile();
  ctx['profileName'] = name;
  ctx['profile'] = profile;
  ctx['args'] = process.argv.slice(2);
  parser = new cliParser(ctx);
  let err = parser.parse(ctx);
  if (err) {
    console.log(util.format(err.prompt[profile.language], ...err.values));
    process.exit(-1);
  }
  ctx.profileName = parser.profileName;
  ctx.profile = parser.profile;
  ctx.cmdFilePath = parser.cmdFilePath;
  ctx['cmds'] = parser.cmds;
  const cmd = require(ctx.cmdFilePath);
  if (parser.help) {
    let helper = new Helper(ctx);
    helper.helper();
    console.log(helper.ui.toString());
    process.exit(-1);
  }

  // 交互开启
  if (parser.parsedValue['interaction']) {
    let interactCtx = new Interactive(ctx);
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

  if (output.errorMsg) {
    console.error(output.errorMsg);
  } else {
    console.log(output.result);
  }
};