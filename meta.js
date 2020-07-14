'use strict';

exports.cmdObj={
    use:'arc',
    desc:{
        zh:'Alibaba Cloud CLI'
    },
    sub:{
        'config':{
            zh:'配置CLI'
        },
        cs:{
            zh:'容器服务'
        }
    },
    flags:{
        profile:{
            desc:{
                zh:'指定要使用的配置文件'
            }
        },
        region:{
            desc:{
                zh:'指定阿里云区域'
            }
        },
        interaction:{
            vtype:'boolean',
            desc:{
                zh:'交互式填充参数'
            }
        }
    }
};