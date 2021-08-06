'use strict';

const createUI = require('cliui');

// 自适应行宽
exports.lineWrap = function (message) {
  const ui = createUI({ width: 80 });
  ui.div({
    text: message,
    padding: [0, 0, 0, 0],
  });
  return ui.toString();
};
