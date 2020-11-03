'use strict';

const path = require('path');
const fs = require('fs');
const rootCmd = require('../cmds/meta.js');
let config = require('./config.js');
let i18n = require('./i18n.js');

let opts = {};

function cmdParser(args, cmdFilePath) {
  let help = false;
  let cmds = [];
  let index = 0;

  for (; index < args.length; index++) {
    let arg = args[index];
    let tempPath = path.join(cmdFilePath, ...cmds, arg + '.js');
    if (fs.existsSync(tempPath)) {
      cmds.push(arg);
      continue;
    }
    if (arg === 'help') {
      help = true;
    }
    break;
  }
  if (args.length === cmds.length) {
    args = [];
  } else {
    args = args.slice(index);
  }
  return { args, cmds, help };
}

function argvParse(args) {
  let argv = [];
  if (args.length === 0) {
    return { args, argv };
  }
  let index = 0;
  for (; index < args.length; index++) {
    if (args[index].startsWith('-')) {
      break;
    }
    argv.push(args[index]);
  }
  if (args.length === argv.length) {
    args = [];
  } else {
    args = args.slice(index);
  }
  return { args, argv };
}

function flagsParser(args) {
  let parsedValue = {};
  let mappingValue = {};
  for (; ;) {
    if (args.length === 0) {
      break;
    }
    let result = exports.parseOne(args);
    if (result.err && result.err.prompt) {
      return { err: result.err };
    }
    if (opts[result.flagName].mapping) {
      mappingValue[opts[result.flagName].mapping] = result.value;
    }
    parsedValue[opts[result.flagName].name] = result.value;
    if (!result.next) {
      break;
    }
    args = result.args;
  }
  return { parsedValue, mappingValue };
}

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
            let err = {
              prompt: i18n.conflictErr,
              values: [opt]
            };
            return err;
          }
        }
      }
      if (!has) {
        let err = {
          prompt: i18n.requireOptionErr,
          values: [opt.join('|')]
        };
        return err;
      }
    }
    if (!values[optName]) {
      let err = {
        prompt: i18n.requireOptionErr,
        values: [opt]
      };
      return err;
    }
  }
}

function argsValidate(argsOption, argv) {
  if (!argsOption) {
    if (argv.length !== 0) {
      let err = {
        prompt: i18n.unknowPositionArgErr,
        values: [argv[0], 0]
      };
      return err;
    }
    return;
  }
  let index = 0;
  for (; index < argsOption.length; index++) {
    if (argsOption[index].required && !argv[index]) {
      let err = {
        prompt: i18n.missPositionArgErr,
        values: [argsOption[index].name]
      };
      return err;
    }
  }
  if (argv[index]) {
    let err = {
      prompt: i18n.unknowPositionArgErr,
      values: [argv.slice(index), argsOption.length]
    };
    return err;
  }
}

exports.parser = function (ctx) {
  let parserCtx = cmdParser(ctx.args, ctx.cmdFilePath);
  parserCtx['profileName'] = ctx.profileName;
  parserCtx['profile'] = ctx.profile;
  parserCtx['cmdFilePath'] = path.join(ctx.cmdFilePath, ...parserCtx.cmds) + '.js';
  let cmd = require(parserCtx.cmdFilePath);
  if (parserCtx.help) {
    return parserCtx;
  }
  if (!cmd.run) {
    parserCtx.help = true;
    return parserCtx;
  }
  let argvCtx = argvParse(parserCtx.args);
  parserCtx['args'] = argvCtx.args;
  parserCtx['argv'] = argvCtx.argv;

  opts = exports.transOpts(cmd.cmdObj.options);
  opts = exports.transOpts(rootCmd.cmdObj.options, opts);
  // 解析终端所有flag
  let { parsedValue, mappingValue, err } = flagsParser(parserCtx.args);

  if (err && err.prompt) {
    return { err };
  }
  if (parsedValue.profile) {
    let { name, profile } = config.getProfile(parsedValue.profile);
    parserCtx['profileName'] = name;
    parserCtx['profile'] = profile;
  }

  if (parsedValue.region) {
    parserCtx['profile'].region = parsedValue.region;
  }
  if (opts['region'].mapping && !mappingValue[opts['region'].mapping]) {
    mappingValue[opts['region'].mapping] = parserCtx['profile'].region;
  }

  for (let key of opts._unchanged) {
    if (opts[key].mapping) {
      mappingValue[opts[key].mapping] = opts[key].default;
    } else {
      parsedValue[key] = opts[key].default;
    }
  }

  parserCtx['mappingValue'] = mappingValue;
  parserCtx['parsedValue'] = parsedValue;
  if (parsedValue.interaction) {
    return parserCtx;
  }
  // 位置参数校验
  let validateErr = argsValidate(cmd.cmdObj.args, parserCtx.argv);
  if (validateErr) {
    return { err: validateErr };
  }

  //flag校验
  validateErr = optionsValidate(opts, parserCtx.parsedValue);
  if (validateErr) {
    return { err: validateErr };
  }
  return parserCtx;
};

function processString(flagName, input) {
  if (input.length !== 1) {
    let err = {
      prompt: i18n.vTypeMatchErr,
      values: [flagName]
    };
    return { err };
  }
  return { value: input[0] };
}

function processBoolean(flagName, input) {
  let err = {};
  if (input.length === 0) {
    return { value: true };
  }
  if (input.length === 1) {
    switch (input[0]) {
    case 'true':
      return { value: true };
    case 'false':
      return { value: false };
    }
  }
  err = {
    prompt: i18n.vTypeMatchErr,
    values: [flagName]
  };
  return { err };
}

