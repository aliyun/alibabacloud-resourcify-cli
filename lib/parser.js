'use strict';

const path = require('path');
const fs = require('fs');
const rootCmd = require('../cmds/meta.js');
let i18n = require('./i18n.js');

class Parse {
  constructor(ctx) {
    this.args = ctx['args'];
    this.cmdFilePath = ctx.cmdFilePath;
    this.profileName = ctx.profileName;
    this.profile = ctx.profile;
    this.parsedValue = {};
    this.mappingValue = {};
    this.cmds = [];
    this.help = false;
    this.options = {};
  }

  parse() {
    let parserCtx = this.cmdParser(this.args, this.cmdFilePath);
    this.cmds = parserCtx.cmds;
    this.help = parserCtx.help;
    this.args = parserCtx.args;
    this.cmdFilePath = path.join(this.cmdFilePath, ...this.cmds) + '.js';
    let cmd = require(this.cmdFilePath);
    if (this.help) {
      return;
    }
    if (!cmd.run) {
      this.help = true;
      return;
    }
    let argvCtx = this.argvParse(this.args);
    this.args = argvCtx.args;
    this.argv = argvCtx.argv;
    this.options = this.addAlias(cmd.cmdObj.options);
    this.options = this.addAlias(rootCmd.cmdObj.options, this.options);
    let err = this.parseFlag(this.args);
    if (err) {
      return { err };
    }

    // 关系校验
    let optNames = Object.keys(this.options) || {};
    for (let optName of optNames) {
      let err = this.optionValidate(optName);
      if (err) {
        return { err };
      }
    }

    // mapping 映射
    this.valueToAPIStruct(this.options, this.parsedValue, this.mappingValue);

    // return
  }

  valueToAPIStruct(options, values, mappingValue) {
    if (!mappingValue) {
      mappingValue = {};
    }
    let valueTmp;
    let keys = Object.keys(values);
    for (let key of keys) {
      valueTmp = mappingValue;
      let option = options[key];
      if (!option.mapping) {
        continue;
      }
      // 分割mapping
      let mappingNames = option.mapping.split('.');
      let name = mappingNames[mappingNames.length - 1];
      for (let i = 0; i < mappingNames.length - 1; i++) {
        valueTmp[mappingNames[i]] = {};
        valueTmp = valueTmp[mappingNames[i]];
      }
      // 赋值
      if (option.options) {
        if (option.vtype === 'array') {
          let arrayValues = [];
          for (let v of values[key]) {
            let value = this.valueToAPIStruct(option.options, v);
            arrayValues.push(value);
          }
          valueTmp[name] = arrayValues;
        } else {
          valueTmp[name] = {};
          this.valueToAPIStruct(option.options, values[key], valueTmp[name]);
        }
      } else {
        if (name) {
          valueTmp[name] = values[key];
          continue;
        }
      }
    }
    return valueTmp;
  }

  optionValidate(name) {
    let { option, value } = this.getOptionByName(name);
    // hidden check
    if (option.hidden) {
      if (value !== undefined) {
        return {
          prompt: i18n.hiddenOptionErr,
          values: [name]
        };
      }
      return;
    }

    // required check
    if (option.required && value === undefined) {
      return {
        prompt: i18n.requireOptionErr,
        values: [name]
      };
    }

    // array.length
    if (option.vtype === 'array') {
      if (option.maxindex && value.length > option.maxindex) {
        return {
          prompt: i18n.outOfIndex,
          values: [name]
        };
      }
    }

    // relation check
    let err = this.relationCheck(name, option, value);
    if (err) {
      return err;
    }
    if (option.options) {
      let optNames = [];
      if (option.vtype === 'array') {
        for (let i = 0; i < value.length; i++) {
          optNames.push(i);
        }
      } else {
        optNames = Object.keys(option.options) || {};
      }
      for (let optName of optNames) {
        let err = this.optionValidate([name, optName].join('.'));
        if (err) {
          return err;
        }
      }
    }
  }

