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


exports.run = async function (metaPath) {
  cliParser.argv._descFilePath = path.join(cliParser.argv._descFilePath, metaPath);
  if (process.env.COMP_LINE) {
    let args = process.env.COMP_LINE.split(' ').slice(1);
    cliParser.parser(args);
    let argv = cliParser.argv;
    const cmd = require(argv._descFilePath);
    completion.completion(cmd.cmdObj);
    return;
  }
  config.getProfile();

  cliParser.parser(process.argv.slice(2));
  let argv = cliParser.argv;
  if (argv._err) {
    console.error(argv._err);
    process.exit(-1);
  }
  const cmd = require(argv._descFilePath);

  // 显示帮助
  if (argv._help || !cmd.run) {
    help(cmd.cmdObj, config.profile.language);
    process.exit(-1);
  }

  // 交互开启
  if (cliParser.argv._parsedValue['interaction']) {
    let isRun = await runInteractively();
    console.log(cliParser.argv._inputCmd);
    if (!isRun) {
      return;
    }
  }

  await cmd.run(cliParser.argv);

  if (output.errorMsg) {
    console.error(output.errorMsg);
  } else {
    console.log(output.result);
  }
};