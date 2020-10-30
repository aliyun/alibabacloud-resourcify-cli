'use strict';

exports.completion = function (cmd) {
  if (cmd.sub) {
    for (let key of Object.keys(cmd.sub)) {
      console.log(key);
    }
  }
  if (cmd.options) {
    for (let key of Object.keys(cmd.sub)) {
      console.log('--' + key);
    }
    console.log('--profile');
    console.log('--interaction');
    console.log('--region');
  }
};