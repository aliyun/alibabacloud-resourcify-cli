'use strict';

const path = require('path');
const fs = require('fs');
const util = require('util');
const rootCmd = require('../cmds/meta.js');
let config = require('./config.js');
let i18n = require('./i18n.js');

exports.argv = { _: [], _args: [], _cmds: [], _next: true, _err: '', _descFilePath: path.join(__dirname, '..'), _help: false, _mappingValue: {}, _parsedValue: {}, _inputCmd: '' };
exports.opts;
exports.parser = function (args) {
  exports.argv._args = args;
  cmdParser();
  // 读取最终命令对象
  exports.argv._descFilePath = path.join(exports.argv._descFilePath, ...exports.argv._cmds) + '.js';
  let cmd = require(exports.argv._descFilePath);

  if (exports.argv._help) {
    cmd.run = undefined;
    return;
  }

  argsParse();

  let opts = exports.transOpts(rootCmd.cmdObj.options);
  opts = exports.transOpts(cmd.cmdObj.options, opts);
  exports.opts = opts;

  // 解析终端所有flag
  flagsParser();

  if (exports.argv._parsedValue.profile) {
    config.getProfile(exports.argv._parsedValue.profile);
  }
  if (exports.argv._parsedValue.region) {
    config.profile.region = exports.argv._parsedValue.region;
  }
  if (opts['region'].mapping && !exports.argv._mappingValue[opts['region'].mapping]) {
    exports.argv._mappingValue[opts['region'].mapping] = config.profile.region;
  }
  for (let key of opts._unchanged) {
    if (opts[key].mapping) {
      exports.argv._mappingValue[opts[key].mapping] = opts[key].default;
    } else {
      exports.argv._parsedValue[key] = opts[key].default;
    }
  }
  exports.argv._opts = exports.opts;
  if (exports.argv._err) {
    return;
  }

  if (exports.argv._parsedValue.interaction) {
    return;
  }

  // 位置参数校验
  let err = argsValidate(cmd.cmdObj.args, exports.argv._);
  if (err) {
    exports.argv._err = err;
    return;
  }

  //flag校验
  err = optionsValidate(exports.opts, exports.argv._parsedValue);
  if (err) {
    exports.argv._err = err;
    return;
  }
};
function optionsValidate(opts, values) {
  for (let opt of opts._required) {
    let optName = opt;
    if (Array.isArray(opt)) {
      let has = false;
      for (let option of opt) {
        if (values[option]) {
          if (!has) {
            has = true;
            optName = option;
          } else {
            return `选项冲突，${opt} 只能选择其中一个`;
          }
        }
      }
      if (!has) {
        return `缺少必选参数：${opt.join('|')}`;
      }
    }
    if (!values[optName]) {
      return `缺少必选参数：${opt}`;
    }
  }
}
function argsValidate(argsOption, argv) {
  let needLen = 0;
  let len = 0;
  let variablelen = false;
  for (let key in argsOption) {
    len++;
    if (argsOption[key].required) {
      needLen++;
    }
    if (argsOption[key].variable) {
      variablelen = true;
    }
  }
  if (argv.length < needLen) {
    return i18n.missPositionArgErr[config.profile.language];
  }
  if (!variablelen && argv.length > len) {
    return util.format(i18n.unknowPositionArgErr[config.profile.language], argv.slice(len), len);
  }
  let index = 0;
  for (index in argv) {
    let ok = true;
    let arg;
    if (argsOption[index]) {
      arg = argsOption[index];
      if (arg.choices) {
        ok = arg.choices.includes(argv[index]);
      }
    } else {
      arg = argsOption[argsOption.length - 1];
      if (arg.choices) {
        ok = arg.choices.includes(argv[index]);
      }
    }
    if (!ok) {
      return util.format(i18n.positionArgValueErr[config.profile.language], arg.name, arg.choices.join('|'));
    }
  }

}

function flagsParser() {
  for (; ;) {
    if (!exports.argv._next || exports.argv._err) {
      break;
    }
    exports.parseOne();
  }
}

exports.parseOne = function () {
  let args = exports.argv._args;
  if (args.length === 0) {
    exports.argv._next = false;
    return;
  }
  let arg = args[0];
  if (arg.length === 1 || !arg.startsWith('-')) {
    exports.argv._next = false;
    exports.argv._err = util.format(i18n.unknowSyntax[config.profile.language], arg);
    return;
  }
  let miners = 1;
  if (arg[1] === '-') {
    miners = 2;
  }
  arg = arg.slice(miners);
  let argSlice = arg.split('=', 2);
  let flagName = argSlice[0];
  if (!exports.opts[flagName]) {
    exports.argv._err = util.format(i18n.unknowFlag[config.profile.language], '-'.repeat(miners) + flagName);
    return;
  }

  exports.opts[flagName]['_input'] = [];
  if (argSlice.length === 2) {
    if (argSlice[1] === '') {
      exports.argv._err = util.format(i18n.syntaxErr[config.profile.language], '-'.repeat(miners) + arg);
      return;
    }
    exports.opts[flagName]._input.push(argSlice[1]);
  }
  args = args.slice(1);
  exports.argv._next = false;
  let index = 0;
  for (index in args) {
    if (args[index].startsWith('-')) {
      exports.argv._next = true;
      break;
    }
    exports.opts[flagName]._input.push(args[index]);
  }
  exports.argv._args = args.slice(index);
  let value = processValue(flagName);
  exports.argv._parsedValue[exports.opts[flagName].name] = value;
  if (exports.opts[flagName].mapping) {
    exports.argv._mappingValue[exports.opts[flagName].mapping] = value;
  }
};

