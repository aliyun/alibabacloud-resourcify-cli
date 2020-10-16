#!/usr/bin/env node

// AlibabaCloud Resourcify CLI

'use strict';
const { run } = require('../run.js');
let conf = require('../arc_config.js');

conf.rootCmd = 'arc';
// 运行
run('cmds/meta/arc');