#!/usr/bin/env node

// AlibabaCloud Resourcify CLI

'use strict';

const { run } = require('../lib/run');

run('arc-tool', require('../cmds/meta/arc-tool'), process.argv.slice(2));