function processValue(flagName) {
  let flag = exports.opts[flagName];
  if (!flag.vtype) {
    flag.vtype = 'string';
  }
  let value;
  switch (flag.vtype) {
  case 'string':
    value = processString(flagName);
    break;
  case 'boolean':
    value = processBoolean(flagName);
    break;
  case 'number':
    value = processNumber(flagName);
    break;
  case 'map':
    value = processMap(flagName, flag);
    break;
  case 'array':
    value = processArray(flagName);
    break;
  default:
    exports.argv._err = i18n.unrecognizedVType[config.profile.language];
  }
  return value;
}
function processString(flagName) {
  let input;
  input = exports.opts[flagName]._input;
  if (input.length !== 1) {
    exports.argv._err = util.format(i18n.vTypeMatchErr[config.profile.language], flagName);
    return;
  }
  return input[0];
}

function processBoolean(flagName) {
  let input = exports.opts[flagName]._input;
  if (input.length === 0) {
    return true;
  }
  if (input.length === 1) {
    switch (input[0]) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      exports.argv._err = util.format(i18n.vTypeMatchErr[config.profile.language], flagName);
    }
  } else {
    exports.argv._err = util.format(i18n.vTypeMatchErr[config.profile.language], flagName);
  }
}

function processNumber(flagName) {
  let input = exports.opts[flagName]._input;
  if (input.length !== 1) {
    exports.argv._err = util.format(i18n.vTypeMatchErr[config.profile.language], flagName);
    return;
  }
  let value = +input[0];
  if (isNaN(value)) {
    exports.argv._err = util.format(i18n.vTypeMatchErr[config.profile.language], flagName);
    return;
  }
  return value;
}

function processMap(flagName, flag) {
  let input = exports.opts[flagName]._input;
  if (input.length !== 1) {
    exports.argv._err = util.format(i18n.vTypeMatchErr[config.profile.language], flagName);
    return;
  }
  let value;
  let mappingValue;
  if (flag.subType === 'complex') {
    value = processComplex(flagName);
  } else if (input[0].startsWith('{')) {
    if (input.length !== 1) {
      exports.argv._err = util.format(i18n.mixInputErr[config.profile.language], flagName);
      return;
    }
    try {
      value = JSON.parse(input[0]);
    } catch (err) {
      exports.argv._err = util.format(i18n.resolveErr[config.profile.language], flagName, err.message);
    }
  } else {
    let values = input[0].split(',');
    for (let data of values) {
      let pair = data.split('=');
      value[pair[0]] = value[pair[1]];
    }
  }
  if (exports.argv._err) {
    return;
  }
  if (flag.mappingType) {
    let mappingObj = new flag.mappingType(value);
    if (Object.keys(value).length !== Object.keys(mappingObj).length) {
      exports.argv._err = util.format(i18n.filedErr[config.profile.language], flagName);
    }
    mappingValue = mappingObj;
  } else {
    mappingValue = value;
  }
  return mappingValue;
}

function processArray(flagName) {
  let flag = exports.opts[flagName];
  let value;
  let mappingValue;
  switch (flag.subType) {
  case 'string':
    mappingValue = processStringArray(flagName);
    break;
  case 'number':
    mappingValue = processNumberArray(flagName);
    break;
  case 'map':
    mappingValue = processMapArray(flagName);
    break;
  case 'complex':
    value = processComplex(flagName);
    if (flag.mappingType) {
      for (let val of value) {
        let mappingObj = new flag.mappingType(val);
        if (Object.keys(val).length !== Object.keys(mappingObj).length) {
          exports.argv._err = util.format(i18n.filedErr[config.profile.language], flagName);
        }
        mappingValue.push(mappingObj);
      }
    } else {
      mappingValue = value;
    }
  }
  if (flag.maxindex) {
    if (mappingValue.length > flag.maxindex) {
      exports.argv._err = util.format(i18n.outOfIndex[config.profile.language], flagName, flag.maxindex);
    }
  }
  return mappingValue;
}

function processStringArray(flagName) {
  let input = exports.opts[flagName]._input;
  let value;
  if (input[0].startsWith('[')) {
    if (input.length !== 1) {
      exports.argv._err = util.format(i18n.mixInputErr[config.profile.language], flagName);
      return;
    }
    try {
      value = JSON.parse(input[0]);
    } catch (err) {
      exports.argv._err = util.format(i18n.resolveErr[config.profile.language], flagName, err.message);
    }
  }
  if (input.length === 0) {
    exports.argv._err = util.format(i18n.vTypeMatchErr[config.profile.language], flagName);
    return;
  }
  return value;
}

