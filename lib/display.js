'use strict';

// third modules
const jmespath = require('jmespath');
const json2yaml = require('json2yaml');
const Json2csvParser = require('json2csv').Parser;
const cTable = require('console.table');

// convert by format
function convertFormat(format = 'json', jsonObj) {
  if (!jsonObj) {
    throw new Error('result is empty');
  }

  // yaml 
  if (format === 'yaml') {
    return json2yaml.stringify(jsonObj);
  }

  // csv
  if (format === 'csv') {
    if (!Array.isArray(jsonObj)) {
      throw new Error('can not display a non-array result');
    }

    if (jsonObj.length === 0) {
      throw new Error('can not display a empty result');
    }

    if (typeof (jsonObj[0]) !== 'object') {
      throw new Error('output result is empty or item is not object');
    }

    const fields = Object.keys(jsonObj[0]);
    const json2csvParser = new Json2csvParser({ fields });
    return json2csvParser.parse(jsonObj);
  }

  // table
  if (format === 'table') {
    
    if (!Array.isArray(jsonObj)) {
      throw new Error('output result is not Array');
    }
    return cTable.getTable(jsonObj);
  }

  // json
  if (format === 'json') {
    return JSON.stringify(jsonObj, null, 2);
  }
  
  throw new Error(`format ${format} is not supported`);
}

exports.display = function (data, query, format) {
  let jsonObj = JSON.parse(data);
  // query by jmespath
  if (query) {
    jsonObj = jmespath.search(jsonObj, query);
  }

  // convert by format
  return convertFormat(format, jsonObj);
};
