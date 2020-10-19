#!/usr/bin/env node

// AlibabaCloud Resourcify CLI for CS

'use strict';

const { run } = require('../lib/run.js');
let conf = require('../lib/arc_config.js');

conf.rootCmd = 'arc-cs';
run('cmds/meta/arc/cs');