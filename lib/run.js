#!/usr/bin/env node

// AlibabaCloud Resourcify CLI

'use strict';
const { help } = require('./helper.js');
const path = require('path');
let config = require('./config.js');
let output = require('./output.js');
let completion = require('./completion.js');
let cliParser = require('./parser.js');
let { runInteractively } = require('./interactive.js');
let { metaFilePath } = require('./arc_config.js');
const util = require('util');

exports.run = async function (rootCmdName, cmdFilePath) {
  let ctx = { rootCmdName };
  ctx['cmdFilePath'] = path.join(metaFilePath, cmdFilePath);
  if (process.env.COMP_LINE) {
    let args = process.env.COMP_LINE.split(' ').slice(1);
    ctx['args'] = args;
    let parserCtx = cliParser.parser(ctx, args);
    const cmd = require(parserCtx.cmdFilePath);
    completion.completion(cmd.cmdObj);
    return;
  }

  let { name, profile } = config.getProfile();
  ctx['profileName'] = name;
  ctx['profile'] = profile;
  ctx['args'] = process.argv.slice(2);
  let parserCtx = cliParser.parser(ctx);
  if (parserCtx.err) {
    console.log(util.format(parserCtx.err.prompt[profile.language], ...parserCtx.err.values));
    process.exit(-1);
  }
  ctx.profileName = parserCtx.profileName;
  ctx.profile = parserCtx.profile;
  ctx.cmdFilePath = parserCtx.cmdFilePath;
  ctx['cmds'] = parserCtx.cmds;
  const cmd = require(ctx.cmdFilePath);
  if (parserCtx.help) {
    help(ctx);
    process.exit(-1);
  }

  // 交互开启
  if (parserCtx.parsedValue['interaction']) {
    let interactCtx = await runInteractively(ctx);
    if (!interactCtx.isRun) {
      return;
    }
    ctx['parsedValue'] = interactCtx.parsedValue;
    ctx['mappingValue'] = interactCtx.mappingValue;
    ctx['argv'] = interactCtx.argv;
  } else {
    ctx['parsedValue'] = parserCtx.parsedValue;
    ctx['mappingValue'] = parserCtx.mappingValue;
    ctx['argv'] = parserCtx.argv;
  }
  await cmd.run(ctx);

  if (output.errorMsg) {
    console.error(output.errorMsg);
  } else {
    console.log(output.result);
  }
};