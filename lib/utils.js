'use strict';

const fs = require('fs');
const promisify = require('util').promisify;
const path = require('path');

const mkdir = promisify(fs.mkdir);
const exists = promisify(fs.exists);

async function _dir(dir) {
  const exist = await exists(dir);
  if (!exist) {
    await mkdir(dir, {
      recursive: true
    });
  }
  return path.resolve(dir);
}

module.exports = {
  _dir,
};