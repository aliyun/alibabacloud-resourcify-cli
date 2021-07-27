'use strict';

function getData(value, querys) {
  let result;
  let query = querys[0];
  if (querys.slice(1).length === 0) {
    if (Array.isArray(value)) {
      query = query.replace('[', '');
      query = query.replace(']', '');
      if (query === '*') {
        return value;
      }
      return value[+query];
    }
    return value[query];
  }

  if (Array.isArray(value)) {
    result = [];
    query = query.replace('[', '');
    query = query.replace(']', '');
    if (query === '*') {
      for (const v of value) {
        result.push(getData(v, querys.slice(1)));
      }
      return result;
    }
    query = +query;
  }
  if (!value[query]){
    return undefined;
  }
  return getData(value[query], querys.slice(1));
}

exports.search = function (value, query) {
  if (value === undefined) {
    return undefined;
  }
  const querys = query.split('.');
  let realQuerys = [];
  for (let name of querys) {
    let index = name.match(/\[[\d*]+\]/g);
    const irregular = name.match(/\[.*[^*0-9]+.*\]|(\[\d+\][^[]+)/g);
    if (irregular) {
      return undefined;
    }
    if (index) {
      for (const i of index) {
        name = name.replace(i, '');
      }
    } else {
      index = [];
    }
    realQuerys = realQuerys.concat(name, index);
  }
  return getData(value, realQuerys);
};
