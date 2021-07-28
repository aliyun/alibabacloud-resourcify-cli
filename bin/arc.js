#!/usr/bin/env node

// AlibabaCloud Resourcify CLI

'use strict';

const { run } = require('../lib/run.js');

// 运行
run('arc', require('../cmds/meta/arc'), process.argv.slice(2));
