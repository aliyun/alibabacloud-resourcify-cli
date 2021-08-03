'use strict';

const Command = require('../../lib/command');
const { loadContext } = require('../../lib/context');

function getBashCompletionScript() {
  const packageInfo = require('../../package.json');
  const bins = Object.keys(packageInfo.bin);
  let script = '';
  for (const bin of bins) {
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
  const packageInfo = require('../../../package.json');
  const bins = Object.keys(packageInfo.bin);
  let script = '';
  for (const bin of bins) {
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

module.exports = class extends Command {
  constructor(name) {
    super(name, {
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
    });
  }

  async run(args) {
    const ctx = loadContext(args);
    let script;
    if (ctx.argv[0] === 'bash') {
      script = getBashCompletionScript();
    } else {
      script = getZshCompletionScript();
    }
    console.log(script);
  }
};
