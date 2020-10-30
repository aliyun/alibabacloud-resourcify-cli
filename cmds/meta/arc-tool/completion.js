'use strict';

const output = require('../../../lib/output.js');
exports.cmdObj = {
  desc: {
    zh: '自动补全',
    en: `Autocomplete`
  },
  args: [
    {
      name: 'terminalType',
      required: true,
      choices: [
        'bash',
        'zsh'
      ]
    }
  ]
};
function getBashCompletionScript() {
  let packageInfo = require('../../../package.json');
  let bins = Object.keys(packageInfo.bin);
  let script = '';
  for (let bin of bins) {
    script += `complete -C ${bin} ${bin}\n`;
  }
  script = `
# Installation: arc completion >> ~/.bashrc
# or arc completion >> ~/.bash_profile on OSX.
${script}
# end of arc completion
  `;
  return script;
}

function getZshCompletionScript() {
  let packageInfo = require('../../../package.json');
  let bins = Object.keys(packageInfo.bin);
  let script = '';
  for (let bin of bins) {
    script += `compdef "_arc_completion ${bin}" ${bin}\n`;
  }
  script = `
# Installation: arc completion >> ~/.zshrc
#    or arc completion >> ~/.zsh_profile on OSX.
_arc_completion()
{
  local reply
  local si=$IFS
  IFS=$'
' reply=($(COMP_CWORD="$((CURRENT-1))" COMP_LINE="$BUFFER" COMP_POINT="$CURSOR" $1))
  IFS=$si
  _describe 'values' reply
}
${script}
# end of arc completion
  `;
  return script;
}

exports.run = function (ctx) {
  let script;
  if (ctx.argv[0] === 'bash') {
    script = getBashCompletionScript();
  } else {
    script = getZshCompletionScript();
  }
  output.log(script);
};

