'use strict';

const { _dir } = require('./utils');
const jmespath =  require('jmespath');
const json2yaml = require('json2yaml');
const Json2csvParser = require('json2csv').Parser;
const cTable = require('console.table');
const path = require('path');
const fs = require('fs');
const promisify = require('util').promisify;

const writeFile = promisify(fs.writeFile);

//convert by format
function convertFormat(format, jsonObj) {
  if(!jsonObj) {
    return 'result is empty';
  }
  // default json 
  format = format || 'json';
  let result = '';

  if(format === 'yaml') {
    // yaml 
    result = json2yaml.stringify(jsonObj);
  } else if(format === 'csv') {
    // csv
    if(Array.isArray(jsonObj)) {
      if(jsonObj.length > 0 && typeof (jsonObj[0]) === 'object') {
        const fields = Object.keys(jsonObj[0]);
        const json2csvParser = new Json2csvParser({fields});
        result = json2csvParser.parse(jsonObj);
      } else {
        console.log('output result is empty or item is not object');
      }
    } else {
      console.log('output result is not Array');
    }
  } else if(format === 'table') {
    // table
    if(Array.isArray(jsonObj)) {
      result = cTable.getTable(jsonObj);
    } else {
      console.log('output result is not Array');
    }
  } else if(format === 'json') {
    // json
    result = JSON.stringify(jsonObj, null, 2);
  } else {
    console.log(`format ${format} is not supported`);
  }

  return result;
}

// query by jmespath
function query(jsonObj, query) {
  return jmespath.search(jsonObj, query);
}

exports.output = async function(result, outPutPath) {
  const abPath = path.resolve(outPutPath);
  const outputDir = path.dirname(abPath);
  await _dir(outputDir);
  await writeFile(abPath, result);
  console.log(`output to ${abPath}`);
};

exports.display = function(data, program) {
  let jsonObj = JSON.parse(data);
  // query by jmespath
  if(program.query) {
    jsonObj = query(jsonObj, program.query);
  }

  //convert by format
  let result = convertFormat(program.format, jsonObj);
  return result;
};
