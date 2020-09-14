'use strict';

exports.cmdObj = {
    use: 'arc',
    desc: {
        zh: 'Alibaba Cloud CLI'
    },
    sub: {
        'arc-tool':{
            zh:'ARC 工具'
        },
        products: {
            zh: '阿里云产品相关命令'
        }
    },
    options: {
        profile: {
            desc: {
                zh: '指定要使用的配置文件'
            }
        },
        region: {
            desc: {
                zh: '指定阿里云区域'
            }
        },
        interaction: {
            vtype: 'boolean',
            alias: 'i',
            desc: {
                zh: '交互式填充参数'
            }
        }
    }
};