function processNumber(flagName, input) {
  if (input.length !== 1) {
    let err = {
      prompt: i18n.vTypeMatchErr,
      values: [flagName]
    };
    return { err };
  }
  let value = +input[0];
  if (isNaN(value)) {
    let err = {
      prompt: i18n.vTypeMatchErr,
      values: [flagName]
    };
    return { err };
  }
  return { value };
}

function processMap(flagName, flag, input) {
  if (input.length !== 1) {
    let err = {
      prompt: i18n.vTypeMatchErr,
      values: [flagName]
    };
    return { err };
  }
  let value = {};
  let mappingValue;
  if (input[0].startsWith('{')) {
    try {
      value = JSON.parse(input[0]);
    } catch (error) {
      let err = {
        prompt: i18n.resolveErr,
        values: [flagName, error.message]
      };
      return { err };
    }
  } else {
    let values = input[0].split(',');
    for (let data of values) {
      let pair = data.split('=');
      if (pair.length === 1) {
        let err = {
          prompt: i18n.vTypeMatchErr,
          values: [flagName]
        };
        return { err };
      }
      value[pair[0]] = pair[1];
    }
  }
  if (flag.mappingType) {
    let mappingObj = new flag.mappingType(value);
    if (Object.keys(value).length !== Object.keys(mappingObj).length) {
      let err = {
        prompt: i18n.filedErr,
        values: [flagName]
      };
      return { err };
    }
    mappingValue = mappingObj;
  } else {
    mappingValue = value;
  }
  return { value: mappingValue };
}

function numberCheck(input) {
  for (let val of input) {
    let num = +val;
    if (isNaN(num)) {
      return false;
    }
  }
  return true;
}

function processMapArray(flagName, flag, input) {
  let value = [];
  for (let data of input) {
    let result = processMap(flagName, flag, [data]);
    if (result.err && result.err.prompt) {
      return { err: result.err };
    }
    value.push(result.value);
  }
  return { value };
}

function processArray(flagName, flag, input) {
  if (input.length === 0) {
    let err = {
      prompt: i18n.vTypeMatchErr,
      values: [flagName]
    };
    return { err };
  }
  let value = [];
  if (input[0].startsWith('[')) {
    if (input.length !== 1) {
      let err = {
        prompt: i18n.mixInputErr,
        values: [flagName]
      };
      return { err };
    }
    try {
      value = JSON.parse(input[0]);
    } catch (error) {
      let err = {
        prompt: i18n.resolveErr,
        values: [flagName, error.message]
      };
      return { err };
    }
  } else {
    let result = {};
    switch (flag.subType) {
    case 'string':
    case 'number':
      result['value'] = input;
      break;
    case 'map':
      result = processMapArray(flagName, flag, input);
      break;
    }
    if (result.err && result.err.prompt) {
      return { err: result.err };
    }
    value = result.value;
  }
  if (flag.subType === 'number') {
    let ok = numberCheck(value);
    if (!ok) {
      let err = {
        prompt: i18n.vTypeMatchErr,
        values: [flagName]
      };
      return { err };
    }
  }

  if (flag.maxindex) {
    if (value.length > flag.maxindex) {
      let err = {
        prompt: i18n.outOfIndex,
        values: [flagName, flag.maxindex]
      };
      return { err };
    }
  }
  return { value };
}

function processValue(flagName, input) {
  let flag = opts[flagName];
  if (!flag.vtype) {
    flag.vtype = 'string';
  }
  let result;
  let err = {};
  switch (flag.vtype) {
  case 'string':
    result = processString(flagName, input);
    break;
  case 'boolean':
    result = processBoolean(flagName, input);
    break;
  case 'number':
    result = processNumber(flagName, input);
    break;
  case 'map':
    result = processMap(flagName, flag, input);
    break;
  case 'array':
    result = processArray(flagName, flag, input);
    break;
  default:
    err = {
      prompt: i18n.unrecognizedVType,
      values: []
    };
    return { err };
  }
  if (result.err && result.err.prompt) {
    return { err: result.err };
  }
  return { value: result.value };
}

exports.parseOne = function (args) {
  let next = false;
  let err = {};
  let arg = args[0];
  if (arg.length === 1 || !arg.startsWith('-')) {
    err = {
      prompt: i18n.unknowSyntax,
      values: [arg]
    };
    return { err };
  }
  let miners = 1;
  if (arg[1] === '-') {
    miners = 2;
  }
  arg = arg.slice(miners);
  let argSlice = arg.split('=', 2);
  let flagName = argSlice[0];
  if (!opts[flagName]) {
    err = {
      prompt: i18n.unknowFlag,
      values: ['-'.repeat(miners) + flagName]
    };
    return { err };
  }
  let input = [];
  if (argSlice.length === 2) {
    if (argSlice[1] === '') {
      err = {
        prompt: i18n.syntaxErr,
        values: ['-'.repeat(miners) + arg]
      };
      return { err };
    }
    input.push(argSlice[1]);
  }
  args = args.slice(1);
  let index = 0;
  for (; index < args.length; index++) {
    if (args[index].startsWith('-')) {
      next = true;
      break;
    }
    input.push(args[index]);
  }
  args = args.slice(index);
  let result = processValue(flagName, input);
  if (result.err && result.err.prompt) {
    return { err: result.err };
  }
  return { next, args, flagName, value: result.value };
};

exports.transOpts = function (options, opts) {
  if (!opts) {
    opts = { _required: [], _optional: [], _transed: [], _unchanged: [] };
  }
  let subs = Object.keys(options || {});
  for (let optionName of subs) {
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