'use strict';

const Parse=require('../lib/parser.js');
const {cmdObj}=require('../cmds/meta/arc/cs/cluster/create.js');
const parser=new Parse(cmdObj,['--worker-instance-types.0','id']);
parser.parseFlag(parser.args);