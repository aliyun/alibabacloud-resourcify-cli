'use strict';

const output = require('../../../output.js');
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

exports.run = function (argv) {
  if (argv._[0] === 'bash') {
    output.log(`
      # Installation: arc completion >> ~/.bashrc
      #    or arc completion >> ~/.bash_profile on OSX.
      complete -C arc arc
      # end of arc completion
      `
    );
  } else {
    output.log(`
      # Installation: arc completion >> ~/.zshrc
      #    or arc completion >> ~/.zsh_profile on OSX.
      _arc_completions()
      {
        local reply
        local si=$IFS
        IFS=$'
      ' reply=($(COMP_CWORD="$((CURRENT-1))" COMP_LINE="$BUFFER" COMP_POINT="$CURSOR" arc))
        IFS=$si
        _describe 'values' reply
      }
      compdef _arc_completions arc
      # end of arc completion
       `);
  }

};