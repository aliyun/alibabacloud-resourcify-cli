#!/usr/bin/env node

// AlibabaCloud Resourcify CLI

'use strict';

const { run } = require('../run.js');
let conf = require('../arc_config.js');

conf.rootCmd = 'arc-tool';
run('cmds/meta/arc-tool');