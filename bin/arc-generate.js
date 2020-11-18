#!/usr/bin/env node

'use strict';
const fs = require('fs');
const path = require('path');
const DSL = require('@darabonba/parser');
const teaInstall = require('@darabonba/cli/commands/install.js');
const daraRootPath = path.join(__dirname, '../dara');
let libPath = path.join(daraRootPath, '.libraries.json');
let nodePkg = '';
let productTeaFile = {};
let libMap = {};
let configModule = '';
let moduleName = '';
let apiName = '';
let generatePath = '';
let modelName = '';

// arc-generate <包名> <api> <生成路径>

async function install() {
  process.chdir(daraRootPath);
  if (fs.existsSync(libPath)) {
    libMap = require(libPath);
    if (libMap[moduleName]) {
      return;
    }
  }
  let argv = [moduleName];
  console.log(libMap);
  await teaInstall.exec({}, {}, argv);
  let buf = fs.readFileSync(libPath, 'utf8');
  libMap = JSON.parse(buf);
  process.chdir(path.join(daraRootPath, libMap[moduleName]));
  await teaInstall.exec({}, {}, []);
}

function getConfigPackage(astExtend) {
  let configPkgName = productTeaFile.libraries[astExtend];
  let configTeaFilePath = path.join(daraRootPath, libMap[configPkgName], 'Teafile');
  let configTeafile = JSON.parse(fs.readFileSync(configTeaFilePath));
  let configPackage = configTeafile.releases.ts.split(':')[0];
  return configPackage;
}

function getOptionName(key) {
  let hasDash = false;
  let optionName = '';
  for (let i = 0; i < key.length; i++) {
    let ch = key[i];
    if (/[A-Z]/.test(ch)) {
      if (hasDash) {
        optionName = optionName + '-' + ch.toLowerCase();
      } else {
        optionName += ch.toLowerCase();
      }
      continue;
    }
    optionName += ch;
    hasDash = true;
  }
  return optionName;
}

function processArrayType(field, prefix) {
  if (!field.fieldValue.fieldItemType.nodes) {
    return `vtype: 'array',
    subType: '${field.fieldValue.fieldItemType.lexeme}',
    options: {
      element: {
        desc: {
          zh: '',
          en: ''
        }
      }
    }`;
  }
  let str = field.fieldName.lexeme;
  let fieldName = str.slice(0, 1).toUpperCase() + str.slice(1);
  return `vtype: 'array',
  subType: 'map',
  mappingType: require('${nodePkg}').${prefix}${fieldName},
  ${getOptions(field.fieldValue.fieldItemType.nodes, prefix + fieldName)}
`;
}

function processMapType(field, prefix) {
  let str = field.fieldName.lexeme;
  let fieldName = str.slice(0, 1).toUpperCase() + str.slice(1);
  return `vtype: 'map',
  mappingType: require('${nodePkg}').${prefix}${fieldName},
  ${getOptions(field.fieldValue.nodes, prefix + fieldName)}
`;
}

function getNumber() {
  return `vtype: 'number',
  desc: {
    zh: '',
    en: ''
  }`;
}

function getType(field, prefix) {
  switch (field.fieldValue.fieldType) {
  case 'integer':
  case 'int64':
    return getNumber();
  case 'array':
    return processArrayType(field, prefix);
  case undefined:
    return processMapType(field, prefix);
  default:
    return `vtype: '${field.fieldValue.fieldType}',
    desc: {
      zh: '',
      en: ''
    }`;
  }
}

function getOption(field, prefix) {
  let optionName = getOptionName(field.fieldName.lexeme);
  let optionType = getType(field, prefix);
  let optionRequired = field.required;
  let optStr = `
  '${optionName}':{
    mapping: '${field.fieldName.lexeme}',
    required: ${optionRequired},
    ${optionType}
  `;
  optStr += '},';
  return optStr;
}

