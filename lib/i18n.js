'use strict';

exports.missPositionArgErr = {
  zh: '缺少必要位置参数 <%s>',
  en: 'Missing required position parameter <%s>'
};
exports.unknowPositionArgErr = {
  zh: `未知位置参数 '%s'，位置参数数量应为 %d`,
  en: `Unknown positional parameters '%s', expect %d positional parameters`
};
exports.positionArgValueErr = {
  zh: `未知参数 '%s' 可选值为 %s`,
  en: `Position parameter '%s' has optional values: %s `
};
exports.unknowFlag = {
  zh: `未知选项 '%s'`,
  en: `Unknow flag option '%s'`
};
exports.syntaxErr = {
  zh: `选项格式错误：'%s'`,
  en: `Flag syntax error: '%s'`
};
exports.unrecognizedVType = {
  zh: '未识别的参数值类型',
  en: 'Unrecognized parameter value type'
};
exports.vTypeMatchErr = {
  zh: `选项 '%s' 的输入值类型不符合`,
  en: `The input value type of '%s' does not match`
};
exports.resolveErr = {
  zh: `选项 '%s' 的值json解析失败`,
  en: `The parameter value of flag '%s' cannot be resolved: %s`
};
exports.mixInputErr = {
  zh: `选项 '%s' 混合输入无法被识别`,
  en: `The mixed input of flag '%s' cannot be recognized`
};
exports.filedErr = {
  zh: `选项 '%s' 的输入结构与定义不符`,
  en: `The parameter value field of flag '%s' is incorrect`
};
exports.emptyValueErr = {
  zh: '该参数值不能为空',
  en: `The parameter value cannot be empty`
};
exports.notNumberErr = {
  zh: '值不为Number类型',
  en: `Value is not of type Number`
};
exports.outOfIndex = {
  zh: `选项 '%s' 的输入值元素过多，最长支持元素数量：%d`,
  en: `The number of '%s' values is too long, the longest should be: %d`
};
exports.isRunPromt = {
  zh: `是否执行`,
  en: `Whether to execute`
};
exports.conflictPromt = {
  zh: `以下选项具有冲突，请选择其中一项`,
  en: `The following options conflict, please choose one`
};
exports.isConfigPromt = {
  zh: `是否配置 %s`,
  en: `Whether to configure %s`
};
exports.continueConfigPromt = {
  zh: `是否继续配置第 %d 个 %s`,
  en: `Whether to continue to configure the %d %s`
};

// interactive input prompt
exports.arrayInputPrompt = {
  zh: '该参数为数组形式, 元素数量上限为 %d',
  en: 'This parameter is in the form of an array, and the upper limit of the number of elements is %d'
};
exports.conditionNotMetPrompt = {
  zh: '该参数需满足以下条件方可生效',
  en: 'This parameter must meet the following conditions to be effective'
};
exports.requiredConditionPrompt={
  zh: '该参数需满足以下条件时必填',
  en: 'This parameter is required when the following conditions are met'
};
exports.optionalPrompt = {
  zh: '请选择可选配置或结束配置',
  en: 'Please select optional configuration or end configuration'
};
exports.runAndShowPrompt={
  zh:'显示并执行命令',
  en:'Display and execute commands'
};
exports.showPrompt={
  zh:'显示但不执行命令',
  en:'Show but do not execute commands'
};

// option validate error
exports.hiddenOptionErr = {
  zh: '参数 %s 不可用',
  en: 'option %s is not available'
};
exports.requireOptionErr = {
  zh: '缺少必选参数：%s',
  en: `Missing required parameters: %s`
};

// relation error
exports.equalRelationErr = {
  zh: '当 %s 的值等于 %s',
  en: 'When the value of %s is equal to %s'
};

exports.anyRelationErr = {
  zh: '当 %s 值被指定',
  en: 'When the %s value is specified'
};

exports.conflictErr = {
  zh: '选项 %s 冲突',
  en: 'Conflicting option %s'
};

exports.includeRelationErr = {
  zh: '当 %s 值包含 %s',
  en: 'When the %s value contains %s'
};

exports.noIncludeRelationErr = {
  zh: '当 %s 值不包含 %s',
  en: 'When the %s value does not contain %s'
};

// helper prompt
exports.usagePrompt = {
  zh: '用法',
  en: 'usage'
};
exports.commandPrompt = {
  zh: '子命令',
  en: 'command'
};
exports.optionsPrompt = {
  zh: '选项',
  en: 'options'
};
exports.requiredPrompt = {
  zh: '必选',
  en: 'required'
};
exports.optionValuePrompt = {
  zh: '可选值',
  en: 'optional value'
};
exports.examplePrompt = {
  zh: '示例值',
  en: 'example'
};

// keyWord
exports.orKeyWord = {
  zh: '或',
  en: 'or'
};
exports.concatPromt = function (err1, err2) {
  if (!err1) {
    return err2;
  }
  return {
    zh: err1.zh + '\n' + err2.zh,
    en: err1.en + '\n' + err2.en
  };
};