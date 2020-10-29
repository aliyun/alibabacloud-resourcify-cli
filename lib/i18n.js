'use strict';

exports.missPositionArgErr = {
  zh: '缺少必要位置参数',
  en: 'Missing required position parameter'
};
exports.unknowPositionArgErr = {
  zh: `未知位置参数 '%s'，位置参数数量应为 %d`,
  en: `Unknown positional parameters '%s', expect %d positional parameters`
};
exports.positionArgValueErr = {
  zh: `未知参数 '%s' 可选值为 %s`,
  en: `Position parameter '%s' has optional values: %s `
};
exports.unknowSyntax = {
  zh: `'%s' 是未知选项格式`,
  en: `'%s' is an unknown parameter format`
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
  zh: `选项 '%s' 的值json解析失败: %s`,
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
exports.requireOptionErr={
  zh:'缺少必选参数：%s',
  en:`Missing required parameters: %s`
};
exports.notNumberErr = {
  zh: '值不为Number类型',
  en: `Value is not of type Number`
};
exports.conflictErr = {
  zh: '选项冲突，%s 只能选择其中一个',
  en: `Options conflict, %s can only choose one of them`
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
  zh: `是否继续配置 %s`,
  en: `Whether to continue to configure %s`
};
