#!/usr/bin/env node

// AlibabaCloud Resourcify CLI for CS
'use strict';

const program = require('commander');
const { display, output } = require('../lib/display.js');

process.stdin.resume();
process.stdin.setEncoding('utf8');
// parse options
program
  .option('--query [query]', '结果筛选，语法参考 jmespath')
  .option('--format [format]', '输出格式，支持 json, yaml, csv, table')
  .option('--output [output]', '导出的相对路径')
  .parse(process.argv);

// console result
process.stdin.on('data', async function(data) {
  const result = display(data, program);
  //output
  if(program.output) {
    await output(result, program.output);
  } else {
    process.stdout.write(result);
  }
    
});