function getOptions(nodes, prefix) {
  let optStr = 'options: {';
  for (let field of nodes) {
    if (field.type !== 'modelField') {
      continue;
    }
    optStr += getOption(field, prefix);
  }
  optStr += '},';
  return optStr;
}
function parseArgs(node) {
  let index = 0;
  let args = [];
  for (let param of node.params.params) {
    let arg = {};
    if (param.paramType.idType === 'model') {
      arg.hidden = true;
      arg.value = 'request';
    }
    if (param.paramName.lexeme === 'headers') {
      arg.hidden = true;
      arg.value = '{}';
    }
    if (param.paramType.type === 'moduleModel') {
      arg.hidden = true;
      arg.value = 'runtime.getRuntimeOption()';
    }
    if (!arg.hidden) {
      arg.name = param.paramName.lexeme;
      arg.type = param.paramType.lexeme;
      arg.value = `ctx.argv[${index}]`;
      index++;
    }
    args.push(arg);
  }
  return args;
}

function parseFunction(nodes) {
  let functionName = apiName.slice(0, 1).toLowerCase() + apiName.slice(1) + 'WithOptions';
  let parsedOk = false;
  for (let node of nodes) {
    if (node.type === 'function' && node.functionName.lexeme === functionName) {
      parsedOk = true;
      return parseArgs(node);
    }
  }
  if (!parsedOk) {
    console.log('方法匹配错误：', functionName);
    process.exit(-1);
  }
  return [];
}

function getCmdObj(fields, args) {
  let optStr = '';
  if (fields) {
    optStr = getOptions(fields);
  }
  let argStr = 'args: [';
  for (let arg of args) {
    if (arg.hidden) {
      continue;
    }
    let str = `{
      name: '${arg.name}',
      required: true
    },
`;
    argStr += str;
  }
  argStr += '],';
  let cmdObj = `'use strict';
let { default: Client } = require('${nodePkg}');
let runtime = require('../../../../../lib/runtime.js');
let output = require('../../../../../lib/output.js');

exports.cmdObj={
  desc: {
    zh: '',
    en: ''
  },
  ${optStr}
  ${argStr}
};`;
  return cmdObj;
}

function getRunFunction(configModule, args, fields) {
  let requrestStr = '';
  if (fields) {
    requrestStr = `let ${modelName} = require('${nodePkg}').${modelName};
    let request = new ${modelName}(ctx.mappingValue);  `;
  }
  let functionName = apiName.slice(0, 1).toLowerCase() + apiName.slice(1) + 'WithOptions';
  let argStr = [];
  for (let arg of args) {
    argStr.push(arg.value);
  }
  let str = argStr.join(', ');
  return `exports.run = async function (ctx) {
    let profile = await runtime.getConfigOption(ctx.profile);
    let { Config } = require('${configModule}');
    let config = new Config({
      accessKeyId: profile.access_key_id,
      accessKeySecret: profile.access_key_secret,
      securityToken: profile.sts_token,
      regionId: profile.region,
      type: profile.type
    });
    ${requrestStr}
    let client = new Client(config);
    let result;
    try {
      result = await client.${functionName}(${str});
    } catch (e) {
      output.error(e.message);
    }
    let data = JSON.stringify(result, null, 2);
    output.log(data);
  };`;
}

function generate() {
  let filePath = path.join(daraRootPath, libMap[moduleName], 'main.tea');
  let productTeaFilePath = path.join(daraRootPath, libMap[moduleName], 'Teafile');
  productTeaFile = JSON.parse(fs.readFileSync(productTeaFilePath));
  nodePkg = productTeaFile.releases.ts.split(':')[0];
  let dsl = fs.readFileSync(filePath, 'utf8');
  const ast = DSL.parse(dsl, filePath);
  let astExtend = ast.extends.lexeme;
  configModule = getConfigPackage(astExtend);
  modelName = apiName + 'Request';
  let cmdObj = '';
  let args = parseFunction(ast.moduleBody.nodes);
  let fields = {};
  if (!ast.models[modelName]) {
    console.log('没有此接口存在：', modelName);
    fields = undefined;
  } else {
    fields = ast.models[modelName].modelBody.nodes;
  }
  cmdObj = getCmdObj(fields, args);
  let funcitonStr = getRunFunction(configModule, args, fields);

  fs.writeFileSync(path.join(__dirname, generatePath), cmdObj + '\n' + funcitonStr);
}

async function run() {
  await install();
  generate();
}

let inputArgs = process.argv.slice(2);
if (inputArgs.length !== 3) {
  console.error('参数不完整'),
  process.exit(-1);
}
moduleName = inputArgs[0];
apiName = inputArgs[1];
generatePath = inputArgs[2];

run();



