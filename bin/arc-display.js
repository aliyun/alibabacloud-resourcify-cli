#!/usr/bin/env node

// AlibabaCloud Resourcify CLI for CS
'use strict';

const program = require('commander');

const { display } = require('../lib/display');

process.stdin.resume();
// parse options
program
  .option('--query [query]', '结果筛选，语法参考 jmespath')
  .option('--format [format]', '输出格式，支持 json, yaml, csv, table')
  .parse(process.argv);

const buffers = [];

process.stdin.on('data', function(data) {
  buffers.push(data);
});

process.stdin.on('end', function () {
  const input = Buffer.concat(buffers);
  try {
    const output = display(input, program.query, program.format);
    // output
    process.stdout.write(output);
  } catch (ex) {
    process.stderr.write(`display result failed, caused by:\n` + ex.stack);
    process.exit(-1);
  }
});
