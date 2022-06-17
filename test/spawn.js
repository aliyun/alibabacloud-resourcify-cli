'use strict';

const cp = require('child_process');

module.exports = function spawn(modulePath, args, options) {
  return new Promise((resolve, reject) => {
    const p = cp.spawn(modulePath, args, options);
    const stdout = [];
    p.stdout.on('data', (chunk) => {
      stdout.push(chunk);
    });

    const stderr = [];
    p.stderr.on('data', (chunk) => {
      stderr.push(chunk);
    });

    p.on('exit', (code) => {
      resolve({
        stdout: Buffer.concat(stdout).toString('utf-8'),
        stderr: Buffer.concat(stderr).toString('utf-8'),
        code: code
      });
    });

    p.on('error', (err) => {
      reject(err);
    });
  });
};