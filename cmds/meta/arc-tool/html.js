'use strict';
const fs = require('fs');
const cliParse = require('../../../parser.js');
const path = require('path');
exports.cmdObj = {
  desc: {
    zh: '生成网页版doc文档',
    en: `Generate web version doc document`
  },
};

exports.run = function () {
  let data = generateList('../../../cmds/meta/arc');
  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
<style type="text/css">
li:hover{
background-color: cyan;
}
html,body{
height:100%
}
</style>  
<meta charset="utf-8" />
<title>React App</title>
</head>
<body>
<div style="height:95%;width:15%;float:left;overflow:auto">
${data}
</div>
<iframe id="aid" style="float: left; height: 95%; width: 80%;overflow:auto"></iframe>
</ifram>
<ul></ul>
<script>
var last="none"
function demo(x){
var l=document.getElementsByClassName(last)
if (l.length!==0){
l[0].style.backgroundColor=""
}
x.style.backgroundColor="cyan"
last=x.className
document.getElementById("aid").src=\`./src\${x.className}.html\`    
}
</script>
</body>
</html>
`;
  fs.writeFileSync(path.join(__dirname, '../../../front/index.html'), html);
};

function generateList(path) {
  let html = `<ul style="list-style: none;padding-left: 10px;">\n`;
  let meta = require(path + '.js');
  if (!meta.cmdObj.sub) {
    return '';
  }
  for (let sub in meta.cmdObj.sub) {
    let p = path.replace('../../../cmds/meta/arc', '');
    p = `${p}/${sub}`;
    let delimLen = (p.match(/\//g) || []).length;
    let promt = '';
    switch (delimLen) {
    case 1:
      promt = 'resources';
      break;
    case 2:
      promt = 'actions';
      break;
    case 3:
      promt = 'options';
      break;
    }
    html += `<li class="${p}" onclick='demo(this)'>${sub}</li>\n`;
    generateContent(`${path}/${sub}`, promt);
    html += generateList(`${path}/${sub}`);
  }
  html += `</ul>\n`;
  return html;
}

function generateContent(dirPath, promt) {
  let meta = require(dirPath + '.js');
  let cmdObj = meta.cmdObj;
  let title = cmdObj.use;
  let syntax = '';
  let sub = '';
  let options = '';
  if (meta.run) {
    let optionArg = '';
    if (cmdObj.usage) {
      for (let usage of cmdObj.usage) {
        usage = usage.replace(/</g, '&lt;');
        usage = usage.replace(/>/g, '&gt;');
        syntax += `<tr><td><code>${usage}</code></td></tr>\n`;
      }
    } else {
      if (cmdObj.args) {
        for (let value of cmdObj.args) {
          if (value.required) {
            optionArg += `&lt;${value.name}&gt; `;
          } else {
            optionArg += `[${value.name}] `;
          }
        }
        if (cmdObj.options) {
          optionArg += `[options]`;
        }
        syntax += `<tr><td><code>${cmdObj.use} ${optionArg}</code></td></tr>\n`;
      } else {
        if (cmdObj.options) {
          syntax += `<tr><td><code>${cmdObj.use} [options]</code></td></tr>\n`;
        } else {
          syntax += `<tr><td><code>${cmdObj.use}</code></td></tr>\n`;
        }
      }
    }
  }
  if (cmdObj.sub) {
    syntax += `<tr><td><code>${cmdObj.use} [${promt}]</code></td></tr>\n`;
    sub += `<tr><th style="text-align: left;">${promt}</th></tr>\n`;
    for (let s in cmdObj.sub) {
      sub += `
            <tr>
            <td>${s}</td>
            <td>${cmdObj.sub[s].zh}</td>
            </tr>`;
    }
  }
  if (cmdObj.options) {
    options += `<table>
        <tr><th style="text-align: left;">options</th></tr>\n`;
    let opts = cliParse.transOpts(cmdObj.options);
    if (opts._required) {
      for (let option of opts._required) {
        if (Array.isArray(option)) {
          continue;
        }
        options += `<tr>
                <td>--${option}</td>
                <td style="width:100px">${opts[option].required || 'false'}</td>
                <td style="width:100px">${opts[option].vtype || 'string'}</td>
                <td style="width:500px">${opts[option].desc.zh}</td>
            </tr>\n`;
      }
    }
    for (let option of opts._transed) {
      if (opts._required.indexOf(option) !== -1) {
        continue;
      }
      options += `<tr>
                <td>--${option}</td>
                <td style="width:100px">${opts[option].required || 'false'}</td>
                <td style="width:100px">${opts[option].vtype || 'string'}</td>
                <td style="width:500px">${opts[option].desc.zh}</td>
            </tr>\n`;
    }
    options += `</table>`;
  }
  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
    </head>
    <body>
        <h1>${title}</h1>
        <table>
        <tr>${cmdObj.desc.zh} </tr>
            <tr><th style="text-align: left;">syntax</th></tr>
            ${syntax}
            ${sub}
        </table>
            ${options}
    </body>
    </html>`;
  let dir = path.dirname(path.join(__dirname, dirPath.replace('cmds/meta/arc', 'front/src')));
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  fs.writeFileSync(path.join(__dirname, dirPath.replace('cmds/meta/arc', 'front/src')) + '.html', html);
}