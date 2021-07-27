/**
 * 自动补全逻辑
 */
'use strict';

exports.completion = function (cmd) {
  if (cmd.sub) {
    for (const key of Object.keys(cmd.sub)) {
      console.log(key);
    }
  }

  if (cmd.options) {
    for (const key of Object.keys(cmd.sub)) {
      console.log('--' + key);
    }
    // 添加全局选项
    console.log('--profile');
    console.log('--interaction');
    console.log('--region');
  }
};
