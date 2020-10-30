'use strict';

exports.completion = function (cmd) {
  if (cmd.sub) {
    for (let key in cmd.sub) {
      if (!key) {
        continue;
      }
      console.log(key);
    }
  }
  if (cmd.use === 'arc') {
    return;
  }
  if (cmd.flags) {
    for (let key in cmd.flags) {
      if (!key) {
        continue;
      }
      console.log('--' + key);
    }
    console.log('--profile');
    console.log('--interaction');
    console.log('--region');
  }
};