function processNumberArray(flagName) {
  let input = exports.opts[flagName]._input;
  if (input.length === 0) {
    exports.argv._err = util.format(i18n.vTypeMatchErr[config.profile.language], flagName);
    return;
  }
  let value = [];
  if (input[0].startsWith('[')) {
    if (input.length !== 1) {
      exports.argv._err = util.format(i18n.mixInputErr[config.profile.language], flagName);
      return;
    }
    try {
      value = JSON.parse(input[0]);
    } catch (err) {
      exports.argv._err = util.format(i18n.resolveErr[config.profile.language], flagName, err.message);
    }
  } else {
    value = input;
  }
  for (let val of input) {
    let num = +val;
    if (isNaN(num)) {
      exports.argv._err = util.format(i18n.vTypeMatchErr[config.profile.language], flagName);
      return;
    }
    value.push(num);
  }
  return value;
}

function processMapArray(flagName) {
  let flag = exports.opts[flagName];
  let input = flag._input;
  if (input.length === 0) {
    exports.argv._err = util.format(i18n.vTypeMatchErr[config.profile.language], flagName);
    return;
  }
  let value = [];
  if (input[0].startsWith('[')) {
    if (input.length !== 1) {
      exports.argv._err = util.format(i18n.mixInputErr[config.profile.language], flagName);
      return;
    }
    try {
      value = JSON.parse(input[0]);
    } catch (err) {
      exports.argv._err = util.format(i18n.resolveErr[config.profile.language], flagName, err.message);
    }
  } else {
    for (let data of input) {
      let tempValue = {};
      let values = data.split(',');
      for (let keyPair of values) {
        let pair = keyPair.split('=');
        tempValue[pair[0]] = pair[1];
      }
      value.push(tempValue);
    }
  }
  let mappingValue = [];
  if (flag.mappingType) {
    for (let val of value) {
      let mappingObj = new flag.mappingType(val);
      if (Object.keys(val).length !== Object.keys(mappingObj).length) {
        exports.argv._err = util.format(i18n.filedErr[config.profile.language], flagName);
      }
      mappingValue.push(mappingObj);
    }
  } else {
    mappingValue = value;
  }
  return mappingValue;
}

function processComplex(flagName) {
  let input = exports.opts[flagName]._input;
  if (input.length !== 1) {
    exports.argv._err = util.format(i18n.vTypeMatchErr[config.profile.language], flagName);
    return;
  }
  let value;
  try {
    value = JSON.parse(input[0]);
  } catch (err) {
    exports.argv._err = util.format(i18n.resolveErr[config.profile.language], flagName, err.message);
  }
  return value;
}

exports.transOpts = function (options, opts) {
  if (!opts) {
    opts = { _required: [], _optional: [], _transed: [], _unchanged: [] };
  }
  for (let optionName in options) {
    let optObj = options[optionName];
    optObj['name'] = optionName;
    opts[optionName] = optObj;
    if (optObj.alias) {
      opts[optObj.alias] = optObj;
    }
    if (opts._transed.indexOf(optionName) !== -1) {
      continue;
    }
    opts._transed.push(optionName);
    if (optObj.unchanged) {
      opts._unchanged.push(optionName);
      continue;
    }
    if (optObj.dependency) {
      continue;
    }
    if (optObj.conflicts) {
      if (optObj.conflicts.indexOf(optionName) === -1) {
        optObj.conflicts.push(optionName);
      }
      opts._transed.push(...optObj.conflicts);
    }

    if (optObj.required) {
      let conflicts = optObj.conflicts;
      if (conflicts) {
        opts._required.push(conflicts);
      } else {
        opts._required.push(optionName);
      }
    } else {
      let conflicts = optObj.conflicts;
      if (conflicts) {
        opts._optional.push(conflicts);
      } else {
        opts._optional.push(optionName);
      }
    }
  }
  return opts;
};

function cmdParser() {
  let args = exports.argv._args;
  let index = 0;
  for (index in args) {
    let arg = args[index];
    let tempPath = path.join(exports.argv._descFilePath, ...exports.argv._cmds, arg + '.js');
    if (fs.existsSync(tempPath)) {
      exports.argv._cmds.push(arg);
      continue;
    }
    if (arg === 'help') {
      exports.argv._help = true;
    }
    break;
  }
  if (args.length === exports.argv._cmds.length) {
    exports.argv._args = [];
  } else {
    exports.argv._args = args.slice(index);
  }
}

function argsParse() {
  let args = exports.argv._args;
  if (args.length === 0) {
    return;
  }
  let index = 0;
  for (index in args) {
    if (args[index].startsWith('-')) {
      break;
    }
    exports.argv._.push(args[index]);
  }
  if (args.length === exports.argv._.length) {
    exports.argv._args = [];
  } else {
    exports.argv._args = args.slice(index);
  }
}