  relationCheck(optName, option, value) {
    if (!option.relations) {
      return;
    }
    let values;
    if (option.vtype !== 'array') {
      values = [value];
    } else {
      values = value;
    }
    for (let v of values) {
      for (let relation of option.relations) {
        switch (relation.type) {
        case 'equal':
          if (v !== relation.value) {
            continue;
          }
          break;
        case 'any':
          if (v === undefined) {
            continue;
          }
        }
        let err = this.actionProcess(relation, optName, value);
        if (err) {
          return err;
        }
      }
    }
  }

  actionProcess(relation, optName, value) {
    let options = relation.options;
    let optNames = Object.keys(options);
    for (let name of optNames) {
      let { option } = this.getOptionByName(name);
      for (let field of Object.keys(options[name])) {
        option[field] = options[name][field];
      }
      let err = this.optionValidate(name);
      if (err !== undefined) {
        let result = this.getRelationErr(relation, optName, value);
        return {
          prompt: i18n.concatPromt(result.prompt, err.prompt),
          values: result.values.concat(err.values)
        };
      }
    }
  }

  getRelationErr(relation, optName, value) {
    switch (relation.type) {
    case 'equal':
      return {
        prompt: i18n.equalRelationErr,
        values: [optName, value]
      };
    case 'any':
      return {
        prompt: i18n.anyRelationErr,
        values: [optName]
      };
    }
  }

  getOptionByName(name) {
    let options = this.options;
    let value = this.parsedValue;
    let names = name.split('.');
    let option;
    for (let i = 0; i < names.length; i++) {
      if (option && option.vtype === 'array') {
        option = {
          vtype: option.subType,
          options: option.options
        };
      } else {
        option = options[names[i]];
      }
      if (names[i + 1]) {
        options = option.options;
      }
      if (value !== undefined) {
        if (option.vtype === 'array' && !isNaN(+names[i])) {
          names[i] = +names[i];
        }
        value = value[names[i]];
      }
    }
    return { option, value };
  }

