#!/usr/bin/env node

// AlibabaCloud Resourcify CLI

'use strict';
const { run } = require('../lib/run.js');
let conf = require('../lib/arc_config.js');

conf.rootCmd = 'arc';
// 运行
run('cmds/meta/arc');