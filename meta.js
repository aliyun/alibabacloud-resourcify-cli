'use strict';

exports.cmdObj = {
    use: 'arc',
    desc: {
        zh: 'Alibaba Cloud CLI'
    },
    sub: {
        'config': {
            zh: '配置CLI'
        },
        cs: {
            zh: '容器服务'
        },
        completion: {
            zh: '自动补全'
        },
        test: {
            zh: '用于测试arc代码逻辑'
        }
    },
    flags: {
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