  cmdParser(args, cmdFilePath) {
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

  argvParse(args) {
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

  addAlias(addOptions, options) {
    if (!options) {
      options = {};
    }
    for (let optName of Object.keys(addOptions || {})) {
      let option = addOptions[optName];
      if (option.alias && !options[option.alias]) {
        options[option.alias] = optName;
      }
      if (options[optName]) {
        continue;
      }
      if (option.options) {
        option.options = this.addAlias(option.options);
      }
      options[optName] = option;
    }
    return options;
  }

  parseFlag() {
    for (; ;) {
      if (this.args.length === 0) {
        break;
      }
      // let index = 0;
      let err = this.parseOne(this.args);
      if (err) {
        return err;
      }
    }
  }

  parseOne(args) {
    let arg = args[0];
    let miners = 1;
    if (arg[1] === '-') {
      miners = 2;
    }
    arg = arg.slice(miners);
    let argSlice = arg.split('=', 2);
    let optName = argSlice[0];
    let input = [];
    if (argSlice.length === 2) {
      input.push(argSlice[1]);
    }
    args = args.slice(1);
    let index = 0;
    for (; index < args.length; index++) {
      if (args[index].startsWith('-')) {
        break;
      }
      input.push(args[index]);
    }
    let obj = this.parsedValue;
    let names = optName.split('.');
    let options = this.options;
    let option;
    let currentOptName = '';
    for (let i = 0; i < names.length; i++) {
      currentOptName = names[i];
      if (option && option.vtype === 'array') {
        option = {
          vtype: option.subType,
          options: option.options
        };
        currentOptName = +currentOptName;
        if (isNaN(currentOptName)) {
          return {
            prompt: i18n.unknowFlag,
            values: ['--' + names.join('.')]
          };
        }
      } else {
        option = options[currentOptName];
        if (!option) {
          return {
            prompt: i18n.unknowFlag,
            values: ['--' + names.join('.')]
          };
        }
      }
      if (typeof (option) === 'string') {
        option = options[option];
      }
      options = option.options;

      let values = this.initValue(option.vtype);
      if (obj[currentOptName] === undefined) {
        if (Array.isArray(obj)) {
          obj.push(values);
        } else {
          obj[currentOptName] = values;
        }
      }
      if (names[i + 1] && values !== '') {
        obj = obj[currentOptName];
      }
    }
    let err = this.processValue(obj, option, currentOptName, input);
    if (err) {
      err.values.push('--' + names.join('.'));
      return err;
    }
    this.args = args.slice(index);
  }

  processValue(obj, option, flagName, input) {
    if (!option.vtype) {
      option.vtype = 'string';
    }
    let result;
    switch (option.vtype) {
    case 'string':
      result = this.processString(input);
      break;
    case 'boolean':
      result = this.processBoolean(input);
      break;
    case 'number':
      result = this.processNumber(input);
      break;
    case 'map':
      result = this.processMap(input);
      break;
    case 'array':
      result = this.processArray(option, input);
    }
    if (result.err && result.err.prompt) {
      return result.err;
    }
    obj[flagName] = result.value;
  }

  processString(input) {
    if (input.length !== 1) {
      let err = {
        prompt: i18n.vTypeMatchErr,
        values: []
      };
      return { err };
    }
    return { value: input[0] };
  }

  processBoolean(input) {
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
      values: []
    };
    return { err };
  }

  processNumber(input) {
    if (input.length !== 1) {
      let err = {
        prompt: i18n.vTypeMatchErr,
        values: []
      };
      return { err };
    }
    let value = +input[0];
    if (isNaN(value)) {
      let err = {
        prompt: i18n.vTypeMatchErr,
        values: []
      };
      return { err };
    }
    return { value };
  }

  processMap(input) {
    if (input.length !== 1) {
      let err = {
        prompt: i18n.vTypeMatchErr,
        values: []
      };
      return { err };
    }
    let value = {};
    if (input[0].startsWith('{')) {
      try {
        value = JSON.parse(input[0]);
      } catch (error) {
        let err = {
          prompt: i18n.resolveErr,
          values: []
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
            values: []
          };
          return { err };
        }
        value[pair[0]] = pair[1];
      }
    }
    return { value };
  }

  processArray(option, input) {
    if (input.length === 0) {
      let err = {
        prompt: i18n.vTypeMatchErr,
        values: []
      };
      return { err };
    }
    let value = [];
    if (input[0].startsWith('[')) {
      if (input.length !== 1) {
        let err = {
          prompt: i18n.mixInputErr,
          values: []
        };
        return { err };
      }
      try {
        value = JSON.parse(input[0]);
      } catch (error) {
        let err = {
          prompt: i18n.resolveErr,
          values: []
        };
        return { err };
      }
    } else {
      let result = {};
      switch (option.subType) {
      case 'string':
      case 'number':
        result['value'] = input;
        break;
      case 'map':
        result = this.processMapArray(input);
        break;
      }
      if (result.err && result.err.prompt) {
        return { err: result.err };
      }
      value = result.value;
    }
    if (option.subType === 'number') {
      let { ok, numberList } = this.stringToNumber(value);
      if (!ok) {
        let err = {
          prompt: i18n.vTypeMatchErr,
          values: []
        };
        return { err };
      }
      value = numberList;
    }
    return { value };
  }

  processMapArray(input) {
    let value = [];
    for (let data of input) {
      let result = this.processMap([data]);
      if (result.err && result.err.prompt) {
        return { err: result.err };
      }
      value.push(result.value);
    }
    return { value };
  }

  stringToNumber(input) {
    let numberList = [];
    for (let val of input) {
      let num = +val;
      if (isNaN(num)) {
        return { ok: false, numberList };
      }
      numberList.push(num);
    }
    return { ok: true, numberList };
  }

  initValue(type) {
    switch (type) {
    case 'string':
    case 'number':
    case 'boolean':
      return '';
    case 'array':
      return [];
    case 'map':
      return {};
    }
  }
}
module.exports = Parse;