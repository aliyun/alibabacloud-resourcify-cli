/**
 * 命令行解析
 * 支持子选项使用 . 分割，例如指定flag下面的子选项sub-flag
 * 可以使用 --flag.sub-flag <value>
 * 对于数组类型选项值，使用数字作为中间选项名，从0开始
 * 例如指定string数组:--flag.0 --flag.1
 * 例如指定map型数组：--flag.0.key --flag.0.value
 */
'use strict';

const path = require('path');
const fs = require('fs');
const rootCmd = require('../cmds/meta.js');
const jsonpath = require('../lib/jsonFilter.js');
let config = require('./config.js');
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

  // 主要解析逻辑
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
      return err;
    }
    // 对于unchanged选项，用户指定无效，直接写入
    for (let optName of Object.keys(this.options)) {
      if (this.options[optName].unchanged) {
        this.setValueByName(optName, [this.options[optName].default]);
      }
    }

    if (this.parsedValue.profile) {
      this.profileName = this.parsedValue.profile;
      let result = config.getProfile(this.profileName);
      this.profile = result.profile;
    }

    if (this.parsedValue.region === undefined) {
      this.parsedValue.region = this.profile.region;
    } else {
      this.profile.region = this.parsedValue.region;
    }

    if (this.parsedValue.interaction) {
      return;
    }

    if (cmd.cmdObj.conflicts) {
      err = this.conflictValidate(cmd.cmdObj.conflicts);
      if (err) {
        return err;
      }
    }

    let optNames = Object.keys(this.options) || {};
    for (let optName of optNames) {
      let err = this.optionValidate(optName);
      if (err) {
        return err;
      }
    }

    this.valueToAPIStruct(this.options, this.parsedValue, this.mappingValue);
  }

  // 冲突选项校验
  conflictValidate(conflicts) {
    for (let conflict of conflicts) {
      let hasValue = false;
      let isConflicts = false;
      for (let optName of conflict.optNames) {
        let { value } = this.getOptionByName(optName);
        if (value) {
          if (hasValue) {
            isConflicts = true;
            break;
          } else {
            hasValue = true;
          }
        }
      }
      if (isConflicts) {
        return {
          prompt: i18n.conflictErr,
          values: [conflict.optNames.join(' | ')]
        };
      }
      if (conflict.required && !hasValue) {
        return {
          prompt: i18n.requireOptionErr,
          values: [conflict.optNames.join(' | ')]
        };
      }
    }
  }

  // 将解析的数据转换为sdk所需结构
  valueToAPIStruct(options, values, mappingValue) {
    options = options || [];
    if (!mappingValue) {
      mappingValue = {};
    }
    let valueTmp;
    let keys = Object.keys(values);
    for (let key of keys) {
      valueTmp = mappingValue;
      let option = options[key];
      if (!option || !option.mapping) {
        continue;
      }
      // 分割mapping
      let mappingNames = option.mapping.split('.');
      let name = mappingNames[mappingNames.length - 1];
      for (let i = 0; i < mappingNames.length - 1; i++) {
        if (!valueTmp[mappingNames[i]]) {
          valueTmp[mappingNames[i]] = {};
        }
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

  // 选项校验
  optionValidate(name) {
    let { option, value } = this.getOptionByName(name);

    let attributes;
    // 条件检查
    if (option.attributes) {
      attributes = this.changeAttribute(option.attributes);
      if (attributes.show) {
        option.show = false;
        if (attributes.show.changed) {
          option.show = true;
        }
      }
      if (attributes.required) {
        option.required = false;
        if (attributes.required.changed) {
          option.required = true;
        }
      }
    }

    if (option.show === false) {
      return;
    }

    if (option.maxindex && value) {
      if (value.length > option.maxindex) {
        return {
          prompt: i18n.outOfIndex,
          values: [name, option.maxindex]
        };
      }
    }

    // required check
    if (option.required && value === undefined) {
      let err = {
        values: []
      };
      if (attributes && attributes.required && attributes.required.condition) {
        err = this.getConditionPrompt(attributes.required.condition);
      }
      return {
        prompt: i18n.concatPromt(err.prompt, i18n.requireOptionErr),
        values: err.values.concat([name])
      };
    }

    if(value && option.vtype === 'map' || option.subType === 'map') {
      const optKeys = Object.keys(option.options) || [];
      for(let i = 0; i< optKeys.length; i++) {
        const key = optKeys[i];
        const subValidate = this.optionValidate(`${name}.${key}`);
        if(subValidate) {
          return subValidate;
        }
      }
    }

  }

  // 根据解析数据，更新选项参数定义
  changeAttribute(attributes) {
    let attributesChanged = {};
    for (let attribute of Object.keys(attributes)) {
      switch (attribute) {
      case 'show':
        attributesChanged.show = this.getAttribute(attributes[attribute], attribute);
        break;
      case 'required':
        attributesChanged.required = this.getAttribute(attributes[attribute], attribute);
      }
    }
    return attributesChanged;
  }

  getAttribute(conditions, attrName) {
    let changed;
    let optName;
    for (let condition of conditions) {
      changed = true;
      for (optName of Object.keys(condition)) {
        let { option, value } = this.getOptionByName(optName);
        let ok = this.conditionCheck(value, condition[optName]);
        if (!ok) {
          changed = false;
          break;
        }
        if (attrName === 'show') {
          if (option.attributes && option.attributes.show) {
            let result = this.getAttribute(option.attributes.show);
            if (!result.changed) {
              changed = false;
              break;
            }
          }
        }
      }
      if (changed) {
        return { changed, condition };
      }
    }
    return { changed };
  }

  conditionCheck(value, condition) {
    let checkList = [];
    switch (condition.type) {
    case 'equal':
      checkList = [];
      // 判断是否是数组，数组表明是同个字段有多个 equal 逻辑
      if (Array.isArray(condition.value)) {
        checkList = condition.value;
      } else {
        checkList.push(condition.value);
      }
      for(let i = 0; i< checkList.length; i++) {
        if(value === checkList[i]) {
          return true;
        }
      }
      return false;
    case 'any':
      if (value !== undefined) {
        return true;
      }
      return false;
    case 'include':
      if (value === undefined) {
        return false;
      }
      checkList = [];
      // 判断是否是数组，数组表明是同个字段有多个 include 逻辑
      if (Array.isArray(condition.value)) {
        checkList = condition.value;
      } else {
        checkList.push(condition.value);
      }
      for(let i = 0; i< checkList.length; i++) {
        if (value.includes(checkList[i])) {
          return true;
        }
      }
      return false;
    case 'noInclude':
      if (value === undefined) {
        return true;
      }
      // 判断是否是数组，数组表明是同个字段有多个 noInclude 逻辑
      if (Array.isArray(condition.value)) {
        checkList = condition.value;
      } else {
        checkList.push(condition.value);
      }
      for(let i = 0; i< checkList.length; i++) {
        if (value.includes(checkList[i])) {
          return false;
        }
      }
      return true;
    }
  }

  // 根据条件，获取提示
  getConditionPrompt(conditions) {
    let err = {
      values: []
    };
    for (let optName of Object.keys(conditions)) {
      let condition = conditions[optName];
      switch (condition.type) {
      case 'equal':
        err = {
          prompt: i18n.concatPromt(err.prompt, i18n.equalRelationErr),
          values: err.values.concat([optName, condition.value])
        };
        break;
      case 'any':
        err = {
          prompt: i18n.concatPromt(err.prompt, i18n.anyRelationErr),
          values: err.values.concat([optName])
        };
        break;
      case 'include':
        err = {
          prompt: i18n.concatPromt(err.prompt, i18n.includeRelationErr),
          values: err.values.concat([optName, condition.value])
        };
        break;
      case 'noInclude': 
        err = {
          prompt: i18n.concatPromt(err.prompt, i18n.noIncludeRelationErr),
          values: err.values.concat([optName, condition.value])
        };
      }
    }
    return err;
  }

  // 根据flagName设置值
  setValueByName(optName, value, options) {
    let obj = this.parsedValue;
    let names = optName.split('.');
    options = options || this.options;
    let input = value;
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
        currentOptName = option;
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
      err.values.push('--' + optName);
    }
    return err;
  }

  // 根据名称获取选项定义及当前值
  getOptionByName(name) {
    let options = this.options;
    let nameTmp = name.replace(/\[/g, '.');
    nameTmp = nameTmp.replace(/\]/g, '');
    let names = nameTmp.split('.');
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
    }
    let value = jsonpath.search(this.parsedValue, name);
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
    let err = this.setValueByName(optName, input);
    if (err) {
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
      case true:
        return { value: true };
      case 'false':
      case false:
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

  transOpts(cmdObj) {
    let index = [];
    let endRequiredIndex = -1;
    if (!cmdObj.options) {
      return { index, endRequiredIndex };
    }
    this.options = cmdObj.options;
    let options = this.options;
    let requiredIndex = [];
    let optionalIndex = [];
    let transed = [];
    if (cmdObj.conflicts) {
      for (let conflict of cmdObj.conflicts) {
        transed.push(...conflict.optNames);
        if (conflict.required) {
          requiredIndex.push(conflict.optNames);
          for (let optName of conflict.optNames) {
            this.options[optName].required = true;
          }
        } else {
          optionalIndex.push(conflict.optNames);
        }
      }
    }
    for (let optName of Object.keys(options)) {
      if (transed.includes(optName)) {
        continue;
      }
      transed.push(optName);
      let option = options[optName];
      if (option.unchanged) {
        this.setValueByName(optName, [option.default]);
        continue;
      }
      if (option.required) {
        if (option.index !== undefined) {
          if (requiredIndex[option.index]) {
            requiredIndex.push(requiredIndex[option.index]);
          }
          requiredIndex[option.index] = optName;
        } else {
          requiredIndex.push(optName);
        }
      } else {
        if (option.index !== undefined) {
          if (optionalIndex[option.index]) {
            optionalIndex.push(optionalIndex[option.index]);
          }
          optionalIndex[option.index] = optName;
        } else {
          optionalIndex.push(optName);
        }
      }
      if (option.attributes && option.attributes.required) {
        for (let condition of option.attributes.required) {
          for (let k of Object.keys(condition)) {
            let result = this.getOptionByName(k);
            result.option.affect = result.option.affect || [];
            result.option.affect.push(optName);
          }
        }
      }
    }
    for (let name of requiredIndex) {
      if (name) {
        index.push(name);
        endRequiredIndex++;
      }
    }
    for (let name of optionalIndex) {
      if (name) {
        index.push(name);
      }
    }
    return { index, endRequiredIndex };
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