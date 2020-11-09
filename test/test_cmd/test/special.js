
'use strict';

exports.cmdObj = {
  desc: {
    zh: 'unchanged与mapping参数解析'
  },
  options: {
    'unchange-flag': {
      unchanged: true,
      default: 'default'
    },
    'unchange-mapping-flag': {
      mapping: 'unchangedMappingFlag',
      unchanged: true,
      default: 'unchange'
    },
    'mapping-flag': {
      mapping: 'mappingFlag'
    },
    region: {
      mapping: 'RegionId'
    }
  }
};

exports.run = function () { };